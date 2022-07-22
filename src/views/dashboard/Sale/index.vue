<template>
    <el-card class="box-card" style="margin:10px 0">
        <div slot="header" class="clearfix">
            <el-tabs class="tab" v-model="activeName">
                 <!-- @tab-click="handleClick" -->
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visit"></el-tab-pane>
            </el-tabs>
            <div class="right">
                <span @click="setDate">今日</span>
                <span @click="setWeek">本周</span>
                <span @click="setMonth">本月</span>
                <span @click="setYear">本年</span>
                <el-date-picker
                    v-model="date"
                    value-format="yyyy-MM-dd"
                    class="date"
                    size="mini"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <div>
            <el-row :gutter="10">
                <el-col :span="20">
                    <div class="charts" ref="charts"></div>
                </el-col>
                <el-col :span="4">
                    <div class="bottomRight">
                        <h3>门店{{title}}排名</h3>
                        <ul v-if="title=='销售额'">
                            <li v-for="(pro,index) in listState.orderRank" :key="pro.no">
                                <span :class="[index<3?'rindex':'rindex1']">{{index+1}}</span>
                                <span>{{pro.name}}</span>
                                <span class="rvalue">{{pro.money}}</span>
                            </li>
                        </ul>
                        <ul v-else>
                            <li v-for="(pro,index) in listState.userRank" :key="pro.no">
                                <span :class="[index<3?'rindex':'rindex1']">{{index+1}}</span>
                                <span>{{pro.name}}</span>
                                <span class="rvalue">{{pro.money}}</span>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import {mapState} from 'vuex'

export default {
    name:'Sale',
    data(){
        return{
            activeName:"sale",
            myCharts:null,
            date:[],
        }
    },
    mounted(){
        this.myCharts = echarts.init(this.$refs.charts)
        this.myCharts.setOption({
            title:{
                text:'销售额趋势'
            },
            tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: true
            }
            }
        ],
        yAxis: [
            {
            type: 'value'
            }
        ],
        series: [
            {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: [],
            color:'#409eff'
            }
        ]
        })
    },
    watch:{
        title(){
            this.myCharts.setOption({
                title:{
                    text:this.title+'趋势'
                },
                xAxis:{
                    data:this.title == '销售额'?this.listState.orderFullYearAxis:this.listState.userFullYearAxis
                },
                series: [
                    {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data:this.title == '销售额'?this.listState.orderFullYear:this.listState.userFullYear,
                    color:'#409eff'
                    }
                ]
            })
        },
        listState(){
            this.myCharts.setOption({
            title:{
                text:'销售额趋势'
            },
            tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
            type: 'category',
            data: this.listState.orderFullYearAxis,
            axisTick: {
                alignWithLabel: true
            }
            }
        ],
        yAxis: [
            {
            type: 'value'
            }
        ],
        series: [
            {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.listState.orderFullYear,
            color:'#409eff'
            }
        ]
        })
        }
    },
    computed:{
        title(){
            return this.activeName == 'sale'?'销售额':'访问量'
        },
        ...mapState({
            listState:state=>state.home.list
        })
    },
    methods:{
        setDate(){
            const day = dayjs().format('YYYY-MM-DD')
            this.date = [day,day]
        },
        setWeek(){
            const start = dayjs().day(1).format('YYYY-MM-DD')
            const end = dayjs().day(7).format('YYYY-MM-DD')
            this.date = [start,end]
        },
        setMonth(){
            const start = dayjs().startOf('month').format('YYYY-MM-DD')
            const end = dayjs().startOf('month').format('YYYY-MM-DD')
            this.date = [start,end]
        },
        setYear(){
            const start = dayjs().startOf('year').format('YYYY-MM-DD')
            const end = dayjs().startOf('year').format('YYYY-MM-DD')
            this.date = [start,end]
        }
    }
}
</script>

<style scoped>
    .clearfix{
        position:relative;
        display: flex;
        justify-content: space-between;
    }
    .tab{
        width: 100%;
    }
    .right{
        position: absolute;
        right: 0;
    }
    .right span{
        margin: 0 10px;
    }
    .date{
        width: 200px!important;
        margin: 0 20px;
    }
    .charts{
        width: 100%;
        height: 300px;
    }
    ul{
        list-style: none;
        width: 100%;
        height: 300px;
        padding: 0;
    }
    ul li{
        height: 8%;
        margin: 10px 0;
    }
    .rindex{
        float: left;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: black;
        color:white;
        text-align: center;
    }
    .rvalue{
        float: right;
    }
    .rindex1{
    padding: 0 5px;
    }
</style>