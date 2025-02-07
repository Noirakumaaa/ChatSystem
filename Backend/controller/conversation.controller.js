const express = require("express");
const router = express.Router();
const Conversation = require("../service/Conversation.service");

router.post("/sendMessage", sendMessage);
router.post("/getMessages", getMessages);


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


module.exports = router;