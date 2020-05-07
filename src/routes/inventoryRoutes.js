const express = require('express');
const db = require('../connection');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

//Get all inventory items
router.get('/inventory', (req, res)=>{
    db.query('SELECT * FROM inventory', (err, results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad request.'});
        }
        return res.status(200).send(results);
    });
});

//Get inventory item by id
router.get('/inventory/:id', (req, res)=>{
    db.query(`SELECT * FROM inventory WHERE id = ${req.params.id}`, (err, results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        res.status(200).send(results);
    });
});

//Get inventory items available to book between given dates
router.get('/inventory_check/', function (req, res) {
    const startDate = req.query.s;
    const endDate = req.query.e;
    db.query(`SELECT * FROM inventory WHERE inventory.id NOT IN (SELECT i_id FROM bookings WHERE bookings.start_date < DATE('${endDate}') AND bookings.end_date > DATE('${startDate}'))`, function (err, results) {
        if(err){
            return res.status(400).send({ error: 'Bad request.' });
        }
        return res.send(results); 
    });
});

router.use(requireAuth);
//Add new inventory item
router.post('/inventory', (req, res)=>{
    var {item} = req.body;
    db.query(`INSERT INTO inventory(name, description) VALUES ('${item.name}','${item.description}')`, (err)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(201).send({ msg: 'New item created.' });
    });
});

//Edit inventory item
router.put('/inventory/:id', (req, res)=>{
    var {item} = req.body;
    db.query(`UPDATE inventory SET name='${item.name}', description='${item.description}' WHERE id=${req.params.id}`, (err)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(200).send({ msg: 'Item updated successfully.' });
    });
});

//Delete inventory item
router.delete('/inventory/:id', (req, res)=>{
    db.query(`DELETE FROM inventory WHERE id=${req.params.id}`,(err)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(200).send({ msg: 'Item removed successfully.' });
    });
});


module.exports = router;