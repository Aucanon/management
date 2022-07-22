<template>
    <el-card>
        <div slot="header" class="header">
            <div class="catgory-header">
                <span>销售额类别占比</span>
                <el-radio-group v-model="activeName" @change="changeTitle">
                <el-radio-button label="全部渠道"></el-radio-button>
                <el-radio-button label="线上"></el-radio-button>
                <el-radio-button label="门店"></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div>
            <div class="charts" ref="charts"></div>
        </div>
    </el-card>
</template>

<script>
import echarts from 'echarts'
import {mapState} from 'vuex'

export default {
    name:'Category',
    data(){
        return{
            activeName:'全部渠道'
        }
    },
    mounted(){
        let myCharts = echarts.init(this.$refs.charts)
        myCharts.setOption({
            title:{
                text:'',
                subtext:1048,
                left:'center',
                top:'center'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                },
                labelLine: {
                    show: true,
                },
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                    // listState.saleRank.online.forEach(item=>{
                    //     {value:item.value,name:item.name}
                    // })
                ]
                }
            ]
        })
        //绑定事件
        myCharts.on('mouseover',(params)=>{
            const {name,value} = params.data
            myCharts.setOption({
                title:{
                    text:name,
                    subtext:value
                }
            })
        })
    },
    computed:{
        // activeName(){
        //     if(this.activeName == '全部渠道') return 
        // },
        ...mapState({
            listState:state=>state.home.list
        })
    },
    methods:{
        changeTitle(value){
            this.activeName = value
        }
    }
}
</script>

<style scpoed>
    .catgory-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .header{
        border-bottom: 1px solid #eee;
    }
    .charts{
        width: 100%;
        height: 300px;
    }
</style>