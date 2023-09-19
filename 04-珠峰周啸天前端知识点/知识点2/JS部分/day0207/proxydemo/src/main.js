import axios from 'axios';
import { createApp } from 'vue';
import App from './App.vue';

//http://localhost:8080/客户端
//https://www.jianshu.com/asimov/subscriptions/recommended_collections 服务器

axios.get('/api/asimov/subscriptions/recommended_collections')
    .then(response => response.data)
    .then(value => {
        console.log('成功:', value);
    });

const app = createApp(App);
app.mount('#app');