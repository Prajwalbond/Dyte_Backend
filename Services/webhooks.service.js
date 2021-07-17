const Webhook = require("../models/WebhookModel");
const axios = require('axios');

module.exports = {
    name: "webhooks",
    actions: {
        // Normal definition with other properties. In this case
        // the `handler` function is required!
        register: {
            cache: false,
            params: {
                targeturl: "string"
            },
            async handler(ctx) {
                // The action properties are accessible as `ctx.action.*`
                if (!ctx.action.cache)
                    return (await new Webhook({
                        targetURL: ctx.params.targeturl
                    }).save());
            }
        },

        update: {
            cache: false,
            params: {
                id: "string",
                newTargetUrl: "string"
            },
            handler(ctx) {
                // The action properties are accessible as `ctx.action.*`
                if (!ctx.action.cache)
                    return (Webhook.findByIdAndUpdate(ctx.params.id, 
                            {
                                targetURL: ctx.params.newTargetUrl
                            },{new: true, useFindAndModify: false}, (error, data) => 
                            {
                                if (error) 
                                {
                                return next(error);
                                }
                                else 
                                {
                                return(data);
                                //console.log('User updated  !')
                                }
                            }));
            }
        },

        // delete: {
        //     cache: false,
        //     params: {
        //         id: "string"
        //     },
        //     handler(ctx) {
        //         // The action properties are accessible as `ctx.action.*`
        //         if (!ctx.action.cache)
        //             return Number("Performing delete") ;
        //     }
        // },

        delete: {
            cache: false,
            params: {
                id: "string"
            },
            async handler(ctx) {
                // The action properties are accessible as `ctx.action.*`
                if (!ctx.action.cache)
                {
                    await Webhook.findByIdAndDelete(ctx.params.id)
                    return ("Deleted");
                }
            }
        },


        list: {
            cache: false,
            async handler(ctx) {
                // The action properties are accessible as `ctx.action.*`
                if (!ctx.action.cache)
                    return (await Webhook.find());
            }
        },

        trigger: {
            cache: false,
            params: {
                ipAddress: "string"
            },
            async handler(ctx) {
                // The action properties are accessible as `ctx.action.*`
                if (!ctx.action.cache)
                {
                        const allWebhooks = await Webhook.find();
                        // const {ipAddress} = ctx.params.ipAddress;

                        while (allWebhooks.length != 0)
                        {
                            let batch_size = 0
                            let batch = []
                            var all_responses = []
                            let timestamp = Date.now()
                            while (allWebhooks.length != 0 && batch_size < 10)
                            {
                                let webH = allWebhooks.pop()
                                let req = axios.post(webH.targetURL, 
                                {
                                    "ipAddress": ctx.params.ipAddress,
                                    "timestamp": timestamp
                                });
                                batch.push(req);
                                batch_size++;
                            }   

                            await axios.all(batch).then(axios.spread((...responses) => 
                            {
                                all_responses.push(responses)
                                // use/access the results 
                            }))
                            .catch(errors => 
                            {
                                console.log(errors)
                            })
                        }
                        return ("All Sent");
                }
                    
            }
        },
    }
};
