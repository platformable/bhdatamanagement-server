const db = require("../dbConnect");

module.exports= {
  getEventLocationType: async (req,res)=>{
    try {
        const allData = await db.query("select * from event_location_type");
        const response = allData.rows;
        res.send(response);
      } catch (e) {
        res.send("an error ocurred");
      }
}
}