const db = require("../dbConnect");

module.exports= {
getPrograms: async (req,res)=>{
    try {
        const allData = await db.query("select * from programs");
        const response = allData.rows;
        res.send(response);
      } catch (e) {
        res.send("an error ocurred");
      }
}
}