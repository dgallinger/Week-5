const { Router } = require("express");
const router = Router();

const loginDAO = require('../daos/login');

// - Signup: `POST /login/signup`
router.post("/signup", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
        res.status(400).send('password required');
    } else {
        try {
            const person = await loginDAO.signUp(req.body);
            if (person) {
                //console.log("person  " + person);
                res.body = person;
                res.send(res.body);
            } else {
                res.status(409).send('User ID already exists');
            }      
        } catch (error) {
            res.status(500).send(error.message);
           }
    }
});

// - Change Password `POST /login/password`
router.post("/password", async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send('Missing auth token');
    } else if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
        res.status(400).send('Password required');
    } else {
        try {
            const token = req.headers.authorization;
            const password = req.body.password;
            const success = await loginDAO.changePassword(token, password);
            if (success) {
                res.status(200).send('Password changed');
            } else {
                res.status(401).send('Password not changed');
            }
        } catch (error) {
            res.status(500).send(error.message);    
        }
    }
});

// - Login: `POST /login`
router.post("/", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
        res.status(400).send('password required');
    } else {
        try {
            const success = await loginDAO.login(req.body);
            if (success) {
                res.body = success;
                res.json(res.body);  
            } else {
                res.status(401).send('Invalid login credentials');
            }           
        } catch (error)  {
            res.status(500).send(error.message);
            }
    }
});

module.exports = router;