exports.sendEmailToUser=async (userEmail)=>{
    const sendMessageToSubscriber =(eventName,eventDate,workArea,eventDescription,locationAddress,onlineInPersonEventType,eventStartTime,eventFinishTime)=>{
        let mailTrasporter = nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:process.env.NODEMAILEREMAIL,
            pass:process.env.EMAILPASSWORD
          }
        })
      
        function convertDate(date, time) {
          const dateParts = date.split("T")[0]
          const dateString = dateParts.split("-").join("")
          const timeString = time.split(":").join("") 
      
          return dateString + "T" + timeString+'00'
        }
      const today= new Date()
      const newDate = today.toISOString()
        const created = newDate.replace("-","").replace("-","").replace(":","").replace(":","").replace(".","")
      
        const reverse = eventDate.split('-')
        const reversedDate=reverse[1]+'/'+reverse[2]+'/'+reverse[0]
      
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
}