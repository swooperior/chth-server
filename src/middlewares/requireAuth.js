const jwt = require('jsonwebtoken');
const db = require('../connection');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' });
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'APP_SECRET', async (err, payload) => {
        if(err){
            return res.status(401).send({ error: 'You must be logged in.' });
        }

        const username = payload;

        db.query(`SELECT id from staff WHERE username='${username}'`, (err,result)=>{
            if(err){
                console.log(err.message);
            }
            if(result.length != 1){
                console.log(err.message);
                return res.status(401).send({ error: 'You must be logged in.' });
            }
            const id = result[0].id;
            req.uid = id;
            return next();
        });
    });
};