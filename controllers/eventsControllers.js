const db = require("../dbConnect");
const axios = require("axios");
//const { Dropbox } = require("dropbox");
const dropbox = require('../utils/dropbox')
const { URLSearchParams } = require("node:url");
const buffer = require("buffer/").Buffer;
const createFolder = require("./createEventsFolders");
const fetch = require("node-fetch");
var QRCode = require("qrcode");
let nodemailer = require("nodemailer");

let tokenFromRefresh; //
let mainFolder;
let folderPath;
let generatedCode;
let eventId;

const DBXCLIENT_ID = process.env.DBX_CLIENT_ID;
const CLIENT_SECRET = process.env.DBX_CLIENT_SECRET;

const config = {
  clientId: DBXCLIENT_ID,
  clientSecret: CLIENT_SECRET,
};
//const dbx = new Dropbox(config);

const connectDropboxAndCreateFolders = (
  DBXCLIENT_ID,
  programName,
  eventName,
  eventDate
) => {
  const clientIdSecretEncoded = buffer
    .from(`${DBXCLIENT_ID}:${CLIENT_SECRET}`)
    .toString("base64");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("refresh_token", process.env.DBX_REFRESH_TOKEN);

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Basic ${clientIdSecretEncoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlencoded,
    redirect: "follow",
  };
  return fetch("https://api.dropbox.com/oauth2/token", requestOptions)
    .then((response) => response.json())
    .then((result) => (newAccessToken = result))
    .then((accessTokenResult) => {
      tokenFromRefresh = accessTokenResult.access_token; // ADDING TO tokenFromRefresh (GLOBAL VARIABLE) THE ACCESS TOKEN THANKS TO REFRESH
      return createMainFolder(
        tokenFromRefresh,
        programName,
        eventName,
        eventDate
      );
    })
    .then((res) => {
      mainFolder = res.mainFolderUrl;
      folderPath = res.folderPath;
      console.log("mainFolder", mainFolder);
    })
    .then((response) => {
      return createImagesFolder(
        tokenFromRefresh,
        programName,
        eventName,
        eventDate
      );
    })
    .then((res) => {
      imagesFolderUrl = res.imagesFolderUrl;
    })
    .catch((error) =>
      console.log("error from connectDropboxAndCreateFolders", error)
    );
};

const createMainFolder = async (token, programName, eventName, eventDate) => {
  return await createFolder.createMainFolder(
    token,
    programName,
    eventName,
    eventDate
  );
};

const createImagesFolder = async (token, programName, eventName, eventDate) => {
  return await createFolder.createImagesFolder(
    token,
    programName,
    eventName,
    eventDate
  );
};

const createQrCode = async (id) => {
  var opts = {
    errorCorrectionLevel: "H",
    type: "image/jpeg",
    quality: 1,
    margin: 1,
    scale: 15,
  };

  const createCode = await QRCode.toDataURL(
    `https://bh.platformable.com/events/${id}/participant-survey/survey`,
    opts,
    function (err, url) {
      return (generatedCode = url);
    }
  );

  return createCode;
};

const updateEventWithQrCode = async (eventId, generatedCode) => {
  try {
    const query = await {
      text: `update events set qrcode=$2 where id=$1`,
      values: [eventId, generatedCode],
    };
    console.log("eventid", eventId);
    console.log("generatedCode", generatedCode);
    db.query(query).then((response) => {
      console.log(response);
      /*      res.json({
          message: "Updated successfully",
          statusText:'OK'
        }) */
    });
  } catch (error) {
    console.log("error", error);
  }
};

const sendMessageToSubscriber =(eventName,eventDate,workArea,eventDescription,locationAddress,onlineInPersonEventType,eventStartTime,eventFinishTime)=>{
  let mailTrasporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.NODEMAILEREMAIL,
      pass:process.env.EMAILPASSWORD
    }
  })

  function convertDate(date, time) {
    const dateParts = date.split("T")[0]
    const dateString = dateParts.split("-").join("")
    const timeString = time.split(":").join("") 

    return dateString + "T" + timeString+'00'
  }
