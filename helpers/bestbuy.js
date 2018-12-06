const axios = require('axios');
module.exports = {
    getProdyuctsByCategory: function () {
        const request_body = {
            apiKey: process.env.bestbuy_api_key,
            sort  : 'name.asc',
            show: 'name,image,shortDescription,regularPrice,addToCartUrl,url',
            pageSize: 6,
            format: 'json'
        };
        return axios({
            url: process.env.productsByCategory,
            params : request_body
        })
    },
    getProdyuctBySKU: function() {
        const request_body = {
            apiKey: process.env.bestbuy_api_key,
            sort  : 'name.asc',
            show: 'name,image,shortDescription,regularPrice,addToCartUrl,url',
            format: 'json'
        };
        return axios({
            url: process.env.productsBySKU,
            params : request_body
        })
    }
}