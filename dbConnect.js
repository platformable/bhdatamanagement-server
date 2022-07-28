const { Pool,Client } = require('pg')
//const { user } = require('pg/lib/defaults')

const client = new Client(
    {
        user:process.env.DBUSER,
        host:process.env.HOST,
        database:process.env.DATABASE,
        password:process.env.PASSWORD,
        port: process.env.DB_PORT,
        //ssl:true
        ssl:{ rejectUnauthorized: false }
      }
  )
  client.connect()
module.exports = client
 