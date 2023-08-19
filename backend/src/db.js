const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'vanthuan76',
  database: 'student_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { dbConnection: connection };
