const bestBuy = require('../helpers/bestbuy');
const response = () => {
    
    }

module.exports = (controller) => {
    controller.hears('bitbybit', 'message_received, facebook_postback', (bot, message) => {
        bot.reply(message, {
            "text": "Weclcome, I\'m machine intended to make your life easier. Choose what would you like to do =)",
            "quick_replies": [
                {
                "content_type":"text",
                "title":"My purchases",
                "payload":"purchases"
                },
                {
                "content_type":"text",
                "title":"Favorites",
                "payload":"favs"
                },
                {
                "content_type":"text",
                "title":"Shop",
                "payload":"shop"
                },
                {
                "content_type":"text",
                "title":"Invite somebody",
                "payload":"refer"
                }
            ]
        })
    });
    controller.hears('shop', 'message_received, facebook_postback', (bot, message) => {
        bot.reply(message, {
            "text": "How would you like to look for your product",
            "quick_replies": [
                {
                    "content_type":"text",
                    "title":"By Name",
                    "payload":"categories"
                },
                {
                    "content_type":"text",
                    "title":"By SKU",
                    "payload":"sku"
                }
            ]
        })
    })
    controller.hears('By Name', 'message_received, facebook_postback', (bot, message) => {
        bestBuy.getProdyuctsByCategory()
                .then((res) => {
                    console.log('Successfully got products');
                    let arr = [];
                    res.data.products.forEach((element) => {
                        arr.push(
                            {
                                "title":element.name,
                                "image_url":element.image,
                                "subtitle":element.regularPrice,
                                "default_action": {
                                    "type": "web_url",
                                    "url": element.url,
                                    "messenger_extensions": false,
                                    "webview_height_ratio": "TALL"
                                },
                                "buttons":[
                                    {
                                        "type":"web_url",
                                        "url":element.addToCartUrl,
                                        "title":'Add to cart'
                                    }            
                                ]  
                            }
                        )
                    });
                    attachment = {
                        "type":"template",
                            "payload":{
                                "template_type":"generic",
                                "elements": arr
                            }
                    };
                    bot.reply(message, {attachment: attachment})
                    
                })
                .catch((err) => {
                    `Error getting products ${err}`
                })
    })
    controller.hears('By SKU', 'message_received, facebook_postback', (bot, message) => {
        bestBuy.getProdyuctBySKU()
            .then((res) => {
                console.log('Successfully got products');
                let arr = [];
                res.data.products.forEach((element) => {
                    arr.push(
                        {
                            "title":element.name,
                            "image_url":element.image,
                            "subtitle":`$${element.regularPrice}`,
                            "default_action": {
                                "type": "web_url",
                                "url": element.url,
                                "messenger_extensions": false,
                                "webview_height_ratio": "TALL"
                            },
                            "buttons":[
                                {
                                    "type":"web_url",
                                    "url":element.addToCartUrl,
                                    "title":'Add to cart'
                                }            
                            ]  
                        }
                    )
                });
                attachment = {
                    "type":"template",
                        "payload":{
                            "template_type":"generic",
                            "elements": arr
                        }
                };
                bot.reply(message, {attachment: attachment})
                
            })
            .catch((err) => {
                `Error getting products ${err}`
            })
    })
}