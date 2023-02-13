const db = require("../dbConnect");

module.exports = {
  getOefFboParticipantEventsOutput: async (req, res) => {
        const query = `select participant_survey_outputs.id,
        participant_survey_outputs.surveyname,
        participant_survey_outputs.programId,
        participant_survey_outputs.programName,
        participant_survey_outputs.eventDate,
        participant_survey_outputs.deliveryPartner,
        participant_survey_outputs.participantZipCode,
        participant_survey_outputs.ageId,
        participant_survey_outputs.participantAgeRange,
        participant_survey_outputs.raceId,
        participant_survey_outputs.participantRace,
        participant_survey_outputs.participantRaceOther,
        participant_survey_outputs.ethnicityId,
        participant_survey_outputs.participantEthnicity,
        participant_survey_outputs.participantEthnicityOther,
        participant_survey_outputs.genderId,
        participant_survey_outputs.participantGender,
        participant_survey_outputs.orientationId,
        participant_survey_outputs.participantOrientation,
        participant_survey_outputs.participantOrientationOther,
        participant_survey_outputs.participantReferral,
        participant_survey_outputs.participantReferralOther,
        participant_survey_outputs.participantSuggestions from participant_survey_outputs where surveyname = 'oef-participant'`
    try {
      const allData = await db.query(query);
      const response = allData.rows;
      if(response.length>0){
        res.status(200).send(response);
      } else {
        res.status(200).send({message:'There is no data'})
      }
      
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  getOefCbtParticipantEventsOutput: async (req, res) => {
    const query = `select participant_survey_outputs.eventId,
    participant_survey_outputs.surveyName,
    participant_survey_outputs.programId,
    participant_survey_outputs.programName,
    participant_survey_outputs.eventName,
    participant_survey_outputs.eventDate,
    participant_survey_outputs.deliveryPartner,
    participant_survey_outputs.fboPosition,
    participant_survey_outputs.genderId,
    participant_survey_outputs.participantGender,
    participant_survey_outputs.participantGenderOther,
    participant_survey_outputs.ageId,
    participant_survey_outputs.participantAgeRange,
    participant_survey_outputs.raceId,
    participant_survey_outputs.participantRace,
    participant_survey_outputs.participantRaceOther,
    participant_survey_outputs.ethnicityId,
    participant_survey_outputs.participantEthnicity,
    participant_survey_outputs.participantEthnicityOther,
    participant_survey_outputs.informationUseful,
    participant_survey_outputs.canApply,
    participant_survey_outputs.presenterExplainWell,
    participant_survey_outputs.understoodTopics,
    participant_survey_outputs.cbtChallenges,
    participant_survey_outputs.cbtDealChallenges,
    participant_survey_outputs.participantTools from participant_survey_outputs where participant_survey_outputs.surveyname='cbt-participant' order by participant_survey_outputs.eventdate asc`
try {
  const allData = await db.query(query);
  const response = allData.rows;
  if(response.length>0){
    res.status(200).send(response);
  } else {
    res.status(200).send({message:'There is no data'})
  }
  
} catch (e) {
  res.send("an error ocurred");
}
},
 
};
