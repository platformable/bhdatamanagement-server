const db = require("../dbConnect");
const { Dropbox } = require("dropbox");
const axios = require("axios");

const dotenv=require('dotenv')
//const cron = require('node-cron')
const fs = require('fs');

const buffer = require('buffer/').Buffer;
const fetch = require('node-fetch');
const { URLSearchParams } = require('node:url');



var ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TK;
//var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
let tokenFromRefresh; // THIS VARIABLE WILL STORE THE ACCESS_TOKEN GIVEN FROM THE REFRESH



const DBXCLIENT_ID = process.env.DBX_CLIENT_ID;
const CLIENT_SECRET = process.env.DBX_CLIENT_SECRET;

const config = {
    clientId: DBXCLIENT_ID,
    clientSecret: CLIENT_SECRET,
};
const dbx = new Dropbox(config);



const getAccessToken=(DBXCLIENT_ID,res)=>{

    //GENERATE CODE FROM CLIENTID AND CLIENTSECRET TO BE USED TO REQUEST THE ACCESSTOKEN FROM REFRESH 
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
    fetch("https://api.dropbox.com/oauth2/token", requestOptions)
        .then(response => response.json())
        .then(result => newAccessToken = result)
        .then(accessTokenResult => {
            tokenFromRefresh = accessTokenResult.access_token // ADDING TO tokenFromRefresh (GLOBAL VARIABLE) THE ACCESS TOKEN THANKS TO REFRESHgit push
            res.status(200).json({
                message:"OK",
                access_token:tokenFromRefresh
            })
        })
        .catch(error => console.log('error from getAccessToken', error))
  }




module.exports = {
    getDropboxAccessToken: async (req,res)=>{
        getAccessToken(DBXCLIENT_ID,res)

    }

}