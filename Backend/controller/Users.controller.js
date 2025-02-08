const express = require("express");
const router = express.Router();
const Users = require("../service/Users.service");

router.post("/register", Register);
router.post("/login", Login);
router.post("/:id", getUserById);
router.get("/allUser", getAllUser)

function Register(req,res,next){
    Users.Register(req.body)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });
}

function Login(req,res,next){
    console.log("LOGIN TRYING")
    Users.Login(req.body)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });
}





function getUserById(req,res,next){
    Users.getUserById(req.params.id)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });
}

function getAllUser(req,res,next){
    Users.getAllUser()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json(err);
    });
}

module.exports = router;