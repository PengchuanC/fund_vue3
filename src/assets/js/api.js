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

// 基金经理在管基金信息
export function managedFund(secucode) {
    return request(
        "/manager/managed",
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

// 基金风格信息
export function fundStyle(secucode) {
    return request(
        '/manager',
        { params: {secucode}}
    )
}

// 基金资产配置
export function fundAllocate(secucode) {
    return request(
        '/asset',
        { params: {secucode}}
    )
}

// 基金历史资产配置
export function fundHistoricalAllocate(secucode) {
    return request(
        '/asset/history',
        { params: {secucode}}
    )
}

// 基金重仓持股
export function fundKeyStock(secucode) {
    return request(
        '/asset/keyStock',
        { params: {secucode}}
    )
}

// 基金重仓持债
export function fundKeyBond(secucode) {
    return request(
        '/asset/keyBond',
        { params: {secucode}}
    )
}

// 基金持股集中度
export function fundConcentrate(secucode) {
    return request(
        '/asset/concentrate',
        { params: {secucode}}
    )
}

// 基金行业分布
export function fundIndustryCSI(secucode) {
    return request(
        '/asset/industryCsi',
        { params: {secucode}}
    )
}

// 基金行业风格
export function fundIndustryStyle(secucode) {
    return request(
        '/asset/style',
        { params: {secucode}}
    )
}
