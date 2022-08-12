const db = require("../dbConnect");


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
            userID ,
            eventDateCreated ,
            programID,
            programName ,
            eventName ,
            eventDate ,
            eventStartTime ,
            eventFinishTime ,
            eventLocationTypeID=Number(eventLocationTypeID) ,
            eventLocationTypeName ,
            healthAreaOfFocusID=Number(eventLocationTypeID),
            healthAreaOfFocusName ,
            eventTypeID=Number(eventTypeID),
            eventTypeName
        } = req.body;

        try {
            const text =
      `INSERT INTO events (
            userID,
            eventDateCreated ,
            programID ,
            programName ,
            eventName ,
            eventDate ,
            eventStartTime ,
            eventFinishTime ,
            eventLocationTypeID ,
            eventLocationTypeName ,
            healthAreaOfFocusID ,
            healthAreaOfFocusName ,
            eventTypeID ,
            eventTypeName
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`;
    const values = [
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
        eventTypeName];

            const allData = await db.query(text,values);
            const response = allData.rows;
            res.status(200).send({"message":"Event saved successfully",'statusText':'OK'});

        } catch(e){
            console.log("error",e)
            res.status(400).json({"message":"an error ocurred, please try again", "statusText":"FAIL"})
        }
    },
    updateEvent: async (req, res) => {
        let {
            eventid,userID ,
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
            name: "update-user",
            text: `update events set 
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
        eventTypeName where id=$1`,
            values: [eventid,userID ,
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
                eventTypeName],
          };
          db
            .query(query)
            .then((response) =>{
              console.log(response)
              res.json({
                data: response.rowCount,
                status: 200,
              })
            }
            )
          
        } catch (error) {
          res.send(e.stack)
          console.log("error message:", error);
        }
      },
}