const today= new Date()
const newDate = today.toISOString()
  const created = newDate.replace("-","").replace("-","").replace(":","").replace(":","").replace(".","")


  var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Meetup//Meetup Events v1.0//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:Events - Life Drawing Barcelona\nX-MS-OLK-FORCEINSPECTOROPEN:TRUE\nBEGIN:VTIMEZONE\nTZID:Europe/Madrid\nTZURL:http://tzurl.org/zoneinfo-outlook/Europe/Madrid\nX-LIC-LOCATION:Europe/Madrid\nBEGIN:DAYLIGHT\nTZOFFSETFROM:+0100\nTZOFFSETTO:+0200\nTZNAME:CEST\nDTSTART:19700329T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:+0200\nTZOFFSETTO:+0100\nTZNAME:CET\nDTSTART:19701025T030000\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\nEND:STANDARD\nEND:VTIMEZONE\nBEGIN:VEVENT\nDTSTAMP:20220129T115020Z\nDTSTART;TZID=Europe/Madrid:20220130T180000\nDTEND;TZID=Europe/Madrid:20220130T200000\nSTATUS:CONFIRMED\nSUMMARY:Nude Life Drawing @fem.fatigue at Studio\nDESCRIPTION:Life Drawing Barcelona\nSunday\, January 30 at 6:00 PM\n\nDib\nORGANIZER;CN=Meetup Reminder:MAILTO:info@meetup.com\nCLASS:PUBLIC\nCREATED:20220119T120306Z\nGEO:41.40;2.17\nLOCATION:art club barcelona (bou de sant pere 8 bajos\, Barcelona\, Spain\nURL:https://www.meetup.com/Life-Drawing/events/283355921/\nSEQUENCE:2\nLAST-MODIFIED:20220119T120306Z\nUID:event_283355921@meetup.com\nEND:VEVENT\nEND:VCALENDAR";
  const calendarString= `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:Black Health//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:Events - ${eventName}\nX-MS-OLK-FORCEINSPECTOROPEN:TRUE\nBEGIN:VTIMEZONE\nTZID:America/New_York\nTZURL:http://tzurl.org/zoneinfo-outlook/America/New_York\nX-LIC-LOCATION:America/New_York\nBEGIN:DAYLIGHT\nTZOFFSETFROM:+0100\nTZOFFSETTO:+0200\nTZNAME:CEST\nDTSTART:${convertDate(eventDate,eventStartTime)}Z\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:+0200\nTZOFFSETTO:+0100\nTZNAME:CET\nDTSTART:${eventDate}\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\nEND:STANDARD\nEND:VTIMEZONE\nBEGIN:VEVENT\nDTSTAMP:${created}\nDTSTART;TZID=America/New_York:${convertDate(eventDate,eventStartTime)}\nDTEND;TZID=America/New_York:${convertDate(eventDate,eventFinishTime)}\nSTATUS:CONFIRMED\nSUMMARY:${eventName}\nDESCRIPTION: ${onlineInPersonEventType}-${eventDescription}\n\nDib\nORGANIZER;CN=Meetup Reminder:MAILTO:blackhealthdata@gmail.com\nCLASS:PUBLIC\nCREATED:${created}\nGEO:41.40;2.17\nLOCATION:${locationAddress}\nURL:https://nblch.org/\nSEQUENCE:2\nLAST-MODIFIED:20220119T120306Z\nUID:blackhealthdata@gmail.com\nEND:VEVENT\nEND:VCALENDAR`

