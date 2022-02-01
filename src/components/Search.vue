<template>
  <div class="results">
    <ul class="results__list">
      <li class="results__listing" v-for="(result, index) in orderedResults" :key="index">
        <h3>{{ result.name }}</h3>
        <div class="traveltime">
            <span class="traveltime__span">
                Travel time: {{ new Date(result.travel_time * 1000).toISOString().substr(11, 8) }}
            </span>
            <span class="traveltime__span">
                Distance: {{ (result.distance*0.000621371192).toFixed(2) }}miles
            </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Search",

  props: {
    selectionLocation: {
      type: Object,
      require: true,
    },
    allSearchResults: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      orderedResults: [],
    };
  },

  watch: {
    selectionLocation(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.handleSearch();
      }
    },
  },

  created() {
    this.handleSearch();
  },

  methods: {
      fomratDataToSend() {
        const data = {
            "locations": [
                {
                    "id": 'selectedSearchLocation',
                    "coords": {
                        "lat": this.selectionLocation.geometry.coordinates[1],
                        "lng": this.selectionLocation.geometry.coordinates[0]
                    }

                },
                ...this.allSearchResults,
            ],
            "departure_searches": [
                {
                    "id": "developmentSearch",
                    "departure_location_id": "selectedSearchLocation",
                    "arrival_location_ids": this.allSearchResults.map(item => item.id),
                    "transportation": {
                        "type": "driving"
                    },
                    "departure_time": new Date().toJSON(),
                    "travel_time": 3600,
                    "properties": [
                        "travel_time",
                        "distance"
                    ]
                }
            ]
        };

        return data;
    },

    handleSearch() {
        const data = this.fomratDataToSend();

        fetch('https://api.traveltimeapp.com/v4/time-filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Application-Id': '1bef5cc2',
                'X-Api-Key': '91a60ff402639ba014fe21f95348610a',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            this.matchResultsAndSortByTravelTime(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    },

    matchResultsAndSortByTravelTime({ results }) {
        const matchingResults = this.allSearchResults.filter(item => results[0].locations.some(loc => loc.id === item.id))
            .map(item => {
                const travelTime = results[0].locations.filter(loc => loc.id === item.id);

                return {
                    ...item,
                    ...travelTime[0].properties[0],
                }
            })
            .sort((a, b) => a.travel_time - b.travel_time);


        this.orderedResults = matchingResults;
    },
},
};
</script>

<style scoped>
.results {
  position: relative;
  max-width: 600px;
  display: flex;
  margin: 2rem auto 0;
}
.results__list {
    display: grid;
    grid-template-columns: repeat(3, 33.333%);
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
    list-style: none;
    padding: 0;
}
.results__listing {
    border: 1px solid silver;
    padding: 1rem;
    border-radius: 4px;
}
</style>
