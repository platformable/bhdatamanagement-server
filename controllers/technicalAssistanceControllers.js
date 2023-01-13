const db = require("../dbConnect");

module.exports = {

  getAllTechnicalAssitance:async(req,res)=>{

try {
  const allData = await db.query("select * from technical_assistance");
  const response = allData.rows;
  res.send(response)
} catch (e) {
  res.send("an error ocurred");
  console.log("an error ocurrer on technical assistance get all ta")
}

  },

  getTechnicalAssitanceById:async(req,res)=>{
let {id}=req.params
    try {
      const allData = await db.query(`select * from technical_assistance where id=${id}`);
      const response = allData.rows;
      res.send(response)
    } catch (e) {
      res.send("an error ocurred");
      console.log("an error ocurrer on technical assistance get all ta")
    }
    
      },
  createTechnicallAssistance: async (req, res) => {
    let {
        taType,
        taTypeOther,
        taReason,
        taContactName,
        taEmail,
        taPhone,
        taFbo,
        taFboOther,
        taDateSubmitted,
        taStatus,
        taStatusCompleteDate,
        taCompleteBhStaff,
        taNotesBhStaff,
        programId,
        programName,
    } = req.body;

  console.log("req.body",req.body)


    const query = {
      text: `INSERT INTO technical_assistance (
        taType,
        taTypeOther,
        taReason,
        taContactName,
        taEmail,
        taPhone,
        taFbo,
        taFboOther,
        taDateSubmitted,
        taStatus,
        taStatusCompleteDate,
        taCompleteBhStaff,
        taNotesBhStaff,
        programId,
        programName) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      values: [
        taType,
        taTypeOther,
        taReason,
        taContactName,
        taEmail,
        taPhone,
        taFbo,
        taFboOther,
        taDateSubmitted,
        taStatus='Submitted',
        taStatusCompleteDate,
        taCompleteBhStaff,
        taNotesBhStaff,
        programId,
        programName
      ],
    };
    // promise
    db.query(query)
      .then((data) => res.status(200).send({message:"Technical assistance created successfuly", statusText:'OK'}))
      .then((response) => console.log("Technical asssistance created"))
      .catch((e) => console.error(e.stack))
  },
  updateTechnicalAssistance: async (req, res) => {
    let {
        taType,
        taTypeOther,
        taReason,
        taContactName,
        taEmail,
        taPhone,
        taFbo,
        taFboOther,
        taDateSubmitted,
        taStatus,
        taStatusCompleteDate,
        taCompleteBhStaff,
        taNotesBhStaff,
        programId,
        programName,
        id
    } = req.body;

    try {
      const query = await {
        name: "update-TA",
        text: `update technical_assistance set 
        taType=$1,
        taTypeOther=$2,
        taReason=$3,
        taContactName=$4,
        taEmail=$5,
        taPhone=$6,
        taFbo=$7,
        taFboOther=$8,
        taDateSubmitted=$9,
        taStatus=$10,
        taStatusCompleteDate=$11,
        taCompleteBhStaff=$12,
        taNotesBhStaff=$13,
        programId=$14,
        programName=$15 where id=$16`,
        values: [
          taType,
          taTypeOther,
          taReason,
          taContactName,
          taEmail,
          taPhone,
          taFbo,
          taFboOther,
          taDateSubmitted,
          taStatus,
          taStatus==='Complete'?taStatusCompleteDate===new Date():null,
          taCompleteBhStaff,
          taNotesBhStaff,
          programId,
          programName,
          id
        ],
      };
      db.query(query).then((response) =>
      res.status(200).send({
        data: response.rowCount,
        status: 200,
        statusText:'OK'
      })
      ).then((response) => console.log("TA updated"))
      //.catch((e) => res.send(e.stack));
    } catch (error) {
      res.json("an error ocurred");
      console.log("error message:", error);
    }
  },
  deleteTechnicalAssistance: async (req, res) => {
    const { id } = req.body;
    console.log("users req.body",req.body)
    const query = {
      text: "DELETE from technical_assistance where id=$1",
      values: [id],
    };
    // promise
    db.query(query)
      .then((data) => {
        if ((data.rowCount = 1)) {
          res.send({
            status: "OK",
            response: "TA deleted",
          });
        } else {
          res.send({
            status: "FAIL",
            response: "An error ocurred",
          });
        }
      })
      .catch((e) => console.error(e.stack));
  },
};
