const express = require('express');
const db = require('../connection');
const cron = require('node-cron');

router = express.Router();

//Get daily tasks
router.get('/tasks', (req,res)=>{
    db.query('SELECT bookings.id, bookings.status, bookings.start_date, bookings.end_date, bookings.date_booked, customers.fname, customers.lname, customers.address, customers.phone, customers.geocode, inventory.name, inventory.description FROM bookings INNER JOIN customers ON bookings.c_id = customers.id INNER JOIN inventory ON bookings.i_id = inventory.id WHERE (DATE(`start_date`) <= CURDATE() AND bookings.status < 1) OR (DATE(`end_date`) <= CURDATE() AND bookings.status < 3) OR ((bookings.status = 3 OR bookings.status = 1) AND (DATE(`end_date`) = CURDATE() OR DATE(`start_date`) = CURDATE())) ORDER BY CASE WHEN bookings.status = 0 AND bookings.start_date = CURDATE() THEN "1" WHEN bookings.status = 2 THEN "2" WHEN bookings.status = 3 THEN "4" ELSE "3" END ASC ',(err,results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(200).send(results);
    });
});

//Get all bookings
router.get('/bookings', (req, res)=>{
    db.query('SELECT * from bookings',(err, results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(200).send(results);
    });
});

//Get booking by id
router.get('/booking/:id', (req, res)=>{
    var id = req.params.id;
    db.query(`SELECT bookings.id, bookings.status, bookings.start_date, bookings.end_date, bookings.date_booked, customers.fname, customers.lname, customers.address, customers.phone, customers.geocode, inventory.name, inventory.description FROM bookings INNER JOIN customers ON bookings.c_id = customers.id INNER JOIN inventory ON bookings.i_id = inventory.id WHERE bookings.id =${id}`,(err, results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad Request' });
        }
        return res.status(200).send(results);
    });
});

//Cron job endpoint to update delivered to collect where needed
cron.schedule("01 00 * * *", function() {
    db.query('UPDATE bookings SET status = 2 WHERE status = 1 AND DATE(end_date) <= CURDATE()',(err, results)=>{
        if(err){
            console.log(err.message);
        }
        const today = new Date().toISOString().substr(0,10);
        console.log('Performing cron update - '+today)
        console.log(results);
    });
});

//Update booking start, end or status with id
router.put('/booking/:id', (req, res)=>{
    var id = req.params.id;
    var { booking } = req.body;
    db.query(`UPDATE bookings SET start_date='${booking.start_date}', end_date='${booking.end_date}', status=${booking.status} WHERE id=${id}`, (err, results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad request' });
        }
        return res.status(200).send({ msg: 'Updated successfully' })
    });
});

//Mark a booking as delivered with id
router.put('/booking/:id/delivered', (req, res)=>{
    var id = req.params.id;
    db.query(`UPDATE bookings set status=1 WHERE id=${id}`,(err,results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad request' });
        }
        res.status(200).send({ msg: 'Booking marked as delivered.' })
    });
});

//Mark a booking as collected with id
router.put('/booking/:id/collected', (req, res)=>{
    var id = req.params.id;
    db.query(`UPDATE bookings set status=3 WHERE id=${id}`,(err,results)=>{
        if(err){
            console.log(err.message);
            return res.status(400).send({ error: 'Bad request' });
        }
        res.status(200).send({ msg: 'Booking marked as collected.' })
    });
});

module.exports = router;