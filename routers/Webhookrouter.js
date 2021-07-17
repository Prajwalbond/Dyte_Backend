const Webhook = require("../models/WebhookModel");

const router = require("express").Router();
const axios = require('axios');

const { ServiceBroker } = require("moleculer");
const broker = new ServiceBroker();

broker.loadService("./Services/webhooks.service.js");


router.post("/create",async(req,resp)=>{
    // console.log(req.body);
    let {targetURL} = req.body;
    // const newWebhook = new Webhook({
    //     targetURL: targetURL
    // });
    // await newWebhook.save().then(Webhook => res.json(Webhook));
    broker.start()
	.then(() => {
		return broker.call("webhooks.register", { targeturl: targetURL }).then(res => 
            {
                console.log("This is in router : ", res);
                resp.json(res)});
	})
	.catch(err => {
		broker.logger.error(`Error occurred! Action: '${err.ctx.action.name}', Message: ${err.code} - ${err.message}`);
		if (err.data)
			broker.logger.error("Error data:", err.data);
	});

});



router.get("/read",async(req,resp)=>{
    // console.log(req.body);
    // let {targetURL} = req.body;
    // const newWebhook = new Webhook({
    //     targetURL: targetURL
    // });
    // await newWebhook.save().then(Webhook => res.json(Webhook));
    broker.start()
	.then(() => {
		return broker.call("webhooks.list", {}).then(res => 
            {
                // console.log("This is in router : ", res);
                resp.json(res)});
	})
	.catch(err => {
		broker.logger.error(`Error occurred! Action: '${err.ctx.action.name}', Message: ${err.code} - ${err.message}`);
		if (err.data)
			broker.logger.error("Error data:", err.data);
	});




});




router.put("/update",async(req,resp)=>{

    let {id,newTargetUrl} = req.body;
    broker.start()
	.then(() => {
		return broker.call("webhooks.update", {id:id,newTargetUrl:newTargetUrl}).then(res => 
            {
                // console.log("This is in router : ", res);
                resp.json(res)});
	})
	.catch(err => {
		broker.logger.error(`Error occurred! Action: '${err.ctx.action.name}', Message: ${err.code} - ${err.message}`);
		if (err.data)
			broker.logger.error("Error data:", err.data);
	});


});






router.delete("/delete",async(req,resp)=>{
    // console.log(req.body);
    let {id} = req.body;
    broker.start()
	.then(() => {
		return broker.call("webhooks.delete", {id:id}).then(res => 
            {
                console.log("This is in router : ", res);
                resp.json(res)});
	})
	.catch(err => {
		broker.logger.error(`Error occurred! Action: '${err.ctx.action.name}', Message: ${err.code} - ${err.message}`);
		if (err.data)
			broker.logger.error("Error data:", err.data);
	});


});




router.post("/ip",async(req,resp)=>{
    // console.log(req.body);
    // let {ipAddress} = req.body;
    var ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
    console.log(req.socket.remoteAddress);
    // const newWebhook = new Webhook({
    //     targetURL: targetURL
    // });
    // await newWebhook.save().then(Webhook => res.json(Webhook));
    broker.start()
	.then(() => {
		return broker.call("webhooks.trigger", { ipAddress: ipAddress }).then(res => 
            {
                console.log("This is in router : ", res);
                resp.json(res)});
	})
	.catch(err => {
		broker.logger.error(`Error occurred! Action: '${err.ctx.action.name}', Message: ${err.code} - ${err.message}`);
		if (err.data)
			broker.logger.error("Error data:", err.data);
	});

});


module.exports = router;