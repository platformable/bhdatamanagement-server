const db = require("../dbConnect");
const axios = require("axios");
const { Dropbox } = require("dropbox");
const { URLSearchParams } = require('node:url');
const buffer = require('buffer/').Buffer;
const createFolder = require('./createEventsFolders')
const fetch = require('node-fetch');

let tokenFromRefresh; //
let mainFolder;
let folderPath;

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




module.exports= {
    getEvents: async (req,res)=>{
        try {
            const allData = await db.query("select * from events");
            const response = allData.rows;
            res.send(response);
          } catch (e) {
            res.send("an error ocurred");
          }
    },
    getEventById:async (req,res)=>{
        let { id } = await req.params;

        const query = {

          text:`select * from events where id=$1`,
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
            eventTypeID=Number(eventTypeID),eventTypeName,libros
        } = req.body;
        console.log("req.body",req.body)

        const folders = await  connectDropboxAndCreateFolders(DBXCLIENT_ID,programName,eventName,eventDate)
        
        try {
          const text =
      `INSERT INTO events 
      (userID,eventDateCreated,programID,programName,eventName,eventDate,eventStartTime,eventFinishTime,
          eventLocationTypeID,eventLocationTypeName,healthAreaOfFocusID,healthAreaOfFocusName,
          eventTypeID ,eventTypeName,folderUrl,folderPath,libros) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`;
      const values = [
      userID,eventDateCreated,programID,programName,eventName,
      eventDate,eventStartTime,eventFinishTime ,eventLocationTypeID,eventLocationTypeName,
      healthAreaOfFocusID,healthAreaOfFocusName,eventTypeID,eventTypeName,mainFolder,folderPath,libros];
      
          if(mainFolder!=="" || mainFolder!==null || mainFolder !==undefined){
            const allData = await db.query(text,values);
            //const response = await allData.rows;
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
            eventTypeName} = req.body;
 
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
        eventTypeName=$15 where id=$1`,
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
                eventTypeName]
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

        connectDropboxAndCreateFolders(res,DBXCLIENT_ID,'A6131G')
      }
}