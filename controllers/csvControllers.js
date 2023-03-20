const db = require("../dbConnect");

module.exports = {
    getQuarterlyReportSubcon:async (req,res)=>{
        const text=`select events.eventName,
        events.onelineDescription,
        events.oefEventPresentationTopic,
        events.eventDate,
        events.eventStartTime,
        events.eventFinishTime,
        events.borough,
        events.surveyname,
        events_output.deliveryPartner,
        events_output.nameGuestSpeakers,
        events_output.hivTesting,
        events_output.totalAttendees,
        events_output.hivTestedTotal,
        events_output.clusterFBOs,
        events_output.partnerOrganization1,
        events_output.partnerOrganization1Other,
        events_output.partnerOrganization2,
        events_output.eventQuestions
        from events
        inner join events_output on  events.id =events_output.eventid
        where events.surveyname='oef-fbo-outreach'`
        try {
            const allData = await db.query(text);
            const response = allData.rows;
        
            
            if(response.length>0){
                const newData = []
           
                response.forEach((row,index)=>{
                    let data={}
                    const joinClusterFbos=(row)=>{return row.clusterfbos.join(', ')}
                    function convertDurationtoSeconds(duration){
                        const [hours, minutes, seconds] = duration.split(':');
                        return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
                    };

                    const collabEvent=(row)=>{
                        if(row.clusterfbos ==='' || row.partnerorganization1==='' || row.partnerorganization2 === ''){
                            return 'No'
                        } else {
                            return 'Yes'
                        }
                    }
                    data.deliveryPartner=row.deliverypartner
                    data.borough=row.borough
                    data.nameGuestSpeakers=row.nameguestspeakers
                    data.hivTesting=row.hivtesting?'Yes':'No'
                    data.eventName=row.eventname
                    data.onelineDescription=row.onelinedescription
                    data.oefEventPresentationTopic=row.oefeventpresentationtopic
                    data.month=new Date(row.eventdate).toLocaleString('default', { month: 'long' });
                    data.eventDate=row.eventdate
                    data.eventStartTime=row.eventstarttime
                    data.eventFinishTime=row.eventfinishtime
                    data.totalTime=((convertDurationtoSeconds(row.eventfinishtime)-convertDurationtoSeconds(row.eventstarttime)) / 3600).toFixed(2) 
                    data.adrienne="Addrienne"
                    data.totalAttendees=row.totalattendees
                    data.hivTestedTotal=row.hivtestedtotal
                    data.selftestKits=0
                    //data.collaborativeEvent=row?.clusterfbos ? row.clusterfbos?.join(", ") + row.partnerorganization1 !=='' && `AND ${row.partnerorganization1}` + row.partnerorganization2 !=='' && `AND ${row.partnerorganization2}`:""
                    data.collaborativeEvent=collabEvent(row)
                    data.notes=`HIV discussion points: ${row.eventquestions} Collaborated with: ${joinClusterFbos(row)} ${row.partnerorganization1!=='' && `AND ${row.partnerorganization1}`} ${row.partnerorganization2!=='' && `AND ${row.partnerorganization2}`} `
                    newData.push(data)   
              })  
               
              res.send(newData);
            } else {
              res.status(400).send({message:"There is no data", statusText:"FAIL"})
            }
            
          } catch (e) {
            res.send("an error ocurred");
            console.log("error",e)
          }
    },
    getCabCsvData:async (req,res)=>{
        const text=`select
        events.eventname,
        events.onelineDescription,
        events.eventDate,
        events.eventStartTime,
        events.eventFinishTime,
        events_output.deliveryPartner,
        events_output.cluster,
        events_output.nameGuestSpeakers,
        events_output.eventHighlights,
        events_output.eventQuestions
        from events
        inner join events_output on  events.id =events_output.eventid
        where events.surveyname='oef-cab'`
        try {
            const allData = await db.query(text);
            const response = allData.rows;
        
            
            if(response.length>0){
                const newData = []
           
                response.forEach((row,index)=>{
                    let data={}
                   
                    function convertDurationtoSeconds(duration){
                        const [hours, minutes, seconds] = duration.split(':');
                        return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
                    };

                    const collabEvent=(row)=>{
                        if(row.clusterfbos ==='' || row.partnerorganization1==='' || row.partnerorganization2 === ''){
                            return 'No'
                        } else {
                            return 'Yes'
                        }
                    }
                    data.deliveryPartner=row.deliverypartner
                    data.cluster=row.cluster
                    data.nameGuestSpeakers=row.nameguestspeakers
                    data.hivTesting='No'
                    data.eventQuestions='How HIV was discussed: '  + row.eventquestions
                    data.eventName=row.eventname
                    data.onelineDescription=`${row.cluster} Quarterly CAB. ${row.eventhighlights}`
                    data.month=new Date(row.eventdate).toLocaleString('default', { month: 'long' });
                    data.eventDate=row.eventdate
                    data.eventStartTime=row.eventstarttime
                    data.eventFinishTime=row.eventfinishtime
                    data.totalTime=((convertDurationtoSeconds(row.eventfinishtime)-convertDurationtoSeconds(row.eventstarttime)) / 3600).toFixed(2) 
                    data.targetAudience='All FBOs'
                    data.totalAttendees=row.totalattendees
                    data.hivTestedTotal=""
                    data.selftestKits=""
                    data.collaborativeEvent='Yes'
                    newData.push(data)   
              })  
               
              res.send(newData);
            } else {
              res.status(400).send({message:"There is no data", statusText:"FAIL"})
            }
            
          } catch (e) {
            res.send("an error ocurred");
            console.log("error",e)
          }
    }
}