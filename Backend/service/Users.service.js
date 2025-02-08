const UserModel = require('../model/Users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function Register(user) {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        const savedUser = await UserModel.create({ username: user.username, email: user.email, password: user.password });
        return { status: 200, message: "User registered successfully.", data: savedUser };
    } catch (err) {
        return { status: 500, message: err.message };
    }
}

async function Login(user) {    
    try {
        const foundUser = await UserModel.findOne({ email: user.email });
        if (!foundUser) {
            return { status: 404, message: "User not found." };
        }
        console.log(foundUser)

        const validPassword = await bcrypt.compare(user.password, foundUser.password);
        console.log(validPassword);
        if (!validPassword) {
            return { status: 401, message: "Invalid password." };
        }

        const token = jwt.sign({ email: foundUser.email }, process.env.JWT_SECRET);
        return { status: 200, message: "User logged in successfully.", data: token, userData : {userID: foundUser._id, userSocketId: foundUser.socketId, username: foundUser.username} };
    } catch (err) {
        return { status: 500, message: err.message };
    }
}


async function getAllUser(){
    try{
        const Users = await UserModel.find();
        return Users;

    }catch(err){
        return err
    }
}

async function getUserById(username) {
    try {
        const user = await UserModel.findOne({ _id : username });
        if(!user){
            return "No Converstion";
        }
        return user;
    } catch (err) {
        return "No user found";
    }
}

module.exports = { Register, Login,getUserById,getAllUser };