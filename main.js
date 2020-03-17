import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import uniFly from 'unifly';

// uniFly.baseUrl = 'https://dfl.yinshangjituan.com/app';

// uniFly.baseUrl = 'https://wts.yinshangjituan.com/app'

// uniFly.baseUrl = 'http://18939a273z.iask.in/app';

uniFly.baseUrl = 'http://23x1o38664.iask.in/app'

// uniFly.baseUrl = 'http://49.233.188.123/app';

// uniFly.baseUrl = 'http://47.105.161.14/app';   //测试服务器

// uniFly.baseUrl = 'http://43.254.2.181/app'

// uniFly.baseUrl = 'http://281s5457y3.qicp.vip:38084/app';



uniFly.headers['Content-Type'] = 'application/x-www-form-urlencoded';

Vue.prototype.uniFly = uniFly

Vue.prototype.$eventHub = new Vue();

const app = new Vue({
	...App
})
app.$mount()
