import { defineComponent, nextTick, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import request from "../../request";
import numeral from "numeral";
import { ElLoading } from "element-plus";
export default defineComponent({
    name: "Portfolio",
    setup() {
        const state = reactive({
            portfolio: 1,
            portType: 1,
            portfolioOptions: [],
            date: null,
            dateOptions: [],
            data: []
        });
        const fetchPortfolio = () => {
            request.get('/portfolio/new').then((r) => {
                state.portfolioOptions = r;
            });
        };
        const fetchDateOptions = () => {
            request.get('/portfolio/new/date', { params: {
                    port_id: state.portfolio, port_type: state.portType
                } }).then((r) => {
                state.dateOptions = r.data;
            });
        };
        onMounted(() => {
            fetchPortfolio();
            fetchDateOptions();
            onChange();
        });
        const onChange = () => {
            const instance = ElLoading.service({ fullscreen: true });
            state.data = [];
            fetchDateOptions();
            request.post('/portfolio/new', { data: {
                    port_id: state.portfolio, port_type: state.portType, date: state.date
                } }).then((r) => {
                state.data = r;
                nextTick(() => { });
                instance.close();
            });
        };
        const router = useRouter();
        const columns = [
            {
                type: "checkbox",
                align: "center",
                width: 40
            },
            {
                type: "seq",
                title: '#',
                align: "center",
                width: 60
            },
            {
                title: "基金代码",
                field: "secucode",
                align: "left",
                sortable: true,
                slots: {
                    default: ({ row }) => {
                        const { secucode } = row;
                        return <div class="secucode" onClick={() => router.push({ name: 'info', params: { secucode } })}>{secucode}</div>;
                    }
                }
            },
            {
                title: "基金简称",
                field: "secuabbr",
                align: "left",
                sortable: true
            },
            {
                title: "成立日期",
                field: "launch_date",
                align: "center",
                sortable: true
            },
            {
                title: "基金经理",
                field: "manager",
                align: "left",
                showOverflow: true
            },
            {
                title: "规模(亿元)",
                field: "scale",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.scale).format('0,00.0')
            },
            {
                title: "净值日期",
                field: "date",
                align: "center",
                sortable: true
            },
            {
                title: "净值",
                field: "unitnv",
                align: "right",
                formatter: ({ row }) => numeral(row.unitnv).format('0.0000')
            },
            {
                title: "日涨跌",
                field: "daily",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.daily).format('0.00')
            },
            {
                title: "近1周",
                field: "week",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.week).format('0.00')
            },
            {
                title: "近1月",
                field: "month",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.month).format('0.00')
            },
            {
                title: "近3月",
                field: "month3",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.month3).format('0.00')
            },
            {
                title: "近6月",
                field: "month6",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.month6).format('0.00')
            },
            {
                title: "近1年",
                field: "year",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.year).format('0.00')
            },
            {
                title: "近3年",
                field: "year3",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.year3).format('0.00')
            },
            {
                title: "成立年化",
                field: "ftd_annual",
                align: "right",
                sortable: true,
                formatter: ({ row }) => numeral(row.ftd_annual).format('0.00')
            },
            {
                title: "状态",
                field: "status",
                align: "center",
                sortable: true,
                filters: [{ label: '新增', value: '新增' }, { label: '保持', value: '保持' }, { label: '回归', value: '回归' }, { label: '删除', value: '删除' }],
                filterMultiple: true,
            }
        ];
        return { state, onChange, columns };
    }
});
//# sourceMappingURL=Portfolio.vue.jsx.map