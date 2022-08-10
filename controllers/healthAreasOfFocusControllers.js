const db = require("../dbConnect");

module.exports= {
    gethealthAreasOfFocus: async (req,res)=>{
    try {
        const allData = await db.query("select * from health_areas_of_focus");
        const response = allData.rows;
        res.send(response);
      } catch (e) {
        res.send("an error ocurred");
      }
}
}