const calendarData=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Black Health v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Events - Black Health
X-MS-OLK-FORCEINSPECTOROPEN:TRUE
BEGIN:VTIMEZONE
TZID:America/New_York
TZURL:http://tzurl.org/zoneinfo-outlook/America/New_York
X-LIC-LOCATION:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:20220129T115020Z
DTSTART:${convertDate(eventDate,eventStartTime)}
DTEND:${convertDate(eventDate,eventFinishTime)}
STATUS:CONFIRMED
SUMMARY:${eventName}
DESCRIPTION:${onlineInPersonEventType}-${eventDescription}
ORGANIZER;CN=Black Health:MAILTO:nblchevents@nblch.org
CLASS:PUBLIC
LOCATION:215 W. 125th Street, Other, 11467
URL:https://nblch.org
SEQUENCE:2
UID:event_283355921@black_health_data_app_management
END:VEVENT
END:VCALENDAR`

const calendarDelFront=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Black Health v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Events - Black Health
X-MS-OLK-FORCEINSPECTOROPEN:TRUE
BEGIN:VTIMEZONE
TZID:America/New_York
TZURL:http://tzurl.org/zoneinfo-outlook/America/New_York
X-LIC-LOCATION:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:${created}
DTSTART:${convertDate(eventDate, eventStartTime)}
DTEND:${convertDate(eventDate,eventFinishTime)}
STATUS:CONFIRMED
SUMMARY: ${eventName}
DESCRIPTION:${eventDescription}
ORGANIZER;CN=Black Health:MAILTO:nblchevents@nblch.org
CLASS:PUBLIC
LOCATION:${locationAddress}
URL:https://nblch.org
SEQUENCE:2
UID:event_283355921@black_health_data_app_management
END:VEVENT
END:VCALENDAR`


  const reverse = eventDate.split('-')
  const reversedDate=reverse[1]+'/'+reverse[2]+'/'+reverse[0]

  let details = {
    from:'Black Health Data App',
    //to: clientHCWEmail,
    to:['DBenitez@nblch.org','nblchevents@nblch.org'],
    // to:['alexei@platformable.com','leon@platformable.com'],
    subject:"A new event has been registered for the NYS CMP program",
   /*  attachments:[{ 
      filename:`event-${eventName}.ics`,
      method:'PUBLISH',
      path:icsMSG,
      content:icsMSG,
      encoding:'base64'
  },], */
  icalEvent: {
    filename: `${eventName}.ics`,
    method: 'PUBLISH',
    content: calendarData,
},
    text:`
    Hi, a new event has been registered for the NYS CMP program.

    ${eventName}
    ${reversedDate}
    ${workArea}
    
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

module.exports = {
  getEvents: async (req, res) => {
    try {
      const allData =
        await db.query(`select events.*,events_output.id as posteventreportid from events
            full outer join events_output on events_output.eventid = events.id where events.id IS NOT NULL`);
      const response = allData.rows;
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  getEventById: async (req, res) => {
    let { id } = await req.params;

    const query = {
      text: `select * from events where events.id=$1`,
      /* text:`select events.*,users."name" as username ,users.lastname as userlastname from events 
          join users on events.userid = users.userid 
          where events.id=$1`, */
      values: [id],
    };
    try {
      const allData = await db.query(query);
      const response = allData.rows;
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  createEvent: async (req, res) => {
    const {
      userID,
      eventDateCreated,
      programID,
      programName,
      eventName,
      eventDate,
      eventStartTime,
      eventFinishTime,
      eventLocationTypeID = Number(eventLocationTypeID),
      eventLocationTypeName,
      healthAreaOfFocusID = Number(eventLocationTypeID),
      healthAreaOfFocusName,
      eventTypeID = Number(eventTypeID),
      eventTypeName,
      nysActivity,
      nysActivityOther,
      onlineInPersonEventType,
      inPersonEventTypeID,
      inPersonEventTypeName,
      onlineEventTypeID,
      onlineEventTypeName,
      eventDescription,
      additionalMaterials,
      createdByName,
      createdByLastname,
      workArea,
workAreaOther,
locationName,
locationNameOther,
locationAddress,
eventZipCode,
icsUrlFile,
borough
    } = req.body;
    console.log("req.body", req.body);

    const folders = await connectDropboxAndCreateFolders(
      DBXCLIENT_ID,
      programName,
      eventName,
      eventDate
    );

    try {
      const text = `INSERT INTO events 
      (userID,eventDateCreated,programID,programName,eventName,eventDate,eventStartTime,eventFinishTime,
          eventLocationTypeID,eventLocationTypeName,healthAreaOfFocusID,healthAreaOfFocusName,
          eventTypeID ,eventTypeName,folderUrl,folderPath,nysActivity,nysActivityOther,onlineInPersonEventType,
          inPersonEventTypeID,
          inPersonEventTypeName,
          onlineEventTypeID,
          onlineEventTypeName,eventDescription,additionalMaterials,
          createdByName,
            createdByLastname,
            workArea,
workAreaOther,
locationName,
locationNameOther,
locationAddress,
eventZipCode,
icsUrlFile,
borough
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35) RETURNING *`;
      const values = [
        userID,
        eventDateCreated,
        programID,
        programName,
        eventName,
        eventDate,
        eventStartTime,
        eventFinishTime,
        eventLocationTypeID,
        eventLocationTypeName,
        healthAreaOfFocusID,
        healthAreaOfFocusName,
        eventTypeID,
        eventTypeName,
        mainFolder,
        folderPath,
        nysActivity,
        nysActivityOther,
        onlineInPersonEventType,
        inPersonEventTypeID,
        inPersonEventTypeName,
        onlineEventTypeID,
        onlineEventTypeName,
        eventDescription,
        additionalMaterials,
        createdByName,
        createdByLastname,
        workArea,
workAreaOther,
locationName,
locationNameOther,
locationAddress,
eventZipCode,
icsUrlFile,
borough
      ];

      if (
        mainFolder !== "" ||
        mainFolder !== null ||
        mainFolder !== undefined
      ) {
        const allData = await db.query(text, values);
        const response = await allData.rows;
        eventId = response[0].id;
        const generatedQRCode = await createQrCode(eventId).then((code) =>
          setTimeout(() => {
            updateEventWithQrCode(eventId, generatedCode);
          }, 8000)
        );
        const sendMessage = await sendMessageToSubscriber(eventName,eventDate,workArea,eventDescription,locationAddress,onlineInPersonEventType,eventStartTime,eventFinishTime)
        res
          .status(200)
          .send({ message: "Event saved successfully", statusText: "OK" });
      }
    } catch (e) {
      console.log("error", e);
      res
        .status(400)
        .json({
          message: "an error ocurred, please try again",
          statusText: "FAIL",
          error:e
        });
    }
  },
  updateEvent: async (req, res) => {
    let {
      eventid,
      userID,
      eventDateCreated,
      programID,
      programName,
      eventName,
      eventDate,
      eventStartTime,
      eventFinishTime,
      eventLocationTypeID,
      eventLocationTypeName,
      healthAreaOfFocusID,
      healthAreaOfFocusName,
      eventTypeID,
      eventTypeName,

      eventDescription,
      onlineInPersonEventType,
      inPersonEventTypeID,
      inPersonEventTypeName,
      onlineEventTypeID,
      onlineEventTypeName,
      nysActivity,
      nysActivityOther,
      additionalMaterials,
      workArea,
workAreaOther,
locationName,
locationNameOther,
locationAddress,
eventZipCode,
    } = req.body;

    try {
      const query = await {
        text: `update events set
            userID=$2 ,
        eventDateCreated=$3 ,
        programID=$4,
        programName=$5,
        eventName=$6,
        eventDate=$7,
        eventStartTime=$8,
        eventFinishTime=$9,
        eventLocationTypeID=$10,
        eventLocationTypeName=$11,
        healthAreaOfFocusID=$12,
        healthAreaOfFocusName=$13,
        eventTypeID=$14,
        eventTypeName=$15,
        
        eventDescription=$16,
            onlineInPersonEventType=$17,
        inPersonEventTypeID=$18,
        inPersonEventTypeName=$19,
        onlineEventTypeID=$20,
        onlineEventTypeName=$21,
        nysActivity=$22,
          nysActivityOther =$23,
          additionalMaterials=$24,
          workArea=$25,
workAreaOther=$26,
locationName=$27,
locationNameOther=$28,
locationAddress=$29,
eventZipCode=$30
        where id=$1`,
        values: [
          eventid,
          userID,
          eventDateCreated,
          programID,
          programName,
          eventName,
          eventDate,
          eventStartTime,
          eventFinishTime,
          eventLocationTypeID,
          eventLocationTypeName,
          healthAreaOfFocusID,
          healthAreaOfFocusName,
          eventTypeID,
          eventTypeName,
          eventDescription,
          onlineInPersonEventType,
          inPersonEventTypeID,
          inPersonEventTypeName,
          onlineEventTypeID,
          onlineEventTypeName,
          nysActivity,
          nysActivityOther,
          additionalMaterials,
          workArea,
          workAreaOther,
          locationName,
          locationNameOther,
          locationAddress,
          eventZipCode,
          
        ],
      };
      db.query(query).then((response) => {
        console.log(response);
        res.json({
          message: "Updated successfully",
          statusText: "OK",
        });
      });
    } catch (error) {
      res.send(e.stack);
      console.log("error message:", error);
    }
  },
  createeventtest: async (req, res) => {
    let code;
    const f1 = async () => {
      console.log("1");
      let id = 1;
      var opts = {
        errorCorrectionLevel: "H",
        type: "image/jpeg",
        quality: 1,
        margin: 1,
        scale: 15,
      };

      code = QRCode.toDataURL(
        `http://www.bh.platformable.com/events/${id}/participant-survey/survey`,
        opts
      );
      return code;
    };

    const f2 = async (code, res) => {
      console.log("generatedCode", code);

      return code
    };

    async function all() {
      console.time("time");
      const res1 = await f1();
      const res2 = await f2(code, res);
    //            console.log("res2",res2)
      const res3= await res2
      res.send(res3)
      console.timeEnd("time");
    }

    all();
  },
  deleteEvent: async (req, res) => {
    let { id } = req.body;
    console.log(req.body);

    const query = {
      text: "DELETE from events where id=$1",
      values: [id],
    };
    // promise
    db.query(query)
      .then((data) => {
        if ((data.rowCount = 1)) {
          res.send({
            statusText: "OK",
            response: "Event deleted",
          });
        }
      })
      .catch((e) => console.error(e.stack));
  },
  getDropbox:async (req,res)=>{
    res.send("getDropbox")
  },


  createOefEvent: async (req, res) => {
    const {
      eventDateCreated,
      programID,
      programName,
      eventName,
      eventDate,
      eventStartTime,
      eventFinishTime,
      healthAreaOfFocusID,
      healthAreaOfFocusName,
      createdByName,
      createdByLastname,
      eventZipCode,
      borough,
      oefEventEmail,
      deliveryPartner,
    } = req.body;
    console.log("req.body from create oef event", req.body);
const submissionStatus='Submitted'
    try {
      const text = `INSERT INTO events 
      (
eventDateCreated,
programID,
programName,
eventName,
eventDate,
eventStartTime,
eventFinishTime,
healthAreaOfFocusID,
healthAreaOfFocusName,
createdByName,
createdByLastname,
eventZipCode,
borough,
oefEventEmail,
deliveryPartner,
submissionStatus) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`;
      const values = [
eventDateCreated,
programID,
programName,
eventName,
eventDate,
eventStartTime,
eventFinishTime,
healthAreaOfFocusID,
healthAreaOfFocusName,
createdByName,
createdByLastname,
eventZipCode,
borough,
oefEventEmail,
deliveryPartner,
submissionStatus
      ];


        const saveData = await db.query(text, values);
        const response = saveData.rows;
        const eventId=response[0].id
        console.log("eventId",eventId)
        const getRefreshToken= await dropbox.connectToDropbox()
        const token=await getRefreshToken
        //console.log("token",token)
        const createFolders= await dropbox.createAllFolders(token,programName,eventName,eventDate)
        const shareDocumentFolder= await dropbox.shareFolder(token,programName,eventName,eventDate,'Documents')
        const shareDocumentsResults= shareDocumentFolder
        console.log("shareDocumentsFolder",shareDocumentsResults)
        res.status(200).send({ message: "Event saved successfully", statusText: "OK" });
    } catch (e) {
      console.log("error", e);
      res
        .status(400)
        .json({
          message: "an error ocurred, please try again",
          statusText: "FAIL",
          error:e
        });
    }
  },
};
