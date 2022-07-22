<template>
    <div>
        <div class="header">
            <span class="search-header">搜索用户数</span>
                <svg t="1658124577674" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2252" width="26" height="26"><path d="M512 958.016C266.08 958.016 65.984 757.952 65.984 512 65.984 266.08 266.08 65.984 512 65.984c245.952 0 446.016 200.064 446.016 446.016C958.016 757.952 757.952 958.016 512 958.016zM512 129.984C301.344 129.984 129.984 301.344 129.984 512c0 210.624 171.36 382.016 382.016 382.016 210.624 0 382.016-171.36 382.016-382.016C894.016 301.344 722.624 129.984 512 129.984z" p-id="2253"></path><path d="M512 304m-48 0a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0Z" p-id="2254"></path><path d="M512 768c-17.664 0-32-14.304-32-32l0-288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288C544 753.696 529.664 768 512 768z" p-id="2255"></path></svg>
        </div>
        <div class="main">
            <span class="main-title">{{listState.visitTotal}}</span>
            <span class="main-content">{{listState.visitToday}}</span>
            <svg t="1658133478981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3436" width="16" height="16"><path d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z" p-id="3437" fill="#d81e06"></path></svg>
            <svg t="1658133634285" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4690" width="16" height="16"><path d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z" p-id="4691" fill="#1afa29"></path></svg>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import {mapState} from 'vuex'

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
                        color:'rgb(76,148,226)'
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
                                    offset: 0, color: 'rgb(76,148,226)' // 0% 处的颜色
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
    },
    computed:{
    ...mapState({
        listState:state=>state.home.list
    })
    },
}
</script>

<style scoped>
    .header{
        display: flex;
        align-items: center;
        color:rgb(150, 141, 141);
    }
    .search-header{
        margin-right: 20px;
    }
    .main{
        margin:10px 0 ;
    }
    .main-title{
        margin-right: 30px;
    }
    .main-content{
        margin-right: 10px;
    }
    .charts{
        width: 100%;
        height: 50px;
    }
</style>