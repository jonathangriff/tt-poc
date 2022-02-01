<template>
  <div class="heading">
    <h1>{{ msg }}</h1>
    <p>
      POC using Travel Time API.
    </p>
      <ul>
        <li>Geocoding (Search)</li>
        <li>Distance Martix API</li>
        <li>Isochrones (Time Map)</li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'Heading',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.heading {
  text-align: center;
  max-width: 500px;
  margin: 0 auto 2rem;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
h3 {
  margin: 40px 0 0;
}
a {
  color: #42b983;
}
</style>
