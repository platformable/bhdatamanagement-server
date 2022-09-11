const axios = require("axios")
const db = require("../dbConnect");



exports.createMainFolder = async (token,programName,eventName,eventDate) => {
    try {
        const getData = axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/sharing/share_folder',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
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
        const folderUrl={mainFolderUrl:dataResponse.data.preview_url,folderPath:dataResponse.data.path_lower}

      //  console.log("success main folder")
        const data =  {
            url : dataResponse.data.preview_url,
            folderName: dataResponse.data.name ,
        }
       //const dataStatus = await dataResponse.statusText==='OK' ? folderUrl: this.createMainFolder(token,programName,eventName,eventDate)
        return  folderUrl
       // const dataStatus = await dataResponse.statusText==='OK' && addClientFolder(data.url,'INTAKE',clientId)
        // const dataStatus = await dataResponse.statusText==='OK' ? addClientFolder(data.url,data.folderName,clientId): createClientSharedMainFolder(clientId,data.folderName)
   
    } catch (e) {
        console.log("an error ocurred sharing ", e.response.data)
    }
}


exports.createImagesFolder = async (token,programName,eventName,eventDate) => {
    try {
        const getData = axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/sharing/share_folder',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
            data: {
                "access_inheritance": "inherit",
                "acl_update_policy": "editors",
                "force_async": false,
                "member_policy": "anyone",
                "path": `/Data Governance App/Events/${programName}/${eventName}-${eventDate}/Images`,

            }
        })

        const dataResponse = await getData;
        const folderUrl={imagesFolderUrl:dataResponse.data.preview_url}
        const data =  {
            url : dataResponse.data.preview_url,
            folderName: dataResponse.data.name ,
        }
        const dataStatus = await dataResponse.statusText==='OK' ? folderUrl: this.createImagesFolder(token,programName,eventName,eventDate)
        return  folderUrl
       // const dataStatus = await dataResponse.statusText==='OK' && addClientFolder(data.url,'INTAKE',clientId)
        // const dataStatus = await dataResponse.statusText==='OK' ? addClientFolder(data.url,data.folderName,clientId): createClientSharedMainFolder(clientId,data.folderName)
   
    } catch (e) {
        console.log("an error ocurred sharing ", e.response.data)
    }
}


