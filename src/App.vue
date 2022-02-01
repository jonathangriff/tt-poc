<template>
  <div id="app">
    <Heading msg="Travel Time POC"/>
    <div v-if="!isLoading">
      <SearchInput 
        :handle-location-select="handleLocationSelect"
      />
      <div v-if="Object.values(selectedLocation).length">
        <h3>Lat: {{ selectedLocation.geometry.coordinates[0] }} Lng: {{ selectedLocation.geometry.coordinates[1]  }}</h3>
        <Search 
          :all-search-results="allSearchResults"
          :selection-location="selectedLocation"
        />
      </div>
    </div>
    <div v-if="isLoading">
      Fetching developments ...
    </div>
  </div>
</template>

<script>
import Heading from './components/Heading.vue'
import SearchInput from './components/SearchInput.vue';
import Search from './components/Search.vue';

import getDevelopments from './components/util/get-developments';
import splitGeoIntoLatLng from './components/util/split-geo-lat-lng';

export default {
  name: 'App',
  components: {
    Heading,
    SearchInput,
    Search,
  },

  data() {
    return {
      selectedLocation: '',
      allSearchResults: [],
      isLoading: true,
    };
  },

  async created() {
        const developmentsResponseData = await getDevelopments(`${window.location.origin}/search.json`);
        const { error } = developmentsResponseData;

        if (error) {
            console.error('Search results data unavailable', error);

            return;
        }

        const results = developmentsResponseData.searchData.results
            .filter(item => item.geo)
            .map((item) => {
                const coords = splitGeoIntoLatLng(item.geo);

                return {
                    ...item,
                    coords
                };
            });

     
        this.allSearchResults = results;
        this.isLoading = false;
  },

  methods: {
    handleLocationSelect(value) {
      this.selectedLocation = value;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
