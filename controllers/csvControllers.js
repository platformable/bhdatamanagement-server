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
        events.oeftargetaudienceforreport as targetAudience,
        events_output.nameGuestSpeakers,
        events_output.hivTesting,
        events_output.totalAttendees,
        events_output.hivTestedTotal,
        events_output.clusterFBOs,
        events_output.partnerOrganization1,
        events_output.partnerOrganization1Other,
        events_output.partnerOrganization2,
        events_output.eventQuestions,
        events_output.eventhighlights
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
                    data.borough=row.borough,
                    data.nameGuestSpeakers=row.nameguestspeakers
                    data.hivTesting=row.hivtesting?'Yes':'No'
                    data.eventName=row.eventname
                    data.onelineDescription=row.onelinedescription
                    data.typeofactivity=row.oefeventpresentationtopic || ""
                    data.month=new Date(row.eventdate).toLocaleString('default', { month: 'long' });
                    data.eventDate=row.eventdate
                    data.eventStartTime=row.eventstarttime
                    data.eventFinishTime=row.eventfinishtime
                    data.totalTime=((convertDurationtoSeconds(row.eventfinishtime)-convertDurationtoSeconds(row.eventstarttime)) / 3600).toFixed(2)
                    data.targetAudience=row.targetaudience || ""
                    // data.oefTargetAudienceForReport=row.oeftargetaudienceforreport || ""
                    data.totalAttendees=row.totalattendees
                    data.hivTestedTotal=row.hivtestedtotal
                    data.selftestKits=0
                    //data.collaborativeEvent=row?.clusterfbos ? row.clusterfbos?.join(", ") + row.partnerorganization1 !=='' && `AND ${row.partnerorganization1}` + row.partnerorganization2 !=='' && `AND ${row.partnerorganization2}`:""
                    data.collaborativeEvent=collabEvent(row)
                    data.notes=row.eventhighlights
                    // data.notes=`${row.eventquestions} 
                    // ${joinClusterFbos(row)} ${row.partnerorganization1!=='' && `, ${row.partnerorganization1}`} ${row.partnerorganization2!=='' && `, ${row.partnerorganization2}`} `
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
        events_output.eventQuestions,
        events_output.totalattendees 
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
                    data.targetAudience='All FBOs'
                    //data.oefTargetAudienceForReport=row.oeftargetaudienceforreport || ""
                    data.totalAttendees=row.totalattendees || ""
                    data.hivTestedTotal=""
                    data.selftestKits=0
                    data.collaborativeEvent='Yes'
                    // data.eventQuestions=row.eventquestions
                    data.notes=row.eventhighlights
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
        events.eventdescription,
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
        events_output.leastEngaged,
        events_output.organizerFeedback
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
                    data.targetAudienceTotal=""
                    data.targetAudience='All FBOs'
                    data.totalAttendees=row.totalattendees
                    data.notes=`${row.eventworkedbest} 
                    ${row.eventimprove} 
                    ${row.organizerFeedback}
                    `
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
    getSiteVisitsCsvData:async (req,res)=>{
        const text=`select
       eventDate,
       eventstarttime,
       eventfinishtime,
       fbo,
       submissionnotes
       fbochanges,
       fboimprovements,
       fboobservations,
       fbobeyondgrant,
       bestpractices
        from site_visits
        where submissionstatus='Complete'`
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
             
                    data.typeOfActivity='Site Visit'
                    data.activityLedBy='NBLCH'
                    data.facilitatorPresenter=row.createdbyname || " "
                    data.eventTitle='FBO Site Visit'
                    data.eventDescription='Annual Site Visit'
                    data.event='On-site'
                    data.presentationTopic='N/A'
                    data.activityMonth=new Date(row.eventdate).toLocaleString('default', { month: 'long' });
                    data.activityDate=row.eventdate
                    data.startTime=row.eventstarttime
                    data.endTime=row.eventfinishtime
                    data.totalTime=((convertDurationtoSeconds(row.eventfinishtime)-convertDurationtoSeconds(row.eventstarttime)) / 3600).toFixed(2)
                    data.targetAudienceTotal=1
                    data.targetAudience=row.fbo
                    data.totalAttendees='N/A'
                    data.notes=row.bestpractices
                  //   data.notes=`${row.fbochanges} 
                  //   ${row.fboimprovements} 
                  //  ${row.fboobservations}  
                  //  ${row.fbobeyondgrant}`
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
    getTechnicalAssistanceCsvData:async (req,res)=>{
        const text=`select 
        taCompleteBhStaff,
        taType,
        taDateSubmitted,
        taFbo,
        taNotesBhStaff
        from technical_assistance  where tastatus='Complete'`
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
                    data.typeOfActivity='Technical Assistance'
                    data.activityLedBy='NBLCH'
                    data.facilitatorPresenter=row.tacompletebhstaff || " "
                    data.eventTitle=row.tatype.join(', ')
                    data.eventDescription='N/A'
                    data.event='Remotely/Virtually'
                    data.presentationTopic='N/A'
                    data.activityMonth=new Date(row.tadatesubmitted).toLocaleString('default', { month: 'long' });
                    data.activityDate=row.tadatesubmitted
                    data.startTime=""
                    data.endTime=""
                    data.totalTime=""
                    data.targetAudienceTotal=row.tafbo.length
                    data.targetAudience=row.tafbo.join(', ')
                    data.totalAttendees=''
                    data.notes=row.tanotesbhstaff
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

    getYipSession1CsvData:async (req,res)=>{
      const text=`select
      surveyName,
      surveyCreated,
      eventId,
      participantGrade,
      participantGradeOther,
      participantAge,
      participantZipCode,
      participantBorough,
      raceId,
      participantRace,
      participantRaceOther,
      ethnicityId,
      participantEthnicity,
      participantEthnicityOther,
      orientationId,
      participantOrientation,
      participantOrientationOther,
      genderId,
      participantGender,
      participantGenderOther,
      satisfiedEventActivities,
      recommendEvent,
      informationUseful,
      presenterExplainWell,
      thinkDifferently,
      canApply,
      workshopDoDifferently,
      workshopShouldChange,
      participantSuggestions,
      consentCanBeTakenAway,
      participantBodyLanguageConsent,
      partnerCheckPhoneEmail,
      preparationHelpsGoals,
      lowEnergySocialMediaHelpful,
      pubertyDifferentExperiences,
      eatingHabitsEmotions,
      stairsInsteadElevator,
      peopleMentallyIllViolent,
      selfCareAwareness,
      mentalIllnessCausedBy,
      mentalHealthMeaning,
      managingHealthyRelationships,
      confidentLookingAfterMyMentalHealth,
      eventdate
      from participant_survey_outputs       
      where surveyname='yip-participant-session1'`
      try {
          const allData = await db.query(text);
          const response = allData.rows;

          if(response.length>0){
            res.send(response);
          } else {
            res.send([{data:'no data'}])
          }
          
        } catch (e) {
          res.send("an error ocurred");
          console.log("error",e)
        }
  },
  getYipSession2CsvData:async (req,res)=>{
    const text=`select
    surveyName,
surveyCreated,
eventId,
participantGrade,
participantGradeOther,
participantAge,
participantZipCode,
participantBorough,
raceId,
participantRace,
participantRaceOther,
ethnicityId,
participantEthnicity,
participantEthnicityOther,
orientationId,
participantOrientation,
participantOrientationOther,
genderId,
participantGender,
participantGenderOther,
satisfiedEventActivities,
recommendEvent,
informationUseful,
presenterExplainWell,
thinkDifferently,
canApply,
workshopDoDifferently,
workshopShouldChange,
participantSuggestions,
smartGoalAwareness,
phoneActiveListening,
participantListening,
goodCommunicationImportantOnlyPublicSpeakers,
poorCommunicationCanRuinRelationships,
cyberBullyingOnlyNegativeSocialMedia,
deleteFromInternetGoneForever,
confidentCommunicatingEffectively,
eventdate
from participant_survey_outputs
where surveyname='yip-participant-session2'`
    try {
        const allData = await db.query(text);
        const response = allData.rows;

        if(response.length>0){
          res.send(response);
        } else {
          res.send([{data:'no data'}])
        }
        
      } catch (e) {
        res.send("an error ocurred");
        console.log("error",e)
      }
},

getYipSession3CsvData:async (req,res)=>{
  const text=`select
  surveyName,
surveyCreated,
eventId,
participantGrade,
participantGradeOther,
participantAge,
participantZipCode,
participantBorough,
raceId,
participantRace,
participantRaceOther,
ethnicityId,
participantEthnicity,
participantEthnicityOther,
orientationId,
participantOrientation,
participantOrientationOther,
genderId,
participantGender,
participantGenderOther,
satisfiedEventActivities,
recommendEvent,
informationUseful,
presenterExplainWell,
thinkDifferently,
canApply,
workshopDoDifferently,
workshopShouldChange,
participantSuggestions,
awareOptionsEducationCareer,
preparationHelpsGoals,
oneProvenPathToSuccess,
shouldKnowFutureCareerInHighSchool,
hbcuMeaningKnowledge,
mentorBenefits,
confidentFindingMentor,
hasMentor,
confidentJobAndCareerChoices,
eventdate
from participant_survey_outputs
where surveyname='yip-participant-session3'`
  try {
      const allData = await db.query(text);
      const response = allData.rows;

      if(response.length>0){
        res.send(response);
      } else {
        res.send([{data:'no data'}])
      }
      
    } catch (e) {
      res.send("an error ocurred");
      console.log("error",e)
    }
},
getYipSession4CsvData:async (req,res)=>{
  const text=`select
  surveyName,
surveyCreated,
eventId,
participantGrade,
participantGradeOther,
participantAge,
participantZipCode,
participantBorough,
raceId,
participantRace,
participantRaceOther,
ethnicityId,
participantEthnicity,
participantEthnicityOther,
orientationId,
participantOrientation,
participantOrientationOther,
genderId,
participantGender,
participantGenderOther,
satisfiedEventActivities,
recommendEvent,
informationUseful,
presenterExplainWell,
thinkDifferently,
canApply,
workshopDoDifferently,
workshopShouldChange,
participantSuggestions,
participantHivKnowledge,
consentCanBeTakenAway,
stiInfectionsAgeRange,
knowHaveSti,
pep28DaysAfter,
condomWalletHandy,
emergencyContraceptionAfterSex,
confidentNegotiatingContraceptives,
confidentPreventingHivAndStis,
workshopsHelpful,
workshopsEnjoyed,
workshopsLearnedFrom,
workshopsRecommendToFriends,
workshopFavorite,
workshopLikelyTellFriend,
eventdate
from participant_survey_outputs
where surveyname='yip-participant-session4'`
  try {
      const allData = await db.query(text);
      const response = allData.rows;

      if(response.length>0){
        res.send(response);
      } else {
        res.send([{data:'no data'}])
      }
      
    } catch (e) {
      res.send("an error ocurred");
      console.log("error",e)
    }
},

getYipPreWorkshopCsvData:async (req,res)=>{
  const text=`select
  surveyName,
  surveyCreated,
  participantGrade,
  participantGradeOther,
  participantAge,
  participantZipCode,
  participantBorough,
  raceId,
  participantRaceOther,
  participantRace,
  ethnicityId,
  participantEthnicity,
  participantEthnicityOther,
  orientationId,
  participantOrientationOther,
  participantOrientation,
  genderId,
  participantGender,
  participantGenderOther,
  participantReferral,
  deliveryPartner,
  deliveryPartnerOther,
  participantReferralOther,
  consentCanBeTakenAway,
  participantBodyLanguageConsent,
  partnerCheckPhoneEmail,
  lowEnergySocialMediaHelpful,
  eatingHabitsEmotions,
  stairsInsteadElevator,
  pubertyDifferentExperiences,
  peopleMentallyIllViolent,
  selfCareAwareness,
  mentalIllnessCausedBy,
  smartGoalAwareness,
  phoneActiveListening,
  participantListening,
  goodCommunicationImportantOnlyPublicSpeakers,
  poorCommunicationCanRuinRelationships,
  cyberBullyingOnlyNegativeSocialMedia,
  deleteFromInternetGoneForever,
  awareOptionsEducationCareer,
  preparationHelpsGoals,
  oneProvenPathToSuccess,
  shouldKnowFutureCareerInHighSchool,
  hbcuMeaningKnowledge,
  confidentCondom,
  participantHivKnowledge,
  stiInfectionsAgeRange,
  knowHaveSti,
  pep28DaysAfter,
  condomWalletHandy,
  emergencyContraceptionAfterSex,
  managingHealthyRelationships,
  confidentCommunicatingEffectively,
  confidentLookingAfterMyMentalHealth,
  confidentNegotiatingContraceptives,
  confidentPreventingHivAndStis,
  confidentJobAndCareerChoices,
  participantSuggestions
from participant_survey_outputs
where surveyname='yip-pre-workshop'`
  try {
      const allData = await db.query(text);
      const response = allData.rows;

      if(response.length>0){
        res.send(response);
      } else {
        res.status(400).send({message:"There is no data", statusText:"FAIL"})
      }
      
    } catch (e) {
      res.send("an error ocurred");
      console.log("error",e)
    }
},

getYip6MonthsCsvData:async (req,res)=>{
  const text=`select
  surveyName,
surveyCreated,
participantGrade,
participantGradeOther,
participantAge,
participantZipCode,
participantBorough,
raceId,
participantRaceOther,
participantRace,
ethnicityId,
participantEthnicity,
participantEthnicityOther,
orientationId,
participantOrientationOther,
participantOrientation,
genderId,
participantGender,
participantGenderOther,
participantReferral,
deliveryPartner,
deliveryPartnerOther,
participantReferralOther,
consentCanBeTakenAway,
participantBodyLanguageConsent,
partnerCheckPhoneEmail,
lowEnergySocialMediaHelpful,
eatingHabitsEmotions,
stairsInsteadElevator,
pubertyDifferentExperiences,
peopleMentallyIllViolent,
selfCareAwareness,
mentalIllnessCausedBy,
smartGoalAwareness,
phoneActiveListening,
participantListening,
goodCommunicationImportantOnlyPublicSpeakers,
poorCommunicationCanRuinRelationships,
cyberBullyingOnlyNegativeSocialMedia,
deleteFromInternetGoneForever,
awareOptionsEducationCareer,
preparationHelpsGoals,
oneProvenPathToSuccess,
shouldKnowFutureCareerInHighSchool,
hbcuMeaningKnowledge,
confidentCondom,
participantHivKnowledge,
stiInfectionsAgeRange,
knowHaveSti,
pep28DaysAfter,
condomWalletHandy,
emergencyContraceptionAfterSex,
managingHealthyRelationships,
confidentCommunicatingEffectively,
confidentLookingAfterMyMentalHealth,
confidentNegotiatingContraceptives,
confidentPreventingHivAndStis,
confidentJobAndCareerChoices,
participantSuggestions
from participant_survey_outputs
where surveyname='yip-6month-follow-up'`
  try {
      const allData = await db.query(text);
      const response = allData.rows;

      if(response.length>0){
        res.send(response);
      } else {
        res.status(400).send({message:"There is no data", statusText:"FAIL"})
      }
      
    } catch (e) {
      res.send("an error ocurred");
      console.log("error",e)
    }
},

getPostEventCsvData:async (req,res)=>{
  const text=`select
  events.programId,
  events.programName,
  events.id as eventid,
  events.surveyName,
  events.createdByName,
  events.createdbyLastName,
  events.surveyCreated,
  events.surveyModified,
  events.eventName,
  events.eventDate,
  events.eventStartTime,
  events.eventFinishTime,
  events_output.externalFacilitatorName,
  events_output.mainRoles,
  events_output.mainRolesOther,
  events_output.participantRegistrationForm,
  events_output.eventStartedOnTime,
  events_output.eventFinishedOnTime,
  events_output.participantGreeted,
  events_output.resourcesAvailable,
  events_output.photoRelease,
  events_output.handSanitizerAvailable,
  events.healthAreaOfFocusId,
  events_output.reminderSafeSpace,
  events_output.healthAreaOfFocusName,
  events_output.reminderPostEvaluationSurvey,
  events_output.eventChecklistOther,
  events_output.eventChecklistOtherText,
  events_output.totalAttendees,
  events_output.eventOrganization,
  events_output.eventResponsive,
  events_output.engaged,
  events_output.topicsFollowup,
  events_output.leastEngaged,
  events_output.improveEngagement,
  events_output.eventChallenges,
  events_output.eventQuestions,
  events_output.organizerFeedback,
  events.folderurl,
  events.folderpath
  from events
  join events_output
  on events.id=events_output.eventid
  where events.surveyname='yip-register' and events_output.surveyname = 'yip-post-event'`
  try {
      const allData = await db.query(text);
      const response = allData.rows;

      if(response.length>0){
        res.send(response);
      } else {
        res.status(400).send({message:"There is no data", statusText:"FAIL"})
      }
      
    } catch (e) {
      res.send("an error ocurred");
      console.log("error",e)
    }
},

}






