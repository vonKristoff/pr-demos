import Vue from 'vue/dist/vue'
import app from './app'

new Vue(...app)

if (ENV !== 'production') {
    console.log(`${ENV} specific logging is enabled!`);
}