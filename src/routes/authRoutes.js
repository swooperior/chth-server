const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../connection');
const router = express.Router()

router.post('/login', (req, res)=>{
    const { user } = req.body;
    //check user exists
    db.query(`SELECT username, password FROM staff WHERE username='${user.username}'`, (err, result)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        const usercheck = result[0];
        if(usercheck == null){
            return res.status(400).send({ error: 'Invalid username or password' });
        }else{
            bcrypt.compare(user.password, usercheck.password,(err, isMatch)=>{
                if(err){
                    console.log(err.message);
                    return res.status(400).send({ error: 'Invalid username or password' });
                }
                if(!isMatch){
                    return res.status(400).send({ error: 'Invalid username or password' });
                }else{
                    const token = jwt.sign(user.username, 'APP_SECRET');
                    return res.status(200).send({token});
                }
            });
        };  
    });    
});

//Do i NEED a signup route???
router.post('/signup', (req, res)=>{
    const { user } = req.body;
    
    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err){
                return next(err);
            }
            return res.send(hash);
        });
    });
});

module.exports = router;