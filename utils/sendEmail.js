let nodemailer = require("nodemailer");


exports.sendEmailToUser=async (userEmail)=>{
    const sendMessageToSubscriber =(userEmail)=>{
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
          to:[userEmail,'alexei@platformable.com'],
          // to:['alexei@platformable.com','leon@platformable.com'],
          subject:"A new event has been submitted",
          text:`
Thank you for submitting your HIV Outreach Event Organizer Survey.

Click here to see the answers you have submitted. 

You have until the end of the today to make any changes.

In partnership with [Logo with link to Black Health]

      `
        }
      
        mailTrasporter.sendMail(details,(err)=>{
          
          if(err){
            console.log(err)
          } else {
            res.send("email sent")
            console.log("email sent")
          }
        })
      }

      sendMessageToSubscriber(userEmail)
}