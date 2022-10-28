import mySql from 'mysql2';

const pool= mySql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '123juca49'
});

module.exports= pool.promise();