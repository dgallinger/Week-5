const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = {};

module.exports.isAuthorized = async (token) => {
    try {
        const decoded = jwt.verify(token, 'secret');
        return decoded;
    } catch (err) {
        return false;
    }
}

module.exports.getUserId = async (email) => {
    const user = User.findOne({ email : email });
    return (await user)._id;
}

module.exports.isAdmin = async (email) => {
    const user = await User.findOne({ email : email });
    if (user.roles.includes('admin')) {
        return true;
    } else {
        return false;
    }
}