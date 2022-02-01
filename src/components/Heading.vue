<template>
  <div class="heading">
    <h1>{{ msg }}</h1>
    <p>
      POC using Travel Time API. <br>
      Geocoding (Search) <br>
      Distance Martix API
    </p>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
