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
        events.deliveryPartner,
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
        where events.surveyname='oef-fbo-outreach' and events.submissionstatus = 'Complete'`
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
                    data.oefEventPresentationTopic=row.oefeventpresentationtopic || ""
                    data.month=new Date(row.eventdate).toLocaleString('default', { month: 'long' });
                    data.eventDate=row.eventdate
                    data.eventStartTime=row.eventstarttime
                    data.eventFinishTime=row.eventfinishtime
                    data.totalTime=((convertDurationtoSeconds(row.eventfinishtime)-convertDurationtoSeconds(row.eventstarttime)) / 3600).toFixed(2) 
                    data.oefTargetAudienceForReport=row.oeftargetaudienceforreport 
                    data.totalAttendees=row.totalattendees
                    data.hivTestedTotal=row.hivtestedtotal
                    data.selftestKits=0
                    //data.collaborativeEvent=row?.clusterfbos ? row.clusterfbos?.join(", ") + row.partnerorganization1 !=='' && `AND ${row.partnerorganization1}` + row.partnerorganization2 !=='' && `AND ${row.partnerorganization2}`:""
                    data.collaborativeEvent=collabEvent(row)
                    data.notes=`HIV discussion points: ${row.eventquestions} Collaborated with: ${joinClusterFbos(row)} ${row.partnerorganization1!=='' && `, ${row.partnerorganization1}`} ${row.partnerorganization2!=='' && `, ${row.partnerorganization2}`} `
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
        events.oefTargetAudienceForReport,
        events_output.deliveryPartner,
        events_output.cluster,
        events_output.nameGuestSpeakers,
        events_output.eventHighlights,
        events_output.eventQuestions
        from events
        inner join events_output on  events.id =events_output.eventid
        where events.surveyname='oef-cab' and events.submissionstatus = 'Complete'`
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
                    data.eventName=row.eventname
                    data.onelineDescription=`${row.cluster} Quarterly CAB. ${row.eventhighlights}`
                    data.typeOfactivity=""
                    data.month=new Date(row.eventdate).toLocaleString('default', { month: 'long' });
                    data.eventDate=row.eventdate
                    data.eventStartTime=row.eventstarttime
                    data.eventFinishTime=row.eventfinishtime
                    data.totalTime=((convertDurationtoSeconds(row.eventfinishtime)-convertDurationtoSeconds(row.eventstarttime)) / 3600).toFixed(2)
                    data.oefTargetAudienceForReport=row.oeftargetaudienceforreport || ""
                    data.targetAudience='All FBOs'
                    data.totalAttendees=row.totalattendees
                    data.hivTestedTotal=""
                    data.selftestKits=0
                    data.collaborativeEvent='Yes'
                    data.eventQuestions='How HIV was discussed: '  + row.eventquestions
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
    getCbtCsvData:async (req,res)=>{
        const text=`select
        events.createdByName,
        events.eventName,
        events.eventDate,
        events.eventStartTime,
        events.eventFinishTime,
        events_output.totalAttendees,
        events_output.eventOrganization,
        events_output.eventWorkedBest,
        events_output.eventImprove,
        events_output.eventDelivery,
        events_output.engaged,
        events_output.eventResponsive,
        events_output.topicsFollowup,
        events_output.leastEngaged
        from events
        inner join events_output on  events.id =events_output.eventid
        where events_output.surveyname='bh-cbt-post-event' and events.surveyname='bh-cbt-register'`
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

    
                    data.typeOfActivity='Capacity Building Training'
                    data.activityLedBy='NBLCH'
                    data.facilitatorPresenter=row.createdbyname
                    data.eventTitle=row.eventname
                    data.eventDescription='N/A'
                    data.event='Remotely/Virtually'
                    data.presentationTopic='Educational Topics'
                    data.activityMonth=new Date(row.eventdate).toLocaleString('default', { month: 'long' });
                    data.activityDate=row.eventdate
                    data.startTime=row.eventstarttime
                    data.endTime=row.eventfinishtime
                    data.totalTime=((convertDurationtoSeconds(row.eventfinishtime)-convertDurationtoSeconds(row.eventstarttime)) / 3600).toFixed(2)
                    data.targetAudience=""
                    data.totalAttendees=row.totalattendees
                    data.notes=`How satisfied were you with how the event was facilitated/delivered? ${row.eventorganization} What do you think worked best with how the workshop was organized today?
                    ${row.eventworkedbest} How satisfied were you with how the event was facilitated/delivered? ${row.eventdelivery} How responsive and engaged do you think participants were? ${row.engaged}
                    What do you think was the activity or discussion topic where the participants were most engaged? ${row.eventresponsive}
                    Were there any topics or discussions that you would like to followup on or prepare additional resources for in future? ${row.topicsfollowup}
                    What do you think was the activity or discussion topic that participants were least engaged? ${row.leastengaged}`
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