<script>
import { useToiletStore } from '@/stores/toiletStore';
import axios from 'axios'

  export default {

    setup() {
    const store = useToiletStore(); // ✅ 문제 없음
    return { store };
    },
      URL : 'http://192.168.57.5:5000/state',
      data: () => ({
      items: [

      ],
      
    }),

    created(){
      axios.get('http://localhost:3000/get_toilet_info')
        .then(contacts =>{
        const data = contacts.data;
        for(let i = 0; i<data.length; i++)
        {
          this.items.push(data[i]);
        }
        console.log(this.items);
      })
    },

    method:{
      State_Control(){
        axios.get(URL); //사용가능표시제어 관리자가 직접제어
      },
      Update_Data(ToiletId,Temperature,Humidity,State,Weight){
        const data = {
          ToiletId : ToiletId,
          Temperature : Temperature,
          Humidity : Humidity,
          State : State,
          Weight : Weight,
        }
        axios.put('http://localhost:3000/put_toilet_info/', data)
      }
    }
  }

</script>

<template>


  <v-container>
    <h2>🛠 관리자 페이지</h2>
    <v-card
      v-for="toilet in items"
      :key="toilet.ToiletId"
    >
      <v-card-title>{{ toilet.ToiletId }}번 화장실</v-card-title>
      <v-card-text>
        상태: <strong>{{ toilet.State ? '사용 불가' : '사용 가능' }}</strong><br>
        휴지: <strong>{{ toilet.Weight > 30 ? '충분' : '부족' }}</strong><br>
        온도: <strong>{{ toilet.Temperature}}</strong><br>
        습도: <strong>{{ toilet.Humidity}}</strong><br>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="State_Control()">
          {{ toilet.State ? '사용 가능으로' : '사용 불가로' }}
        </v-btn>
        <v-btn @click="Update_Data(toilet.ToiletId, toilet.Temperature, toilet.Humidity, toilet.State, toilet.Weight)">
          업데이트
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>


