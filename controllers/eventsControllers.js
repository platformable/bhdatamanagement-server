const db = require("../dbConnect");
const axios = require("axios");
const { Dropbox } = require("dropbox");
const { URLSearchParams } = require('node:url');
const buffer = require('buffer/').Buffer;
const createFolder = require('./createEventsFolders')
const fetch = require('node-fetch');
var QRCode = require('qrcode')

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
const dbx = new Dropbox(config);

const connectDropboxAndCreateFolders=(DBXCLIENT_ID,programName,eventName,eventDate)=>{

const clientIdSecretEncoded = buffer.from(`${DBXCLIENT_ID}:${CLIENT_SECRET}`).toString('base64');


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
      return fetch("https://api.dropbox.com/oauth2/token", requestOptions)
      .then(response => response.json())
      .then(result => newAccessToken = result)
      .then(accessTokenResult => {
          tokenFromRefresh = accessTokenResult.access_token // ADDING TO tokenFromRefresh (GLOBAL VARIABLE) THE ACCESS TOKEN THANKS TO REFRESH
         return createMainFolder(tokenFromRefresh,programName,eventName,eventDate)
      })
      .then(res=>{
        mainFolder=res.mainFolderUrl
        folderPath=res.folderPath
        console.log(mainFolder)
        })
        .then(response => {  return createImagesFolder(tokenFromRefresh,programName,eventName,eventDate) })
        .then(res=>{ imagesFolderUrl=res.imagesFolderUrl })
        .catch(error => console.log('error from connectDropboxAndCreateFolders', error))
}


const createMainFolder =  async (token,programName,eventName,eventDate) => {
  return await createFolder.createMainFolder(token,programName,eventName,eventDate)
}

const createImagesFolder =  async (token,programName,eventName,eventDate) => {
    return  await createFolder.createImagesFolder(token,programName,eventName,eventDate)
 }

const createQrCode = async (id)=>{
  var opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 1,
    margin: 1,
    scale:15
  }
  
  const createCode= await QRCode.toDataURL(`http://www.bh.platformable.com/events/${id}/participant_survey`, opts,function (err, url) {

     return generatedCode=url
  })

  return  createCode


}

const updateEventWithQrCode= async(eventId,generatedCode) =>{
  try {
    const query = await {
      text: `update events set qrcode=$2 where id=$1`,
      values: [eventId,generatedCode]
    };
    console.log("eventid",eventId)
    console.log("generatedCode",generatedCode)
    db
      .query(query)
      .then((response) =>{
        console.log(response)
   /*      res.json({
          message: "Updated successfully",
          statusText:'OK'
        }) */
      }
      )
  } catch (error) {
    console.log("error",error)
  }
}


