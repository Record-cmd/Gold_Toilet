<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const URL = 'http://192.168.132.5:5000/state';

// 반응형 상태
const Control_State_Admin = ref(false);
const items = ref([]); // ✅ 리스트도 반응형으로 선언해야 함
  onMounted(() => {
    /*
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
    });*/
    get_Toilet_data()

});

// 버튼 클릭 시 상태 토글
function State_Control(ToiletId) {
  axios.get(URL)
    .then(response => {
      Control_State_Admin.value = response.data.Control_State_Admin;
    })
    .catch(error => {
      console.error('Error toggling state:', error);
    });
    console.log(Control_State_Admin)
}

function  Update_Data(ToiletId,Temperature,Humidity,State,Weight){
  const data = {
    ToiletId : ToiletId,
    Temperature : Temperature,
    Humidity : Humidity,
    State : !State,
    Weight : Weight,
  }
  axios.put('http://localhost:3000/put_toilet_info/', data)
  get_Toilet_data()
}

function get_Toilet_data(){
  axios.get('http://localhost:3000/get_toilet_info')
    .then(response => {
      const data = response.data;
      items.value = data
      console.log(items.value);
    })
    .catch(error => {
      console.error('Error fetching toilet info:', error);
    });
}


  

</script>

<template>


  <v-container>
    <h2>🛠 관리자 페이지</h2>
    <v-card
      v-for="toilet in items"
      :key="toilet.ToiletId"
    >
      <v-card-title>{{ toilet.ToiletId }}번 칸</v-card-title>
      <v-card-text>
        상태: <strong>{{ toilet.State ? '사용 불가' : '사용 가능' }}</strong><br>
        휴지: <strong>{{ toilet.Weight > 30 ? '충분' : '부족' }}</strong><br>
        온도: <strong>{{ toilet.Temperature}}</strong><br>
        습도: <strong>{{ toilet.Humidity}}</strong><br>
        제어상태: <strong>{{ Control_State_Admin ? '수동제어':'자동제어'}}</strong><br>
        이용자 수: <strong>{{ toilet.Count}} 명</strong><br>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="State_Control(toilet.ToiletId)">
          {{ Control_State_Admin ? '자동제어로' : '수동제어로' }}
        </v-btn>
        <v-btn @click="Update_Data(toilet.ToiletId, toilet.Temperature, toilet.Humidity, toilet.State, toilet.Weight)">
          {{  toilet.State ? '사용가능로' : '사용불가로'  }}
          상태 변경
        </v-btn>    
      </v-card-actions>
    </v-card>
  </v-container>
</template>


