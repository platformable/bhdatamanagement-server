const connectDropbox = async () => {
    const clientIdSecretEncoded = buffer
      .from(`${process.env.DBXCLIENT_ID}:${process.env.CLIENT_SECRET}`)
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
      return tokenFromRefresh;
    } catch {
      (error) => console.log("error from connectDropboxAndCreateFolders", error);
    }
  };

  const createAllFolders = async (eventName) => {
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
          `/Datagovernance/${eventName}-${eventDate}/`,
          `/Datagovernance/${eventName}-${eventDate}/Images`,
        ],
      },
    });

    const dataResponse = await getData;

    console.log("dataResponse", dataResponse.status);
  } catch (e) {
    console.log("an error ocurred sharing ", e);
  }
};




module.exports ={

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
icsUrlFile
    } = req.body;
    console.log("req.body", req.body);

    const folders = await connectDropboxAndCreateFolders(DBXCLIENT_ID, programName,eventName,eventDate);

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
icsUrlFile
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34) RETURNING *`;
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
icsUrlFile
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
        const sendMessage = await sendMessageToSubscriber(eventName,eventDate,workArea,icsUrlFile)
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
  }
}

var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Meetup//Meetup Events v1.0//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:Events - Life Drawing Barcelona\nX-MS-OLK-FORCEINSPECTOROPEN:TRUE\nBEGIN:VTIMEZONE\nTZID:Europe/Madrid\nTZURL:http://tzurl.org/zoneinfo-outlook/Europe/Madrid\nX-LIC-LOCATION:Europe/Madrid\nBEGIN:DAYLIGHT\nTZOFFSETFROM:+0100\nTZOFFSETTO:+0200\nTZNAME:CEST\nDTSTART:19700329T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:+0200\nTZOFFSETTO:+0100\nTZNAME:CET\nDTSTART:19701025T030000\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\nEND:STANDARD\nEND:VTIMEZONE\nBEGIN:VEVENT\nDTSTAMP:20220129T115020Z\nDTSTART;TZID=Europe/Madrid:20220130T180000\nDTEND;TZID=Europe/Madrid:20220130T200000\nSTATUS:CONFIRMED\nSUMMARY:Nude Life Drawing @fem.fatigue at Studio\nDESCRIPTION:Life Drawing Barcelona\nSunday\, January 30 at 6:00 PM\n\nDib\nORGANIZER;CN=Meetup Reminder:MAILTO:info@meetup.com\nCLASS:PUBLIC\nCREATED:20220119T120306Z\nGEO:41.40;2.17\nLOCATION:art club barcelona (bou de sant pere 8 bajos\, Barcelona\, Spain\nURL:https://www.meetup.com/Life-Drawing/events/283355921/\nSEQUENCE:2\nLAST-MODIFIED:20220119T120306Z\nUID:event_283355921@meetup.com\nEND:VEVENT\nEND:VCALENDAR";



const calendarString= `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Meetup//Meetup Events v1.0//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:Events - Life Drawing Barcelona\nX-MS-OLK-FORCEINSPECTOROPEN:TRUE\nBEGIN:VTIMEZONE\nTZID:Europe/Madrid\nTZURL:http://tzurl.org/zoneinfo-outlook/Europe/Madrid\nX-LIC-LOCATION:Europe/Madrid\nBEGIN:DAYLIGHT\nTZOFFSETFROM:+0100\nTZOFFSETTO:+0200\nTZNAME:CEST\nDTSTART:19700329T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:+0200\nTZOFFSETTO:+0100\nTZNAME:CET\nDTSTART:19701025T030000\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\nEND:STANDARD\nEND:VTIMEZONE\nBEGIN:VEVENT\nDTSTAMP:20220129T115020Z\nDTSTART;TZID=Europe/Madrid:20220130T180000\nDTEND;TZID=Europe/Madrid:20220130T200000\nSTATUS:CONFIRMED\nSUMMARY:Nude Life Drawing @fem.fatigue at Studio\nDESCRIPTION:Life Drawing Barcelona\nSunday\, January 30 at 6:00 PM\n\nDib\nORGANIZER;CN=Meetup Reminder:MAILTO:info@meetup.com\nCLASS:PUBLIC\nCREATED:20220119T120306Z\nGEO:41.40;2.17\nLOCATION:art club barcelona (bou de sant pere 8 bajos\, Barcelona\, Spain\nURL:https://www.meetup.com/Life-Drawing/events/283355921/\nSEQUENCE:2\nLAST-MODIFIED:20220119T120306Z\nUID:event_283355921@meetup.com\nEND:VEVENT\nEND:VCALENDAR`
