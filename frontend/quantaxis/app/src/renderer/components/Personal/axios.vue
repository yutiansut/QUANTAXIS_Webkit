<template>
    <div>
        <h1>axios</h1>
        <div>
          <ul>
            <li><input v-model="message" placeholder="edit me"></li>
            <li><p>Message is: {{ message }}</p></li>
          </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
axios.get('http://localhost:3000/apis/querytitlebyName?name=%E6%9C%9D%E9%B2%9C')
  .then(function (response) {
    console.log(response.data[1]);
    var data = response.data;
    return data
  })
  .catch(function (error) {
    console.log(error);
  });
export default {
    name: 'axios',
    data: function (){
      return {  
        message:1
      }
    }
}


</script>