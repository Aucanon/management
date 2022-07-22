<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'

export default {
    name:'lineChart',
    mounted(){
        //初始化echats实例
        let lineCharts = echarts.init(this.$refs.charts)
        //配置
        lineCharts.setOption({
            xAxis:{
                show:false,
                type:'category'
            },
            yAxis:{
                show:false
            },
            series:[
                {
                    type:'bar',
                    data:[12,20,13,15,25,11,5,10,10,19,3,30],
                    color:'#409eff'
                }
            ],
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0
            },
            tooltip:{}
        })
    }
}
</script>

<style scoped>
    .charts{
        width: 100%;
        height: 100%;
    }
</style>