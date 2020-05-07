const express = require('express');
const db = require('../connection');
//const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();
// Acceess to customer information will require authentication.
//router.use(requireAuth);


//Read all customers
router.get('/customers', (req, res)=>{
    db.query("SELECT * FROM customers",(err,results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(200).send(results);
    });
});

//Read single customer by id
router.get('/customer/:id', (req, res)=>{
    db.query(`SELECT * FROM customers WHERE id=${req.params.id}`,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(200).send(results);
    });
});

//Create customer
router.post('/customers', (req, res)=>{
    const {customer} = req.body;
    db.query(`INSERT INTO customers(fname,lname,address,phone) VALUES('${customer.fname}','${customer.lname}','${customer.address}','${customer.phone}')`,(err,results)=>{
        if(err){
            console.log(err);
            return res.status(400).send( { msg: "Failed to add customer." })
        }
        return res.status(201).send({ msg: "New customer added!" });
    });
});

//Update customer by id
router.put('/customer/:id', (req, res)=>{
    db.query(`UPDATE customers SET fname = '${customer.fname}', lname = '${customer.lname}',address = '${customer.address}',phone = '${customer.phone}', geocode = '${customer.geocode}' WHERE id = ${req.params.id}`,(err)=>{
        if(err){
            console.log(err);
            return res.status(400).send( { msg: "Failed to update customer." })
        }
        return res.status(201).send({ msg: `${customer.fname} updated!` });
    });
});

//Delete customer by id
router.delete('/customer/:id', (req, res)=>{      
    db.query(`DELETE FROM customers WHERE id = ${req.params.id}`,(err)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(200).send({ msg: 'Customer deleted successfully' });
    });
});


module.exports = router;