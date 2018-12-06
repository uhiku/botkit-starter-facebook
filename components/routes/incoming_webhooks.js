var debug = require('debug')('botkit:incoming_webhooks');
const get_started = require('../../skills/get_started');
module.exports = function(webserver, controller) {

    debug('Configured POST /facebook/receive url for receiving events');
    webserver.post('/facebook/receive', function(req, res) {

        // NOTE: we should enforce the token check here
        // let body = req.body;
        // if (body.object === 'page') {
      
        //   body.entry.forEach(function(entry) {
        //     let webhook_event = entry.messaging[0];
        //     let sender_psid = webhook_event.sender.id;
        //     if (webhook_event.message) {
        //       get_started.handleMessage(sender_psid, webhook_event.message);
        //       } else if (webhook_event.postback) {
        //         get_started.handlePostback(sender_psid, webhook_event.postback);
        //       }
        //   });
      
          
        // }
        // respond to Slack that the webhook has been received.
        res.status(200);
        res.send('ok');

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