<template>
    <div>
        <h1>axios</h1>
    </div>
</template>
<script>
import axios from 'axios'


axios.get('http://localhost:3000/apis/querytitlebyName?name=%E6%9C%9D%E9%B2%9C')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
</script>