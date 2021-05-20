import {defineComponent, onMounted, reactive} from "vue";
import request from '../../request'
import CartTable from "../../components/cart/CartTable.vue";

const checkbox = {
    indeterminate: false,
    checkAll: true,
    checkAllGroup: []
}

const props = {
    multiple: true,
    expandTrigger: 'hover'
}

const createCart = (propName, url)=>{
    return defineComponent({
        name: propName,
        components: { CartTable },
        setup(){
            const state = reactive({
                init: false,
                selections: {checkbox: {}, selectors: {}},
                selected: {checkbox: {}, selectors: {}},
                data: [],
                loading: true
            })

            const basicUrl = url

            // 初始化选项布置
            const fetchSelections = ()=>{
                request.get(basicUrl + '/selections').then(r=>{
                    state.selections = r.data
                    const data = r.data.checkbox
                    for (const attr in data) {
                        if (data.hasOwnProperty(attr)){
                            const groups = Object.keys(data[attr].value)
                            state.selected.checkbox[attr] = {...checkbox, checkAllGroup: groups}
                        }
                    }

                    const { selectors } = r.data
                    for (const name in selectors) {
                        if (selectors.hasOwnProperty(name)){
                            state.selected.selectors[name] = []
                        }
                    }

                    state.init = true
                })
            }

            onMounted(()=>{
                fetchSelections()
            })

            const handleCheckAll = (group) => {
                if (state.selected.checkbox[group].indeterminate) {
                    state.selected.checkbox[group].checkAll = false;
                } else {
                    state.selected.checkbox[group].checkAll = !state.selected.checkbox[group].checkAll;
                }
                state.selected.checkbox[group].indeterminate = false;

                if (state.selected.checkbox[group].checkAll) {
                    state.selected.checkbox[group].checkAllGroup = Object.keys(state.selections.checkbox[group].value);
                } else {
                    state.selected.checkbox[group].checkAllGroup = [];
                }
            }


            const checkAllGroupChange = (data, group) => {
                if (data.length === Object.keys(state.selections.checkbox[group].value).length) {
                    state.selected.checkbox[group].indeterminate = false;
                    state.selected.checkbox[group].checkAll = true;
                } else if (data.length > 0) {
                    state.selected.checkbox[group].indeterminate = true;
                    state.selected.checkbox[group].checkAll = false;
                } else {
                    state.selected.checkbox[group].indeterminate = false;
                    state.selected.checkbox[group].checkAll = false;
                }
            }

            const submit = ()=>{
                const checkbox = Object.keys(state.selected.checkbox).map(name=>{
                    return {name: name, value: state.selected.checkbox[name].checkAllGroup }
                })

                state.loading = true
                const params = {checkbox:checkbox, selectors: state.selected.selectors}
                request.post(basicUrl, {data: params}).then(r => {
                    state.data = r.data
                    state.loading = false
                })
            }

            return { state, props, handleCheckAll, checkAllGroupChange, submit }
        }
    })
}

export default createCart