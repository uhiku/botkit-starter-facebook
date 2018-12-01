var debug = require('debug')('botkit:incoming_webhooks');
var request = require('request');


module.exports = function(webserver, controller) {

    debug('Configured POST /facebook/receive url for receiving events');
    webserver.post('/facebook/receive', function(req, res) {
        function handleMessage(sender_psid, received_message) {
            let response;
            if (received_message.text) {
              response = {
                "text": `You sent the message: "${received_message.text}"!`
              }
            }
            callSendAPI(sender_psid, response);
        }
        function handlePostback(sender_psid, received_postback) {
            let response;
            
            // Get the payload for the postback
            let payload = received_postback.payload;
          
            // Set the response based on the postback payload
            if (payload === 'bitbybit') {
              response = { 
              "text": "Finally Welcome!",
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
            }
            // Send the message to acknowledge the postback
            callSendAPI(sender_psid, response);
          }
        }
        function callSendAPI(sender_psid, response) {
            let request_body = {
              "recipient": {
                "id": sender_psid
              },
              "message": response,
            }
            request({
              "uri": "https://graph.facebook.com/v2.6/me/messages",
              "qs": { "access_token": process.env.page_token },
              "method": "POST",
              "json": request_body
            }, (err, res, body) => {
              if (!err) {
                console.log('message sent!');
              } else {
                console.error("Unable to send message:" + err);
              }
            });
          }
        let body = req.body;


        if (body.object === 'page') {
      
          body.entry.forEach(function(entry) {

            let webhook_event = entry.messaging[0];

            let sender_psid = webhook_event.sender.id;

            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
              } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
              }
          });
      
          res.status(200).send('ok');
        }
        
        
        

        var bot = controller.spawn({});

        // Now, pass the webhook into be processed
        controller.handleWebhookPayload(req, res, bot);

    });

    debug('Configured GET /facebook/receive url for verification');
    webserver.get('/facebook/receive', function(req, res) {
        if (req.query['hub.mode'] == 'subscribe') {
            if (req.query['hub.verify_token'] == controller.config.verify_token) {
                res.send(req.query['hub.challenge']);
            } else {
                res.send('OK');
            }
        }
    });

}
