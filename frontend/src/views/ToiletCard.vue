<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
let Temperature = 0.0
let Humidity = 0.0
let Count = 0
const items = ref([]); 
  onMounted(() => {
  axios.get('http://localhost:3000/get_toilet_info')
    .then(response => {
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        items.value.push(data[i]); // ✅ this 대신 items.value 사용
      }
      console.log(items.value);
    })
    .catch(error => {
      console.error('Error fetching toilet info:', error);
    });


    socket.on('ToiletData', data => {
      items.value = data;
      Temperature = data[1].Temperature
      Humidity = data[1].Humidity
      Count = data[1].Count
    });

    socket.on("Alert", (data) => {
      alert(data);
    });
});

setInterval(() => {
  socket.emit('Updata')
}, 500); 
  

</script>

<template>
  <v-container>
    <h2>🚻 화장실 칸 현황</h2>
    <v-row>
      <v-col
        v-for="toilet in items"
        :key="toilet.ToiletId"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card :color="toilet.State ? 'red lighten-4' : 'green lighten-4'">
          <v-card-title>{{ toilet.ToiletId }}번 칸</v-card-title>
          <v-card-text>
            상태: <strong>{{ toilet.State ? '사용 불가' : '사용 가능' }}</strong><br>
            휴지: <strong>{{ toilet.Weight > 30 ? '충분' : '부족' }}</strong><br>
            온도: <strong>{{ toilet.Temperature}}</strong><br>
            습도: <strong>{{ toilet.Humidity}}</strong><br>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <h2>🚻 화장실 칸 현황</h2>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
      >
        <v-card :color=green lighten-4>
          <v-card-text>
            온도: <strong>{{ Temperature}}</strong><br>
            습도: <strong>{{ Humidity}}</strong><br>
            이용자수 : <strong>{{ Count}}</strong><br>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>
