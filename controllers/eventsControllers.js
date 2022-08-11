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
    createEvent: async (req,res)=>{
        const {
            userID ,
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
            eventTypeName];

            const allData = await db.query(text,values);
            const response = allData.rows;
            res.status(200).json({"message":"Event saved successfully", "statusText":"OK"});

        } catch(e){
            res.status(400).json({"message":"an error ocurred, please try again", "statusText":"FAIL"})
        }

    
   /*  // callback
    db.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
      }
    }); */
    }
}