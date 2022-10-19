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
let nodemailer = require("nodemailer");


const { Dropbox } = require("dropbox");
const buffer = require('buffer/').Buffer;
const fetch = require('node-fetch');
const { URLSearchParams } = require('node:url');
let tokenFromRefresh; // THIS VARIABLE WILL STORE THE ACCESS_TOKEN GIVEN FROM THE REFRESH

const CLIENT_ID = process.env.DBX_CLIENT_ID;
const CLIENT_SECRET = process.env.DBX_CLIENT_SECRET;

const config = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
};
const dbx = new Dropbox(config);

const clientIdSecretEncoded = buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'); 

const redirectUri = `http://localhost:3500/auth`;

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

const eventsRoute = require('./routes/events.js')
app.use('/events', eventsRoute)

const eventTypeRoute = require('./routes/eventType.js')
app.use('/event_type', eventTypeRoute)

const postEventRoute = require('./routes/postEventReport.js')
app.use('/post_event_report', postEventRoute)

const participantEventRoute = require('./routes/participantEventOutputs.js')
app.use('/participant_event_outputs', participantEventRoute)

const accessToken = require('./routes/dropboxAccessToken')
app.use('/access_token',accessToken)



//ROUTE TO OBTAIN  THE ENDPOINT oauth2/authorize WITH token_access_type= "offline" (IN ORDER TO GET THE REEFRESH TOKEN)
app.get('/', (req, res) => {
  dbx.auth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', false)
    .then((authUrl) => {
      console.log("authUrl",authUrl)
      res.writeHead(302, { Location: authUrl});
      //res.end();
    });
});

//HERE, WE GET THE ACCESS-TOKEN AND THE REFRESH TOKEN, THE REFRESH TOKEN WAS COPIED AND SAVE AS AN ENVIROMENTAL VARIABLE
app.get('/auth', (req, res) => {
    const { code } = req.query;
  console.log("code",code)
console.log("/auth")
    dbx.auth.getAccessTokenFromCode(redirectUri, code)
        .then((token) => {
          console.log(token)
            console.log(`Token Result:${JSON.stringify(token)}`);
            dbx.auth.setRefreshToken(token.result.refresh_token)

            dbx.usersGetCurrentAccount()
                .then((response) => {
                    console.log('response', response);
                })
                .catch((error) => {
                    console.error(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })
});


//>>> 
// THIS ENDPOINT IS THE ONE THAT GIVES US THE NEW ACCESS TOKEN FROM THE REFRESH, THE ACCESS_TOKEN THAT I GET I SAVED IT AS GLOBAL VARIABLE (SEE LINE 86)
//WITH THIS TOKEN NOW WE CAN CREATE THE FOLDER (LINE 88 IS CALLING THE FUNCTION THAT HAS THE DROPBOX ENDPOINT TO CREATE FOLDERS, THE FUNCTION IS IN LINE 96 )
app.post("/token", (req, res) => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "refresh_token");
    urlencoded.append("refresh_token", process.env.DBX_REFRESH_TOKEN);
    const requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${clientIdSecretEncoded}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlencoded,
        redirect: 'follow'
    };
    fetch("https://api.dropbox.com/oauth2/token", requestOptions)
        .then(response => response.json())
        .then(result => newAccessToken = result)
        .then(accessTokenResult => {
            tokenFromRefresh = accessTokenResult.access_token // ADDING TO tokenFromRefresh (GLOBAL VARIABLE) THE ACCESS TOKEN THANKS TO REFRESH
            //createFolders(tokenFromRefresh, CLIENT_ID)
            console.log("sucess")
        })
        .then(result => res.send(result))
        .catch(error => console.log('error', error))

})


app.get('/email', async (req,res)=>{
  const calendarData=`BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:20221026T190000Z
DTEND:20221026T193000Z
DTSTAMP:20221018T183400Z
ORGANIZER;CN=garban.valdeon@gmail.com:mailto:garban.valdeon@gmail.com
UID:040000008200E00074C5B7101A82E00800000000075A112B20E3D801000000000000000
  0100000004DA3D07F3F730C42AF345B2822C2A149
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=
  TRUE;CN=alexei@platformable.com;X-NUM-GUESTS=0:mailto:alexei@platformable.c
  om
X-MICROSOFT-CDO-OWNERAPPTID:-1529295295
CREATED:20221018T183351Z
LOCATION:215 W. 125th Street
URL:https://nblch.org/
DESCRIPTION:This is a test note
LAST-MODIFIED:20221018T183356Z
LOCATION:215 W. 125th Street
SEQUENCE:0
URL:https://nblch.org/
STATUS:CONFIRMED
SUMMARY:alexei outlook test 2
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`


const calendarDatax=`BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:20221026T190000Z
DTEND:20221026T193000Z
DTSTAMP:20221018T183400Z
ORGANIZER;CN=garban.valdeon@gmail.com:mailto:garban.valdeon@gmail.com
UID:040000008200E00074C5B7101A82E00800000000075A112B20E3D801000000000000000
  0100000004DA3D07F3F730C42AF345B2822C2A149
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=
  TRUE;CN=alexei@platformable.com;X-NUM-GUESTS=0:mailto:alexei@platformable.c
  om
X-MICROSOFT-CDO-OWNERAPPTID:-1529295295
CREATED:20221018T183351Z
LOCATION:215 W. 125th Street
URL:https://nblch.org/
DESCRIPTION:This is a test note
LAST-MODIFIED:20221018T183356Z
LOCATION:215 W. 125th Street
SEQUENCE:0
URL:https://nblch.org/
STATUS:CONFIRMED
SUMMARY:alexei outlook test 2
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`

  const sendMessageToSubscriber =(name,email,eventName,eventDate,workArea)=>{
    let mailTrasporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:process.env.NODEMAILEREMAIL,
        pass:process.env.EMAILPASSWORD
      }
    })
  
    let details = {
      from:'Black Health Data App',
      //to: clientHCWEmail,
      to:[email],
      subject:"A new event has been registered for the NYS CMP program",
      icalEvent: {
        method: 'PUBLISH',
        content: calendarData,
    },
      text:`
      Hi ${name}
  
      [eventName]
      [eventDate]
      [workArea]
      
      The .ics calendar file is attached to add to your calendar and share with your stakeholders.
  `
    }
  
    mailTrasporter.sendMail(details,(err)=>{
      
      if(err){
        console.log(err)
      } else {
        res.send("email sent")
        console.log("email sent")
      }
    })
  }
  sendMessageToSubscriber('Maria','garban.valdeon@gmail.com')


})



/* PORT */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


