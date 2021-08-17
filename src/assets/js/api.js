import {extend} from "umi-request";


const baseURL = "http://10.170.139.10:8005/api/v2"
// const baseURL = "http://localhost:8005/api/v2"
const request = extend({
    prefix: baseURL,
    timeout: 50000,
    useCache: true
})

// 基金周期内业绩表现
export function cycle(secucode){
    return request(
        "/fundinfo/cycle",
        {params: {secucode}}
    )
}

// 基金最新业绩表现
export function latestPerformance(secucode){
    return request(
        "/fundinfo",
        {params: {secucode}}
    )
}

// 基金风控指标表格
export function riskPerformance(secucode){
    return request(
        "/fundinfo/performance",
        {params: {secucode}}
    )
}

// 基金持有人结构
export function holder(secucode){
    return request(
        "/fundinfo/holder",
        {
            params: {secucode}
        }
    )
}

// 基金换手率
export function turnover(secucode){
    return request(
        "/fundinfo/turnover",
        {params: {secucode}}
    )
}

// 基金规模变化
export function scaleChange(secucode){
    return request(
        "/fundinfo/scale",
        {params: {secucode}}
    )
}

// 基金与指数相似度
export function historyStyle(secucode){
    return request(
        "/fundinfo/his_style",
        {params: {secucode}}
    )
}


// 基金风险评价雷达图
export function shortRisk(secucode) {
    return request(
        "/fundinfo/risk/short",
        {params: {secucode}}
    )
}

export function longRisk(secucode) {
    return request(
        "/fundinfo/risk/long",
        {params: {secucode}}
    )
}

// 基金经理任职以来持仓前20位股票
export function holdingTop20(secucode) {
    return request(
        "/manager/topHolding",
        {params: {secucode}}
    )
}

// 基金搜索
export function searchFund(search) {
    return request(
        "/search/fundList",
        {params: {search}}
    )
}

// 基金风格
export function rbsaStyle(secucode) {
    return request(
        '/fundinfo/style',
        {params:{secucode}}
    )
}


// 基金风格指数与宽基指数
export function styleAndBenchmarkIndices(){
    return request(
        "/fundinfo/style&benchmark"
    )
}

// 基金与基准指数净值对比
export function netValueSeries(secucode, style, benchmark) {
    return request(
        "/fundinfo/nav",
        {params:{secucode, style, benchmark}}
    )
}

// 基金分年度业绩表现
export function yearlyPerformance(secucode, style, benchmark){
    return request(
        "/fundinfo/nav/yearly",
        {params:{secucode, style, benchmark}}
    )
}

// 基金与指数近期表现
export function recentPerformance(secucode, style, benchmark){
    return request(
        "/fundinfo/nav/recent",
        {params:{secucode, style, benchmark}}
    )
}
