<template>
  <v-container>
    <h2>🚻 화장실 현황</h2>
    <v-row>
      <v-col
        v-for="toilet in store.toilets"
        :key="toilet.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card :color="toilet.available ? 'green lighten-4' : 'red lighten-4'">
          <v-card-title>{{ toilet.name }}</v-card-title>
          <v-card-text>
            상태: <strong>{{ toilet.available ? '사용 가능' : '사용 불가' }}</strong><br>
            휴지: 
            <strong :style="{ color: toilet.tissue ? 'black' : 'yellow' }">
              {{ toilet.tissue ? '정상' : '부족' }}
            </strong>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useToiletStore } from '@/stores/toiletStore';

const store = useToiletStore();
</script>
