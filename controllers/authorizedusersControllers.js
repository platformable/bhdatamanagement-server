const db = require('../dbConnect')
let nodemailer = require("nodemailer");



const sendMessageToSubscriber =(name,email)=>{
  let mailTrasporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.NODEMAILEREMAIL,
      pass:process.env.EMAILPASSWORD
    }
  })

  let details = {
    from:'Black Health Data App',
    //to: clientHCWEmail,
    to:[email],
    subject:"Please complete your registration to BH Data app",
    text:`Hi ${name}

Melissa Baker at Black Health has created a new account for you so you can access the Black Health Data Management App.

The next step for you is to complete the registration by setting up your password. 

To do this, visit https://bh.platformable.com

Choose “Sign Up” in the input box and enter your email and choose a password. Then click Sign Up and this will complete your registration.

The app is currently being developed and your feedback is valuable to us! Please feel free to reply to this email address or email adrienne@platformable.com with any enquiries or suggestions.
`
  }

  mailTrasporter.sendMail(details,(err)=>{
    
    if(err){
      console.log(err)
    } else {
      console.log("email sent")
    }
  })
}

module.exports = {
    get : async (req,res)=>{
        try {
            const allData = await db.query('select * from authorizedUsers')
            const response = allData.rows 
              res.send(response)
            }
            catch (e) {
              console.log(e)
              res.send("an error ocurred")
            }
    },
    post: async (req,res)=>{
        let {name,lastname,role,email,isactive} = req.body

         if(isactive==="true"){
          isactive="Active"
        }
        if(isactive==="false"){
          isactive="No Active"
        }

        
        const dateaccountactivated = new Date()
        const query = {
          text: 'INSERT INTO authorizedusers (name,lastname,role,email,isactive,dateaccountactivated) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
          values: [name,lastname,role,email.toLowerCase(),isactive,dateaccountactivated],
        }
        // promise
        db
          .query(query)
          .then(data => res.status(200).json(data.rows[0]))
          .then(subscriber=>sendMessageToSubscriber(name,email))
          .catch(e => console.error(e.stack))
    },
    updateUser: async (req, res) => {
        let {id,name,lastname,role,email,isactive} = req.body;
    /*     if(isactive==="true"){
          isactive="Active"
        } else {
          isactive="No Active"
        } */
console.log("req.body",req.body)
        try {
          const query = await {
            text: `update authorizedusers set id=$1, name=$2, lastname=$3, role=$4, email=$5, isactive=$6 where id=$1`,
            values: [id,name,lastname,role,email,isactive],
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
    delete: async (req,res) =>{
        console.log("delete route")
        console.log("req.body:", req.body)
        const {email} = req.body
    
        const query = {
            text: 'DELETE from authorizedusers where email=$1',
            values: [email],
          }
          // promise
          db
            .query(query)
            .then(data => {
                if(data.rowCount=1){
                    res.send({
                        status:"OK",
                        response:"User deleted"
                    })
                } else {
                    res.send({
                        status:"FAIL",
                        response:"An error ocurred"
                    })
                }
            })
            .catch(e => console.error(e.stack))
    },
    updateUserActiveStatus: async(req,res)=>{
      let {isactive,email} = req.body
      console.log(req.body)
     
      try {
        const query = await {
          text: `update authorizedusers set isactive=$1,email=$2 where email=$2`,
          values: [isactive,email],
        };
        db
          .query(query)
          .then((response) =>{
            console.log(response)
            res.json({
              data: response.rowCount,
              status: 200,
            })}
          )
          .then(x=> console.log("success del update del isactive"))
      } catch (error) {
       res.send(error.stack)
        console.log("error message:", error);
      }
  
    }
}