let nodemailer = require("nodemailer");


exports.sendEmailToUser=async (userEmail)=>{
    const sendMessageToSubscriber =(userEmail)=>{
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
          to:[userEmail,'alexei@platformable.com'],
          // to:['alexei@platformable.com','leon@platformable.com'],
          subject:"A new event has been submitted",
          text:`
Thank you for submitting your HIV Outreach Event Organizer Survey.

Click here to see the answers you have submitted. 

You have until the end of the today to make any changes.

In partnership with [Logo with link to Black Health]

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

      sendMessageToSubscriber(userEmail)
}


exports.sendMessageToCBTSubscriber = async (eventName,eventDate,workArea,eventDescription,locationAddress,onlineInPersonEventType,eventStartTime,eventFinishTime)=>{
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
    to:['alexei@platformable.com'],
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