const express = require('express');
const bodyParser = require('body-parser');
//--
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
//--

const app = express();

app.use(bodyParser.json());

app.use(authRoutes);
app.use(inventoryRoutes);
app.use(customerRoutes);
app.use(bookingRoutes);


app.listen(3000,()=>{
  console.log('Server started, Listening on port 3000...');
});