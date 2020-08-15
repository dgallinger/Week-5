const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// var jwt = require('jsonwebtoken');

const Item = require('../models/item');
const User = require('../models/user');

const saltRounds = 10;

module.exports = {};

module.exports.createItem = async (title, price) => {
    const newItem = await Item.create({ title : title, price : parseFloat(price) });
    return newItem; 
}

module.exports.updateItem = async (itemId, newItem) => {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return false;
      }
      const success = await Item.updateOne({ _id : itemId }, newItem);
      if (success) {
          return true;
      } else {
        return false;  
      }
}

module.exports.getItemById = async (itemId) => {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return false;
    }
    const item = await Item.findOne({ _id : itemId });
    return item;
}

module.exports.getAllItems = async () => {
    const items = Item.find();
    return items;
}

module.exports.getRole = async (email) => {
    const user = await User.findOne({ email : email });
    return user.roles;
}