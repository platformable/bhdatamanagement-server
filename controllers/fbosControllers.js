const db = require("../dbConnect");

module.exports = {
  getFbos: async (req, res) => {
    try {
      const allData = await db.query("select * from fbos");
      const response = allData.rows;
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  getFboById: async (req, res) => {
    let {id} = req.params
    console.log("id",id)
    try {
      const allData = await db.query(`select * from fbos where numberfbo=${id}`);
      const response = allData.rows;
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  createFbo: async (req, res) => {
    let {
      nameFBO,
      addressFBO,
      address2FBO,
      boroughFBO,
      zipcodeFBO,
      nameReligiousLeader,
      positionReligiousLeader,
      emailReligionsLeader,
      phoneReligionsLeader,
      nameKeyContact,
      phoneKeyContact,
      emailKeyContact,
      nameAlternateContact,
      phoneAlternateContact,
      emailAlternateContact,
      fboDropboxFolder,
      fboNotes,
      fboActive,
    } = req.body;

    const query = {
      text: `INSERT INTO fbos (nameFBO,
        addressFBO,
        address2FBO,
        boroughFBO,
        zipcodeFBO,	
        nameReligiousLeader,	
        positionReligiousLeader,	
        emailReligionsLeader,	
        phoneReligionsLeader,	
        nameKeyContact ,	
        phoneKeyContact ,	
        emailKeyContact ,	
        nameAlternateContact ,	
        phoneAlternateContact ,	
        emailAlternateContact ,	
        fboDropboxFolder ,	
        fboNotes ,	
        fboActive) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, $18) RETURNING *`,
      values: [
        nameFBO,
        addressFBO,
        address2FBO,
        boroughFBO,
        zipcodeFBO,
        nameReligiousLeader,
        emailReligionsLeader,
        positionReligiousLeader,
        phoneReligionsLeader,
        nameKeyContact,
        phoneKeyContact,
        emailKeyContact,
        nameAlternateContact,
        phoneAlternateContact,
        emailAlternateContact,
        fboDropboxFolder,
        fboNotes,
        fboActive,
      ],
    };
    // promise
    db.query(query)
      .then((data) => res.status(200).json(data.rows[0]))
      .then((response) => console.log("fbos created"))
      .catch((e) => console.error(e.stack));
  },
  updateFbo: async (req, res) => {
    let {
      numberfbo,
      nameFBO,
      addressFBO,
      boroughFBO,
      zipcodeFBO,
      nameReligiousLeader,
      emailReligionsLeader,
      phoneReligionsLeader,
      nameKeyContact,
      phoneKeyContact,
      emailKeyContact,
      nameAlternateContact,
      phoneAlternateContact,
      emailAlternateContact,
      fboDropboxFolder,
      fboNotes,
      linkedAccounts,
      fboActive,
    } = req.body;

    try {
      const query = await {
        name: "update-fbo",
        text: `update fbos set 
      nameFBO=$1
      addressFBO=$2
      boroughFBO=$3
      zipcodeFBO=$4	
      nameReligiousLeader=$5	
      emailReligionsLeader=$6	
      phoneReligionsLeader=$7	
      nameKeyContact=$8,	
      phoneKeyContact=$9 ,	
      emailKeyContact=$10 ,	
      nameAlternateContact=$11 ,	
      phoneAlternateContact=$12 ,	
      emailAlternateContact=$13 ,	
      fboDropboxFolder=$14 ,	
      fboNotes=$15 ,	
      linkedAccounts=$16 ,	
      fboActive=$17 where numberfbo=$1`,
        values: [
          numberfbo,
          nameFBO,
          addressFBO,
          boroughFBO,
          zipcodeFBO,
          nameReligiousLeader,
          emailReligionsLeader,
          phoneReligionsLeader,
          nameKeyContact,
          phoneKeyContact,
          emailKeyContact,
          nameAlternateContact,
          phoneAlternateContact,
          emailAlternateContact,
          fboDropboxFolder,
          fboNotes,
          linkedAccounts,
          fboActive,
        ],
      };
      db.query(query).then((response) =>
        res
          .json({
            data: response.rowCount,
            status: 200,
          })
          .then((response) => console.log("fbo updated"))
      );
      //.catch((e) => res.send(e.stack));
    } catch (error) {
      res.json("an error ocurred");
      console.log("error message:", error);
    }
  },
  deleteFbo: async (req, res) => {
    const { numberfbo } = req.body;
    console.log("users req.body",req.body)
    const query = {
      text: "DELETE from fbos where numberfbo=$1",
      values: [numberfbo],
    };
    // promise
    db.query(query)
      .then((data) => {
        if ((data.rowCount = 1)) {
          res.send({
            status: "OK",
            response: "Fbo deleted",
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
