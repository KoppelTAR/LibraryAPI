const express = require('express');
const router = express.Router();
const userSchema = require('../models/user');
const passport = require('passport')


router.post('/users', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        if (!req.query.username ||
            !req.query.password) {
            return res.status(400).send({ error: 'One or all params are missing. Required params: username, password.' })
        }
        else{
            userSchema.register({username: req.query.username}, req.query.password, (error, user) => {
                if (error) {
                    if (error = "A user with the given username is already registered") {
                        return res.status(409).send({error: 'A user with the given username is already registered'});
                    }
                    else {
                        return res.status(500).send({error:'Looks like something went wrong :('})
                    }
                } else {
                    passport.authenticate('local')(req, res, ()=> {
                        return res.status(201).send('User created!')
                    });
                }
            });
        }
    } 
});

router.post('/login' , (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else {
        if(!req.query.username || !req.query.password) return res.status(400).send({ error: 'One or all params are missing. Required params: password, username' })
        const user = new userSchema({
            username: req.query.username,
            password: req.query.password
        });
        req.logIn(user, (error) => {
            if (error) {
                return res.status(500).send({error:'Looks like something went wrong :('})
            } else {
                passport.authenticate('local')(req, res, ()=> {
                    return res.status(200).send('Logged in');
                });
            }
        });
    }
});

router.get('/users', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        userSchema.find((error, users) => {

            if (error) return res.status(500).send({error:'Looks like something went wrong :('})
    
            if (!error) return res.send(users);
    
        })
    }
})

module.exports = router;