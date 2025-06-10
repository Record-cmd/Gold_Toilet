<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const items = ref([]); 
const info = ref([]); 
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
    });

    socket.on("Alert", (data) => {
      alert(data);
    });
    socket.on("Toilet_Info_Data",(data)=>{
      info.value=data;
      console.log(info.value);
    })
});

setInterval(() => {
  socket.emit('Updata')
  socket.emit('Updata_info', 2)
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
    <h2>🚻 화장실 내부 정보</h2>
    <v-row>
      <v-col
        v-for="toilet in [info]"
        :key="toilet.ToiletId"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card color="white">
          <v-card-text>
            온도: <strong>{{ toilet.Temperature}}</strong><br>
            습도: <strong>{{ toilet.Humidity}}</strong><br>
            내부인원: <strong>{{ toilet.Count}}</strong><br>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>
