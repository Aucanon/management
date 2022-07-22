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
                    type:'line',
                    data:[10,18,5,12,40,30,2,16],
                    //拐点样式
                    itemStyle:{
                        opacity:0
                    },
                    //线条样式
                    lineStyle:{
                        color:'purple'
                    },
                    //填充颜色
                    areaStyle:{
                        color:// 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                            {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'purple' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#fff' // 100% 处的颜色
                                }],
                                global: false // 缺省为 false
                            },
                    }
                }
            ],
            grid:{
                left:0,
                top:0,
                right:0,
                bottom:0
            }
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