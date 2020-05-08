const mysql = require('mysql');
const connection = mysql.createPool({
    connectionLimit: 10,
    host     : '',
    user     : '',
    password : '',
    database : '',
    port     : '',
    dateStrings: 'true',
    //debug    : 'true'
  });

module.exports = connection;