const db = require("../dbConnect");
const axios = require("axios");
//const { Dropbox } = require("dropbox");
const dropbox = require('../utils/dropbox')
const sendEmail=require('../utils/sendEmail')
const { URLSearchParams } = require("node:url");
const buffer = require("buffer/").Buffer;
const createFolder = require("./createEventsFolders");
const fetch = require("node-fetch");
var QRCode = require("qrcode");
let nodemailer = require("nodemailer");

const DBXCLIENT_ID = process.env.DBX_CLIENT_ID;
const CLIENT_SECRET = process.env.DBX_CLIENT_SECRET;


const sendMessageToSubscriber = async (eventName,eventDate,workArea,eventDescription,locationAddress,onlineInPersonEventType,eventStartTime,eventFinishTime)=>{
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
  
  
    const reverse = eventDate.split('-')
    const reversedDate=reverse[1]+'/'+reverse[2]+'/'+reverse[0]
  
    let details = {
      from:'Black Health Data App',
      //to: clientHCWEmail,
      to:['alexei@platformable.com','leon@platformable.com'],
      subject:"A new event has been registered for the OEF CBT program",
    icalEvent: {
      filename: `${eventName}.ics`,
      method: 'PUBLISH',
      content: calendarData,
  },
      text:`
      Hi, a new event has been registered for the OEF CBT program.
  
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





module.exports ={
    getAllCbts: async (req, res) => {
        try {
          const allData = await db.query("select * from cbt");
          const response = allData.rows;
          res.send(response);
        } catch (e) {
          res.send("an error ocurred");
        }
      },
      getCbtById: async (req, res) => {
        let {id} = req.params
        console.log("id",id)
        try {
          const allData = await db.query(`select * from cbt where id=${id}`);
          const response = allData.rows;
          res.send(response);
        } catch (e) {
          res.send("an error ocurred");
        }
      },
createCBTEvent: async (req, res) => {
    let {
        eventName,
        eventDate,
        eventStartTime,
        eventFinishTime,
        healthAreaOfFocusId,
        healthAreaOfFocusName,
        onlineInPersonEventType,
        eventDescription,
    } = req.body;
    console.log("req.body from create oef cbt event", req.body);
const submissionStatus='Submitted'
    try {
      const text = `INSERT INTO cbt 
      (
        eventName,
        eventDate,
        eventStartTime,
        eventFinishTime,
        healthAreaOfFocusId,
        healthAreaOfFocusName,
        onlineInPersonEventType,
        eventDescription) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
      let values = [
        eventName,
        eventDate,
        eventStartTime,
        eventFinishTime,
        healthAreaOfFocusId,
        healthAreaOfFocusName,
        onlineInPersonEventType,
        eventDescription
      ];
        const saveData = await db.query(text, values);
        const response = saveData.rows;
        const eventId=response[0].id
        console.log("eventId",eventId)
        const getRefreshToken= await dropbox.connectToDropbox()
        const token=await getRefreshToken
        //console.log("token",token)
        const createFolders= await dropbox.createAllFolders(token,'OEF/CBT',eventName,eventDate)
        //const shareDocumentFolder= await dropbox.shareFolder(token,programName,eventName,eventDate,'Documents')
        const shareDocumentFolder= await dropbox.shareMainFolder(token,'OEF/CBT',eventName,eventDate)
        console.log('shareDocumentFolder',shareDocumentFolder)
        const DocumentsFolderAsyncJobId= await shareDocumentFolder.data.async_job_id
        let inProgress = false
        let mainFolderUrl={}
        while (inProgress === false) {
          console.log("while")
          console.log("INPROGRESS",inProgress)
          const getDocumentsFolderUrl= await dropbox.getFolderUrl(token,DocumentsFolderAsyncJobId);

          if (getDocumentsFolderUrl.data['.tag'] === 'in_progress') {
            
            inProgress = false
            
          } else {
            inProgress = true
            console.log("TERMINO**--------****", getDocumentsFolderUrl.data)
            mainFolderUrl.url= await getDocumentsFolderUrl.data.preview_url
            mainFolderUrl.path= await getDocumentsFolderUrl.data.path_lower
             
          }
          console.log("inprogress despues", inProgress)
        }
        console.log("MainFolderUrl",mainFolderUrl)
        //console.log("ImagesFolderUrl",ImagesForlderUrl)
        const addSharedFolderToEvent=await dropbox.addFoldersToEvent(mainFolderUrl.url, mainFolderUrl.path, eventId,'cbt')
        const sendMessage= await sendMessageToSubscriber(eventName,eventDate,workArea='',eventDescription,locationAddress='New York City',onlineInPersonEventType='Online',eventStartTime,eventFinishTime)
        console.log("success")
        res.status(200).send({ message: "Event saved successfully", statusText: "OK", createdEventId:eventId });
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
}