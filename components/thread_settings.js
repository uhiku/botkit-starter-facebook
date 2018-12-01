var debug = require('debug')('botkit:thread_settings');



module.exports = function(controller) {

    debug('Configuring Facebook thread settings...');
    controller.api.thread_settings.greeting('I am quite ready to help you, {{user_full_name}}' );
    controller.api.thread_settings.get_started('bitbybit');
    controller.api.thread_settings.menu([
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [    
                {
                    "type":"postback",
                    "title":"Main Menu",
                    "payload": "main"
                },
                {
                    "type":"postback",
                    "title":"Cataloge",
                    "payload":"cataloge"
                }
            ]
        }]);
}
