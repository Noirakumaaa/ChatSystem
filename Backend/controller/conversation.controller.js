const express = require("express");
const router = express.Router();
const Conversation = require('../service/conversation.service');

router.post("/sendMessage", sendMessage);
router.post("/getMessages", getMessages);
router.post('/getConvo', getConversation);

function sendMessage(req,res,next){

    Conversation.sendMessage(req.body)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });
}

function getMessages(req,res,next){

    Conversation.getMessages(req.body)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });

}

function getConversation(req, res, next){
    console.log("Controller Conversation : " ,req.body)
    Conversation.getConversation(req.body)
    .then((data)=>{
        console.log("HEllo")
        res.json(data);
    })
    .catch((err)=>{
        res.json(err);
    })
}


module.exports = router;