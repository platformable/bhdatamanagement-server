require('dotenv').config()
const { urlencoded } = require('express')
const express = require('express')
var cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
app.use(urlencoded({extended:false}))
const port = process.env.PORT || 3500
const axios = require('axios')
const db = require("./dbConnect");
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


const authorizedUserRoute = require('./routes/authuser')
app.use('/authorizedusers', authorizedUserRoute)

const usersRoute = require('./routes/users')
app.use('/users', usersRoute)

const programsRoute = require('./routes/programs.js')
app.use('/programs', programsRoute)

const eventLocationTypeRoute = require('./routes/eventLocationType.js')
app.use('/event_location_type', eventLocationTypeRoute)

const healthAreaOfFocusRoute = require('./routes/healthAreasOfFocus.js')
app.use('/health_area_of_focus', healthAreaOfFocusRoute)


/* PORT */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


