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
            userid ,
            eventdatecreated ,
            programid ,
            programname ,
            eventname ,
            eventdate ,
            eventstarttime ,
            eventfinishtime ,
            eventlocationtypeid ,
            eventlocationtypename ,
            healthareaoffocusid ,
            healthareaoffocusname ,
            eventtypeid ,
            eventtypename
        } = req.body;
  
    const text =
      `INSERT INTO events (
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
            eventtypeid ,
            eventTypeName
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`;
    const values = [
        userid ,
        eventdatecreated ,
        programid ,
        programname ,
        eventname ,
        eventdate ,
        eventstarttime ,
        eventfinishtime ,
        eventlocationtypeid ,
        eventlocationtypename ,
        healthareaoffocusid ,
        healthareaoffocusname ,
        eventtypeid ,
            eventtypename];
    // callback
    db.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
      }
    });
    }
}