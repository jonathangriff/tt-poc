<template>
  <div class="map">
    <LMap
      ref="map"
      style="height: 800px; width: 100%"
      :zoom="zoom"
      :center="location"
    >
      <LTileLayer :url="url" :attribution="attribution"></LTileLayer>
      <!-- Searched location -->
      <LMarker :key="location[0]" :lat-lng="location">
        <l-icon
          :icon-size="[30, 30]"
          :icon-anchor="[30, 30]"
          icon-url="https://cdn-icons-png.flaticon.com/512/106/106438.png"
        />
      </LMarker>
      <!-- Development markers -->
      <LMarker
        v-for="marker in orderedResults"
        :key="marker.id"
        :lat-lng="marker.coords"
      >
        <LIcon
          :icon-size="[30, 37]"
          icon-url="https://www.barratthomes.co.uk/dist/images/map/marker-bar.svg"
        />

        <LPopup>
          <div>
            <h3>{{ marker.name }}</h3> <br />
            Travel time:
            {{
              new Date(marker.travel_time * 1000).toISOString().substr(11, 8)
            }}
            <br />
            Distance: {{ (marker.distance * 0.000621371192).toFixed(2) }}miles
          </div>
        </LPopup>
      </LMarker>
      <LPolygon
        v-for="(shape, index) in isochrone"
        :key="index"
        :lat-lngs="shape.shell"
        color="#32571e"
        fill-color="#a3ca35"
      />
    </LMap>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPopup,
  LPolygon,
} from "vue2-leaflet";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup,
    LPolygon,
  },

  props: {
    orderedResults: {
      type: Array,
      required: true,
    },
    selectionLocation: {
      type: Object,
      require: true,
    },
    maxTime: {
      type: String,
      required: true,
    },
    transportType: {
      type: String,
      required: true,
    },
  },

  watch: {
    selectionLocation(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.sendTimeMapRequest();
      }
    },
    maxTime(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.sendTimeMapRequest();
      }
    },
    transportType(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.sendTimeMapRequest();
      }
    },
  },

  computed: {
    location() {
      return [
        this.selectionLocation.geometry.coordinates[1],
        this.selectionLocation.geometry.coordinates[0],
      ];
    },
  },

  data() {
    return {
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      icon: icon({
        iconSize: [32, 37],
        iconAnchor: [16, 37],
      }),
      isochrone: [],
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.sendTimeMapRequest();
    });
  },

  methods: {
    sendTimeMapRequest() {
      const dataToSend = {
        departure_searches: [
          {
            id: "first_location",
            coords: {
              lat: this.selectionLocation.geometry.coordinates[1],
              lng: this.selectionLocation.geometry.coordinates[0],
            },
            transportation: {
              type: this.transportType,
            },
            departure_time: new Date().toJSON(),
            travel_time: this.maxTime,
          },
        ],
        arrival_searches: [],
      };

      fetch("https://api.traveltimeapp.com/v4/time-map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "X-Application-Id": "1bef5cc2",
          "X-Api-Key": "91a60ff402639ba014fe21f95348610a",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          this.isochrone = data.results[0].shapes;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error("Error:", error);
        });
    },
  },
};
</script>

<style scoped>
.map {
  margin-top: 3rem;
}
</style>


