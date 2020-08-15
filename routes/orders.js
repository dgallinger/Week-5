const { Router } = require("express");
const router = Router();

//const itemDAO = require('../daos/items');
const orderDAO = require("../daos/orders");
//const User = require("../models/user");
const midWare = require("../daos/middleware");

//check for authorization
router.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send('Missing auth token');
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

// - Create: `POST /orders` - open to all users
// - Takes an array of item _id values (repeat values can appear). 
//   Order should be created with a `total` field with the total 
//   cost of all the items from the time the order is placed (as the item prices could change). 
//   The order should also have the `userId` of the user placing the order. 
router.post("/", async (req, res, next) => {
    try {
        const order = await orderDAO.createOrder(req.email, req.body);
        if (order) {
            res.body = order;
            res.json(res.body);
        } else {
            res.status(400).send('bad item id');
        }
 
    } catch (err) {
        res.status(501);
    }
});

// - Get my orders: `GET /orders` - return all the orders made by the user making the request
router.get("/", async (req, res, next) => {
    try {
        const orders = await orderDAO.getAllOrders(req.email);
        res.json(orders);
    } catch (err) {
        res.status(501);
    }
});

// - Get an order: `GET /order/:id` - return an order with the `items` array 
//   containing the full item objects rather than just their _id. If the user 
//   is a normal user return a 404 if they did not place the order. 
//   An admin user should be able to get any order.
router.get("/:id", async (req, res, next) => {
    try{
        const order = await orderDAO.getOrderById(req.params.id, req.email);
        if (order) {
            res.body = order;
            res.json(res.body);
        } else {
            res.status(404);
        }
    } catch (err) {
        res.status(501);
    }
    
});


module.exports = router;