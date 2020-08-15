const { Router } = require("express");
const router = Router();

//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

const itemDAO = require('../daos/items');
//const User = require("../models/user");
const midWare = require("../daos/middleware");


//check for authorization
router.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send('Missing auth token');
        return;
    } else {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = await midWare.isAuthorized(token);
            if (decoded) {
                req.email = decoded.email;
            } else {
                res.status(401).send('bad token');
                return;
            }           
        } catch (err) {
            res.status(500).send(err.message); 
        }
    }
    next()
  });

// - Get all items: `GET /items` - open to all users
router.get("/", async (req, res, next) => {
    try {
        const items = await itemDAO.getAllItems();
        res.json(items);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const item = await itemDAO.getItemById(req.params.id);
        res.json(item);
    } catch (err) {
        res.status(404).status('item not found');
    }
})

//check for admin access
router.use(async (req, res, next) => {
    const role = await midWare.isAdmin(req.email);
    if (role) {
        next();
    } else {
        res.status(403).send('Access Forbidden');
    }
});

// - Create new item: `POST /items` - restricted to users with the "admin" role
router.post("/", async (req, res, next) => {
    try {
        const title = req.body.title;
        const price = req.body.price;
        const item = await itemDAO.createItem(title, price);
        res.status(200).json(item); 
    } catch (err) {
        res.status(501).send('Item not created');
    }
});

// - Update an item: `PUT /items/:id` - restricted to users with the "admin" role
router.put("/:id", async (req, res, next) => {
    const itemId = req.params.id;
    const newItem = req.body;
    if (!newItem || JSON.stringify(newItem) === '{}') {
        res.status(400).send('new item required');
    } else {
        try {
            const success = await itemDAO.updateItem(itemId, newItem);
            res.json(success);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
});

module.exports = router;