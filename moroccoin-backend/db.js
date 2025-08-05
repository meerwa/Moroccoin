const {Pool} = require('pg')

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database:' db_moroccoin',
    password: 'test',
    port: 5432,
})
module.exports = pool;