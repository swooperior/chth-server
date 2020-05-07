const mysql = require('mysql');
const connection = mysql.createPool({
    connectionLimit: 10,
    host     : '',
    user     : '',
    password : '',
    database : '',
    port     : '',
    dateStrings: 'true',
  });

module.exports = connection;