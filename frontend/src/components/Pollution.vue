<script>
import axios from 'axios';
import { defineEmits } from "vue";

export default {
    data(){
        return{
            region:["마포구","강서구","강동구"], //출력할 지역
            index:0, //region 리스트의 index
            output:null, //출력할 내용
            pm10:null,
            pm25:null,
            emit : defineEmits(["Pollution"]),
        }
    },

    created(){
        this.Pollution();
    },
        


    methods:{
        Pollution : function(){
            axios.get(`http://localhost:3000/airkorea/${this.region[this.index]}`)
                .then((req) =>{
                    this.output = `관측소 : ${req.data.region},     Pm10 : ${req.data.pm10},     Pm25 : ${req.data.pm25}`;
                    this.pm10 = req.data.pm10;
                    this.pm25 = req.data.pm25;
                    this.index++;
                    this.$emit('Pollution', this.pm10, this.pm25);
                    if(this.index > 2)
                    {
                        this.index = 0;
                    }
                })
            },
        }
}
        
</script>
<template>
    <div>
        <form>
            <input type="text" v-model = "output" readonly/>
            <v-btn @click = "Pollution">다음지역</v-btn>
        </form>
    </div>

</template>
<style scoped>
    div{
    align-content: center;
    padding: 5px;
    }
    input{
        width: 345px;
        height: 65px;
        padding: 0 20px;
        border: 1px solid black;
        border-radius: 30px;
    }
</style>