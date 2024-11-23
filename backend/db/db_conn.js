const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'users',
  port: 3306,
});

module.exports = Object.freeze({ pool: pool });
