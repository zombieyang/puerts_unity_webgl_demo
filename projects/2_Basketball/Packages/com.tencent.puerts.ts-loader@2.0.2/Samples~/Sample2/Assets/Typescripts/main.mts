import { Axios } from "external/axios.gen.mjs";
import "external/runtime.gen.mjs"

const axios = new Axios({});
axios
    .get('https://v.qq.com')
    .then(res=> {
        console.log('request v.qq.com: ' + res.status)
    })