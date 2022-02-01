<template>
  <div class="search">
    <input v-model="query" placeholder="Search" />
    <div class="autocomplete" v-if="autocomplete.length">
        <ul>
            <li
                v-for="(result, index) in autocomplete" 
                :key="index"
                @click="handleSelection(result)"
            >
                {{ result.properties.name }}
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
  name: 'SearchInput',

  props: {
      handleLocationSelect: {
          type: Function,
          required: true,
      },
  },

  watch: {
      query() {
          if (this.query.length > 3) {
              this.geoLocationSearch();
          } else {
              this.autocomplete = [];
          }
      },
  },

  data() {
      return {
          autocomplete: [],
          query: '',
      };
  },

  methods: {
      geoLocationSearch() {
        fetch(`https://api.traveltimeapp.com/v4/geocoding/search?query=${this.query}&within.country=GB`, {
            method: 'GET',
            headers: {
                'X-Application-Id': '1bef5cc2',
                'X-Api-Key': '91a60ff402639ba014fe21f95348610a',
                'Accept-Language': 'en'
            },

        })
        .then(response => response.json())
        .then(data => {
            this.autocomplete = data.features;
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      },
      handleSelection(result) {
          this.autocomplete = [];

          this.$nextTick(() => {
            this.handleLocationSelect(result);
          })
      }
  }
}
</script>

<style scoped>
.search {
    position: relative;
    max-width: 600px;
    display: flex;
    justify-content: center;
    flex-flow: column;
    margin: 0 auto;
}
input {
    border: 1px solid silver;
    padding: 1rem;
    border-radius: 3px;
}
.autocomplete {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: 1px solid silver;
    margin-top: 0.5rem;
    border-radius: 3px;
    overflow: hidden;
    background-color: white;
    z-index: 100;
}
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-flow: column;
}
li {
  display: block;
  padding: 10px;
  cursor: pointer;
}
li + li {
    border-top: 1px solid silver;
}
a {
  color: #42b983;
}
</style>
