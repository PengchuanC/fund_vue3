import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import numeral from "numeral";
import request from "../../request";
import * as echarts from 'echarts';
numeral.zeroFormat('-');
numeral.nullFormat('N/A');
const tableToolbar = {
    export: true,
    print: true,
    zoom: true,
    custom: true
};
export default defineComponent({
    name: "CartTable",
    props: {
        data: Array,
        loading: Boolean
    },
    setup(props) {
        const refs = ref();
        const dom = (el) => {
            refs.value = el;
        };
        const state = reactive({
            showStock: false,
            loading: false,
            windowHeight: 800,
            data: [],
        });
        const drawStockChange = (data) => {
            const chart = echarts.init(refs.value);
            const options = {
                tooltip: {
                    show: true
                },
                xAxis: {
                    type: 'category',
                    data: data.map((x) => x.date)
                },
                yAxis: {
                    type: 'value',
                    scale: true
                },
                series: [{
                        data: data.map((x) => x.value),
                        type: 'line'
                    }]
            };
            chart.setOption(options);
        };
        const onClick = (secucode) => {
            state.loading = true;
            state.showStock = true;
            request.get('/overview/stock', { params: { secucode } }).then(r => {
                drawStockChange(r.data);
                state.loading = false;
            }).catch(() => {
                state.loading = false;
            });
        };
        onMounted(() => {
            state.windowHeight = window.innerHeight - 100;
            state.data = props.data;
            state.loading = props.loading;
        });
        const router = useRouter();
        const columns = [
            {
                type: 'seq',
                width: 60,
                align: 'center'
            },
            {
                field: 'secucode',
                title: '????????????',
                width: 90,
                slots: {
                    default: (table) => {
                        const { secucode } = table.row;
                        return <div class="secucode" onClick={() => router.push({ name: 'info', params: { secucode } })}>{secucode}</div>;
                    }
                },
                sortable: true,
                align: 'center'
            },
            {
                field: 'secuabbr',
                title: '????????????',
                width: 120,
                overflow: true
            },
            {
                field: 'manager',
                title: '????????????',
                width: 80
            },
            {
                field: 'start',
                title: '?????????',
                width: 80,
                visible: false
            },
            {
                field: 'nvi',
                title: '??????(??????)',
                width: 100,
                align: 'right',
                formatter: (table) => {
                    return numeral(table.cellValue).format(',000.0');
                },
                sortable: true,
                sortBy: ({ row }) => row.nvi
            },
            {
                field: 'launch_date',
                title: '?????????',
                width: 90,
                sortable: true
            },
            {
                field: 'nav_date',
                title: '?????????',
                width: 80
            },
            {
                field: 'ftd',
                title: '????????????',
                width: 80,
                align: 'right',
                formatter: (table) => {
                    return numeral(table.cellValue).format('0.00');
                }
            },
            {
                field: 'manager_yield',
                title: '????????????',
                width: 80,
                align: 'right',
                formatter: (table) => {
                    return numeral(table.cellValue).format('0.00');
                },
                visible: false
            },
            {
                field: 'daily',
                title: '?????????',
                width: 80,
                align: 'right',
                slots: {
                    default: (table) => {
                        const { row } = table;
                        const { daily } = row;
                        return (<span style={{ color: daily > 0 ? 'red' : 'green' }}>{numeral(daily).format('0.00')}</span>);
                    }
                },
                sortable: true
            },
            {
                field: 'ytd',
                title: 'YTD??????',
                width: 90,
                align: 'right',
                slots: {
                    default: (table) => {
                        const { row } = table;
                        const { ytd } = row;
                        return (<span style={{ color: ytd > 0 ? 'red' : 'green' }}>{numeral(ytd).format('0.00')}</span>);
                    }
                },
                sortable: true
            },
            {
                field: 'ytd_rank',
                title: 'YTD??????',
                width: 90,
                align: 'right'
            },
            {
                field: 'year',
                title: '1?????????',
                width: 90,
                align: 'right',
                slots: {
                    default: (table) => {
                        const { row } = table;
                        const { year } = row;
                        return (<span style={{ color: year > 0 ? 'red' : 'green' }}>{numeral(year).format('0.00')}</span>);
                    }
                },
                sortable: true
            },
            {
                field: 'year_rank',
                title: '1?????????',
                width: 90,
                align: 'right'
            },
            {
                field: 'year_rank_classify',
                title: '1???????????????',
                width: 90,
                align: 'right'
            },
            {
                field: 'year3',
                title: '3?????????',
                width: 90,
                align: 'right',
                slots: {
                    default: (table) => {
                        const { row } = table;
                        const { year3 } = row;
                        return (<>
                  <span style={{ color: year3 > 0 ? 'red' : 'green' }}>{numeral(year3).format('0.00')}</span>
                  <vxe-modal v-model={state.showStock} loading={state.loading} title="????????????????????????" width="600" height="450" fullscreen={true}>
                    <div style={{ height: '90vh' }} ref={dom} class="stock-change-modal"/>
                  </vxe-modal>
                </>);
                    }
                },
                sortable: true
            },
            {
                field: 'year3_rank',
                title: '3?????????',
                width: 90,
                align: 'right'
            },
            {
                field: 'year3_rank_classify',
                title: '3???????????????',
                width: 90,
                align: 'right'
            },
            {
                field: 'stock',
                title: '????????????',
                width: 90,
                align: 'right',
                slots: {
                    default: (table) => {
                        const { row } = table;
                        return (<span class="click" onClick={() => onClick(row.secucode)}>{numeral(row.stock).format('0.00')}</span>);
                    }
                }
            },
            {
                field: 'scale_nature',
                title: '????????????',
                width: 100,
                align: 'right',
                sortable: true
            },
            {
                field: 'style_nature',
                title: '????????????',
                width: 100,
                align: 'right',
                sortable: true
            },
            {
                field: 'industry',
                title: '????????????',
                width: 100,
                align: 'right',
                sortable: true
            },
            {
                field: 'classify_industry',
                title: '????????????',
                width: 100,
                align: 'right',
                sortable: true
            },
            {
                field: 'apply',
                title: '????????????',
                width: 100,
                align: 'right',
                sortable: true
            },
            {
                field: 'redeem',
                title: '????????????',
                width: 100,
                align: 'right',
                sortable: true
            },
            {
                field: 'limit',
                title: '????????????',
                width: 100,
                align: 'right',
                sortable: true
            },
        ];
        return { state, dom, tableToolbar, columns };
    }
});
//# sourceMappingURL=CartTable.vue.jsx.map