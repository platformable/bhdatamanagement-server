const db = require("../dbConnect");

module.exports= {
    getFbos: async (req,res)=>{
    try {
        const allData = await db.query("select * from fbos");
        const response = allData.rows;
        res.send(response);
      } catch (e) {
        res.send("an error ocurred");
      }
}
}