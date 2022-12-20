const db = require("../dbConnect");

module.exports = {
  getUsers: async (req, res) => {
    try {
      const allData = await db.query("select * from users");
      const response = allData.rows;
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  getUserById:async(req, res) => {
    const {id} = req.params
    try {
      const data = await db.query("select * from users  where id = $1", [id]);
      
      if (data.rowCount < 1) {
        return res.status(404).send('User not found')
      }
      const response = data.rows[0];
      console.log(response)
      res.send(response);
    }catch(error) {
      return res.status(500).send('An error ocurred')
    }
  },
  createUser: async (req, res) => {
    const {userid, name, lastname, role, email, dateaccountactivated,isactive } = req.body;
  
    const text =
      "INSERT INTO users(userid,name,lastname,role,email,dateaccountactivated,isactive) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *";
    const values = [userid,name, lastname, role, email, dateaccountactivated,isactive];
    // callback
    db.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
      }
    });
  },
  delete: async (req, res) => {
    const { userid } = req.body;
    console.log("users req.body",req.body)
    const query = {
      text: "DELETE from users where userid=$1",
      values: [userid],
    };
    // promise
    db.query(query)
      .then((data) => {
        if ((data.rowCount = 1)) {
          res.send({
            status: "OK",
            response: "User deleted",
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
  updateLastLogin: async (req, res) => {
    const { datelastlogin, email } = req.body;

    try {
      const query = await {
        name: "update-last-login",
        text: `update users set datelastlogin=$1 where email=$2`,
        values: [datelastlogin, email],
      };
      db
        .query(query)
        .then((response) =>
          res.json({
            data: response.rowCount,
            status: 200,
          })
        )
        .catch((e) => res.send(e.stack));
    } catch (error) {
      res.json("an error ocurred");
      console.log("error message:", error);
    }
  },
  updateUser: async (req, res) => {
    let { name,lastname,role,email,isactive} = req.body;

 /*    if(useractivestatus==="true"){
      useractivestatus="Active"
    } else {
      useractivestatus="No Active"
    } */

    try {
      const query = await {
        name: "update-user",
        text: `update users set name=$1,lastname=$2,role=$3,email=$4 ,isactive =$5 where email=$6`,
        values: [name,lastname,role,email,isactive,email],
      };
      db
        .query(query)
        .then((response) =>
          res.json({
            data: response.rowCount,
            status: 200,
          })
        )
        //.catch((e) => res.send(e.stack));
    } catch (error) {
      res.json("an error ocurred");
      console.log("error message:", error);
    }
  },

};
