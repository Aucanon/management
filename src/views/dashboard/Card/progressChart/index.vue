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
                //最大值最小值
                min:0,
                max:100

            },
            yAxis:{
                show:false,
                type:'category'
            },
            series:[
                {
                    type:'bar',
                    data:[76],
                    color:'yellowgreen',
                    barWidth:'10px',
                    showBackground:true,
                    label:{
                        show:true,
                        formatter:'|',
                        position:'right'
                    }
                }
            ],
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0
            },
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