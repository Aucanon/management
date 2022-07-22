<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="6">
                <el-card>
                    <Detail title="总销售额" :count="'￥'+ listState.salesTotal">
                        <template slot="charts"> 
                            <span>周同比 &nbsp;&nbsp; {{listState.salesGrowthLastDay}}%
                                <svg v-if="listState.salesGrowthLastDay>0" t="1658133478981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3436" width="16" height="16"><path d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z" p-id="3437" fill="#d81e06"></path></svg>
                                <svg v-else t="1658133634285" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4690" width="16" height="16"><path d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z" p-id="4691" fill="#1afa29"></path></svg>
                            </span>
                            &nbsp;
                            <span>月同比&nbsp;&nbsp; {{listState.salesGrowthLastMonth}}%
                                <svg v-if="listState.salesGrowthLastMonth>0" t="1658133478981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3436" width="16" height="16"><path d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z" p-id="3437" fill="#d81e06"></path></svg>
                                <svg v-else t="1658133634285" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4690" width="16" height="16"><path d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z" p-id="4691" fill="#1afa29"></path></svg>
                            </span>
                        </template>
                        <template slot="footer">
                            <span>日销售额 ￥ 12240</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="访问量" :count="listState.visitTotal">
                        <template slot="charts">
                            <lineChart></lineChart>
                        </template>
                        <template slot="footer">
                            <span>日访问量 {{listState.visitToday}}</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="支付笔数" :count="listState.payTotal">
                        <template slot="charts">
                            <barChart></barChart>
                        </template>
                        <template slot="footer">
                            <span>转换率{{listState.payRate}}%</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="运营活动效果" :count="listState.activityRate+'%'">
                        <template slot="charts">
                            <progressChart></progressChart>
                        </template>
                        <template slot="footer"> 
                            <span>周同比 &nbsp;&nbsp; {{listState.activityGrowthLastDay}}%
                                <svg v-if="listState.activityGrowthLastDay>0" t="1658133478981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3436" width="16" height="16"><path d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z" p-id="3437" fill="#d81e06"></path></svg>
                                <svg v-else t="1658133634285" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4690" width="16" height="16"><path d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z" p-id="4691" fill="#1afa29"></path></svg>
                            </span>
                            &nbsp;
                            <span>日同比&nbsp;&nbsp; {{listState.activityGrowthLastMonth}}%
                                <svg v-if="listState.activityGrowthLastMonth>0" t="1658133478981" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3436" width="16" height="16"><path d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z" p-id="3437" fill="#d81e06"></path></svg>
                                <svg v-else t="1658133634285" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4690" width="16" height="16"><path d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z" p-id="4691" fill="#1afa29"></path></svg>
                            </span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Detail from './Detail'
import lineChart from './lineChart'
import barChart from './barChart'
import progressChart from './progressChart'
import {mapState} from 'vuex'

export default {
    name:'Card',
    components:{
        Detail,
        lineChart,
        barChart,
        progressChart
    },
        computed:{
            ...mapState({
                listState:state=>state.home.list
            })
        }
}
</script>

<style>

</style>