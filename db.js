const mysql = require('mysql');

class Database {
  init () {
    let config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3307',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'valiris_api_database',
      connectionLimit: 10,
      multipleStatements: true
    };

    if (process.env.NODE_ENV === 'test') {
      config = {
        host: process.env.DB_HOST_TEST || 'localhost',
        port: process.env.DB_PORT_TEST || '3308',
        user: process.env.DB_USER_TEST || 'root',
        password: process.env.DB_PASS_TEST || 'root',
        database: process.env.DB_NAME_TEST || 'valiris_api_database_test',
        connectionLimit: 10,
        multipleStatements: true
      };
    }

    this.connection = mysql.createPool(config);
    return this;
  }

  query (...args) {
    return new Promise((resolve, reject) => {
      this.connection.query(...args, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  closeConnection () {
    return new Promise((resolve, reject) => {
      if (this.connection) {
        this.connection.end((err, res) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        return resolve();
      }
    });
  }

  deleteAllData () {
    return this.query(`
      SET FOREIGN_KEY_CHECKS=0;
      TRUNCATE contact;
      SET FOREIGN_KEY_CHECKS=1;
    `);
  }
}

module.exports = (new Database()).init();
