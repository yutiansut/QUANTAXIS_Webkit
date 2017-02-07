<template>
    <div>
        <h1>query</h1>
        <div>
          <ul>
            <li><input v-model="message" v-on:keyup.enter="querybyname($event.currentTarget.value)"placeholder="edit me" lazy></li>
            <li><p>Message is: {{ message }}</p></li>
            
            </div>
          </ul>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'axios',
    data: function (){
      return {  
        message:1
      }
    },
    methods:{
      query(){
        axios.get('http://localhost:3000/apis/querytitlebyName?name=%E6%9C%9D%E9%B2%9C')
            .then(function (response) {
              console.log(response.data[1]);
              var data1 = response.data;
              return data1
              })
          .catch(function (error) {
            console.log(error);
            });
      },
      querybyname(message){
        let val='name='+message
        console.log(val)
         axios.get('http://localhost:3000/apis/querytitlebyName?'+val)
            .then(function (response) {
              console.log(response.data[1]);
              var data = response.data;
              return data
              })
          .catch(function (error) {
            console.log(error);
            });
      }
    }
}


</script>