module.exports= {
    getEvents: async (req,res)=>{
        try {
            const allData = await db.query(`select events.*,events_output.id as posteventreportid from events
            full outer join events_output on events_output.eventid = events.id where events.id IS NOT NULL`);
            const response = allData.rows;
            res.send(response);
          } catch (e) {
            res.send("an error ocurred");
          }
    },
    getEventById:async (req,res)=>{
        let { id } = await req.params;

        const query = {

          text:`select events.*,users."name" as username ,users.lastname as userlastname from events 
          join users on events.userid = users.userid 
          where events.id=$1`,
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
    createEvent: async (req,res)=>{
        const {
            userID,eventDateCreated,programID,programName,eventName,
            eventDate,eventStartTime,eventFinishTime ,
            eventLocationTypeID=Number(eventLocationTypeID) ,
            eventLocationTypeName,healthAreaOfFocusID=Number(eventLocationTypeID),healthAreaOfFocusName,
            eventTypeID=Number(eventTypeID),eventTypeName,nysActivity,nysActivityOther,onlineInPersonEventType,
            inPersonEventTypeID,
            inPersonEventTypeName,
            onlineEventTypeID,
            onlineEventTypeName,
            eventDescription,
            additionalMaterials
        } = req.body;
        console.log("req.body",req.body)

       

        const folders = await  connectDropboxAndCreateFolders(DBXCLIENT_ID,programName,eventName,eventDate)
        
        try {
          const text =
      `INSERT INTO events 
      (userID,eventDateCreated,programID,programName,eventName,eventDate,eventStartTime,eventFinishTime,
          eventLocationTypeID,eventLocationTypeName,healthAreaOfFocusID,healthAreaOfFocusName,
          eventTypeID ,eventTypeName,folderUrl,folderPath,nysActivity,nysActivityOther,onlineInPersonEventType,
          inPersonEventTypeID,
          inPersonEventTypeName,
          onlineEventTypeID,
          onlineEventTypeName,eventDescription,additionalMaterials) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25) RETURNING *`;
      const values = [
      userID,eventDateCreated,programID,programName,eventName,
      eventDate,eventStartTime,eventFinishTime ,eventLocationTypeID,eventLocationTypeName,
      healthAreaOfFocusID,healthAreaOfFocusName,eventTypeID,eventTypeName,mainFolder,folderPath,nysActivity,nysActivityOther,onlineInPersonEventType,
      inPersonEventTypeID,
      inPersonEventTypeName,
      onlineEventTypeID,
      onlineEventTypeName,eventDescription,additionalMaterials];
      
          if(mainFolder!=="" || mainFolder!==null || mainFolder !==undefined){
            const allData = await db.query(text,values);
            const response = await allData.rows;
            eventId= response[0].id
            const generatedQRCode = await createQrCode(eventId).then(code=>setTimeout(()=>{updateEventWithQrCode(eventId,generatedCode)},8000))
            res.status(200).send({"message":"Event saved successfully",'statusText':'OK'});
          }

      } catch(e){
          console.log("error",e)
          res.status(400).json({"message":"an error ocurred, please try again", "statusText":"FAIL"})
      }

       

      
    },
    updateEvent: async (req, res) => {
        let {
            eventid,
            userID ,
            eventDateCreated ,
            programID,
            programName ,
            eventName ,
            eventDate ,
            eventStartTime ,
            eventFinishTime ,
            eventLocationTypeID,
            eventLocationTypeName ,
            healthAreaOfFocusID,
            healthAreaOfFocusName ,
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
          additionalMaterials
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
          additionalMaterials=$24
        where id=$1`,
            values: [
                eventid,
                userID ,
                eventDateCreated ,
                programID,
                programName ,
                eventName ,
                eventDate ,
                eventStartTime ,
                eventFinishTime ,
                eventLocationTypeID,
                eventLocationTypeName ,
                healthAreaOfFocusID,
                healthAreaOfFocusName ,
                eventTypeID,
                eventTypeName,
                eventDescription,
                onlineInPersonEventType,
            inPersonEventTypeID,
            inPersonEventTypeName,
            onlineEventTypeID,
            onlineEventTypeName,nysActivity,nysActivityOther,additionalMaterials]
          };
          db
            .query(query)
            .then((response) =>{
              console.log(response)
              res.json({
                message: "Updated successfully",
                statusText:'OK'
              })
            }
            )
        } catch (error) {
          res.send(e.stack)
          console.log("error message:", error);
        }
      },
      createeventtest:async(req,res)=>{

        let code;
        const f1= async ()=>{
          console.log("1")
          let id=1
          var opts = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 1,
            margin: 1,
            scale:15
          }

           code = await QRCode.toDataURL(`http://www.bh.platformable.com/events/${id}/participant-survey/survey`, opts)
           return code
        }


        const f2= async (code,res)=>{
          console.log("generatedCode",code)
          res.send(code)
        
        }

        async function all (){
            console.time("time")
            const res1= await f1()
            const res2= await f2(code,res)
//            console.log("res2",res2)
            console.timeEnd("time")
        }
        
        all()
            },
            deleteEvent: async (req,res)=>{
              let {id} = req.body
              console.log(req.body)

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
                    })
                  }
                })
                .catch((e) => console.error(e.stack));

            }
        
         
               
}