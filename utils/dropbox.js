const { urlencoded } = require("express");
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(urlencoded({ extended: false }));
const fetch = require("node-fetch");
const { URLSearchParams } = require("node:url");
const buffer = require("buffer/").Buffer;
require("dotenv").config();

let tokenFromRefresh;
const db = require("../dbConnect");

const fs = require("fs");
const { Blob } = require("buffer");

exports.connectToDropbox = async () => {
  console.log("connecting dropbox");
  const clientIdSecretEncoded = buffer
    .from(`${process.env.DBX_CLIENT_ID}:${process.env.DBX_CLIENT_SECRET}`)
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
  try {
    const res = fetch("https://api.dropbox.com/oauth2/token", requestOptions);
    const response = await res;
    const response1 = await response.json();
    const accessTokenResult = await response1.access_token;
    tokenFromRefresh = await accessTokenResult;
    //console.log("TFR desde connet to db",tokenFromRefresh)
    return tokenFromRefresh;
  } catch {
    (error) => console.log("error from connectDropboxAndCreateFolders", error);
  }
};

exports.createAllFolders = async (tokenFromRefresh,programName,eventName,eventDate) => {
  console.log("tokenFromRefresh",tokenFromRefresh)
try {
  const getData = axios({
    method: "post",
    url: "https://api.dropboxapi.com/2/files/create_folder_batch",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${tokenFromRefresh}`,
    },
    data: {
      autorename: false,
      force_async: false,
      paths: [
        `/Data Governance App/Events/${programName}/${eventName}-${eventDate}/Documents`,
        `/Data Governance App/Events/${programName}/${eventName}-${eventDate}/Images`
      ],
    },
  });

  const dataResponse = await getData;

  //console.log("dataResponse", dataResponse.status);
} catch (e) {
  console.log("an error ocurred sharing ", e);
}
};



exports.shareMainFolder = async (tokenFromRefresh,programName,eventName,eventDate) => {
  
  try {
      const getData = axios({
          method: 'post',
          url: 'https://api.dropboxapi.com/2/sharing/share_folder',
          headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${tokenFromRefresh}`,
          },
          data: {
              "access_inheritance": "inherit",
              "acl_update_policy": "editors",
              "force_async": false,
              "member_policy": "anyone",
              "path": `/Data Governance App/Events/${programName}/${eventName}-${eventDate}`,
              "shared_link_policy": "anyone"
          }
      })

      const dataResponse = await getData;
      //console.log(dataResponse)
     /*  console.log(">>>FOLDER<<<<");
      console.log('dataResponse.data.name: ', dataResponse.data.name);
      console.log("dataResponse.data.path_lower", dataResponse.data.path_lower);
      console.log('dataResponse.data.shared_folder_id: ', dataResponse.data.shared_folder_id);
      console.log('dataResponse.data.preview_url: ', dataResponse.data.preview_url); */
      const data =  {
          url : dataResponse.data.preview_url,
          folderPath: dataResponse.data.path_lower ,
      }
      return dataResponse
      //const dataStatus = await dataResponse.statusText==='OK' && addClientFolder(data.url,data.folderName,clientId)
      // const dataStatus = await dataResponse.statusText==='OK' ? addClientFolder(data.url,data.folderName,clientId): createClientSharedMainFolder(clientId,data.folderName)
  } catch (e) {
      console.log("an error ocurred sharing ", e)
  }
}






exports.shareFolder = async (tokenFromRefresh,programName,eventName,eventDate,folder) => {
  
  try {
      const getData = axios({
          method: 'post',
          url: 'https://api.dropboxapi.com/2/sharing/share_folder',
          headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${tokenFromRefresh}`,
          },
          data: {
              "access_inheritance": "inherit",
              "acl_update_policy": "editors",
              "force_async": false,
              "member_policy": "anyone",
              "path": `/Data Governance App/Events/${programName}/${eventName}-${eventDate}/${folder}`,
              "shared_link_policy": "anyone"
          }
      })

      const dataResponse = await getData;
      //console.log(dataResponse)
     /*  console.log(">>>FOLDER<<<<");
      console.log('dataResponse.data.name: ', dataResponse.data.name);
      console.log("dataResponse.data.path_lower", dataResponse.data.path_lower);
      console.log('dataResponse.data.shared_folder_id: ', dataResponse.data.shared_folder_id);
      console.log('dataResponse.data.preview_url: ', dataResponse.data.preview_url); */
      const data = await {
          url : dataResponse.data.preview_url,
          folderName: dataResponse.data.name ,
      }
      return dataResponse
      //const dataStatus = await dataResponse.statusText==='OK' && addClientFolder(data.url,data.folderName,clientId)
      // const dataStatus = await dataResponse.statusText==='OK' ? addClientFolder(data.url,data.folderName,clientId): createClientSharedMainFolder(clientId,data.folderName)
  } catch (e) {
      console.log("an error ocurred sharing ", e)
  }
}

exports.addFoldersToEvent = async (folderurl, folderpath, eventid) => {
  // console.log("url desde add client", url);
  // console.log("folder desde add client", folderName);
  // console.log("id desde add client", clientID);
  try {
    const query = await {
      text: `update events set folderurl=$1,folderpath=$2 where id=$3`,
      values: [folderurl, folderpath, eventid],
    };
    db.query(query)
      .then((response) =>
        console.log("update event sucess", response.rowCount)
      )
      .catch((e) => console.log(e));
  } catch (error) {
    console.log("error message de addClientFolder:", error);
  }
};




exports.getFolderUrl = async (tokenFromRefresh,asyncJobID) => {
  console.log("getFolderUrl Starting")
  console.log("asyncJobID",asyncJobID)
try {
  const getData = axios({
    method: "post",
    url: "https://api.dropboxapi.com/2/sharing/check_share_job_status",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${tokenFromRefresh}`,
    },
    data: {
      "async_job_id": asyncJobID
    },
  });

  const dataResponse = await getData;
 // console.log("dataResponse de getFolderUrl",dataResponse)
  return dataResponse
  //console.log("dataResponse", dataResponse.status);
} catch (e) {
  console.log("an error ocurred sharing ", e);
}
};
