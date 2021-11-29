import {extend} from "umi-request";


const baseURL = "https://product.nomuraoi-sec.com/api/v1"
// const baseURL = "http://localhost:8000/api/v1"
const request = extend({
    prefix: baseURL,
    timeout: 50000,
    useCache: true
})

export default request;
