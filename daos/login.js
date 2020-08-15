const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 10;
const secret = 'secret';

module.exports = {};

module.exports.signUp = async (creds) => {
    let user = await User.findOne({ email : creds.email });
    if (user) {
        return false;
    } else {
        creds.password = await bcrypt.hash(creds.password, saltRounds);
        // let role = 'user';
        // creds.roles =  role;
        const user = await User.create(creds);
        return user;
    };
}

module.exports.login = async (creds) => {
    const user = await User.findOne({ email : creds.email }).lean();
    if (!user) { 
        return false; 
    };
    const passwordMatch = await bcrypt.compare(creds.password, user.password);
    if (passwordMatch == false) { 
        return false; 
    } else {
        const token = await jwt.sign({email : user.email, _id : user._id, roles : user.roles}, secret);
        const loginData = { email : user.email, token : token, _id : user._id, roles : user.roles };
        return loginData; 
    }; 
}

module.exports.changePassword = async (auth, password) => {
    const token = await auth.split(' ')[1];
    try {
        const foundToken = jwt.verify(token, secret);
        password = await bcrypt.hash(password, saltRounds);
        const updated = await User.updateOne({ email : foundToken.email }, { $set: { 'password' : password}});
        return true;
    } catch (err) {
        return false;
    }
}