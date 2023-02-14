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
getOefHivOutReach: async (req, res) => {
  const query = `select events.surveyName,
  events.programId,
  events.programName,
  events.eventName,
  events.eventDate,
  events.deliveryPartner,
  events.locationAddress,
  events.createdByName,
  events.createdbyLastName,
  events.oefEventEmail,
  events.eventZipCode,
  events.eventStartTime,
  events.eventFinishTime,
  events.onlineInPersonEventType,
  events.inPersonEventTypeId,
  events.inPersonEventTypeName,
  events.onlineEventTypeId,
  events.onlineEventTypeName,
  events.healthAreaOfFocusId,
  events.healthAreaOfFocusName,
  events.submissionStatus,
  events.submissionNotes,
  events.onelineDescription,
  events.oefEventPresentationTopic,
  events_output.eventId ,
  events_output.isClusterEvent,
  events_output.cluster,
  events_output.clusterFbos,
  events_output.nameGuestSpeakers,
  events_output.partnerOrganization1,
  events_output.partnerOrganization1Other,
  events_output.partnerOrganization2,
  events_output.nationalAwarenessDay,
  events_output.nationalAwarenessDayOther,
  events_output.targetAudience,
  events_output.targetAudienceOther,
  events_output.totalAttendees,
  events_output.hivLiterature,
  events_output.hepCLiterature,
  events_output.prepLiterature,
  events_output.saferSexKits,
  events_output.healthDisparitiesLiterature,
  events_output.bagsBoxesFood,
  events_output.masks,
  events_output.handSanitizers,
  events_output.covidLiterature,
  events_output.vaccineRelatedLiterature,
  events_output.totalTalkedHivPrepSaferSex,
  events_output.eventQuestions,
  events_output.eventHighlights,
  events_output.eventChallenges,
  events_output.capacityTrainingUseful,
  events_output.lessonsLearned,
  events_output.eventTestingDone,
  events_output.hivTesting,
  events_output.hivTestingAgency,
  events_output.hivTestedTotal,
  events_output.hivReactiveResults,
  events_output.prepReferrals,
  events_output.hivLinkedToCare,
  events_output.hivServicesReferredTo,
  events_output.hivFemale,
  events_output.hivMale,
  events_output.hivTransgenderFemale,
  events_output.hivTransgenderMale,
  events_output.hivGenderNonConforming,
  events_output.hivNonBinary,
  events_output.hivGenderNotSureQuestioning,
  events_output.hivOtherGenderIdentity,
  events_output.hivGenderDeclinedToAnswer,
  events_output.altAgeHiv13_18,
  events_output.altAgeHiv19_24,
  events_output.hiv25_29,
  events_output.hiv30_34,
  events_output.hiv35_39,
  events_output.hiv40_44,
  events_output.hiv45_49,
  events_output.hiv50_54,
  events_output.hiv55_59,
  events_output.hiv60_64,
  events_output.hiv65_69,
  events_output.hiv70,
  events_output.hivAgeDeclinedToAnswer,
  events_output.hivBlackOrAfricanAmerican,
  events_output.hivHispanic,
  events_output.hivAsian,
  events_output.hivAmericanIndianOrAlaskaNative,
  events_output.hivMiddleEasternOrNorthAfrican,
  events_output.hivNativeHawaiianOrOtherPacificIslander,
  events_output.hivWhite,
  events_output.hivSomeOtherRace,
  events_output.hivMoreThanOnerace,
  events_output.hivRaceDeclinedToAnswer,
  events_output.hivNotHispanic,
  events_output.hivMexicanMexicanAmericanOrChicano,
  events_output.hivPuertoRican,
  events_output.hivCuban,
  events_output.hivDominican,
  events_output.hivEcuadorian,
  events_output.hivOtherHispanic,
  events_output.hivEthnicityDeclinedToAnswer,
  events_output.hepCTesting,
  events_output.hepCTestingAgency,
  events_output.hepCTestedTotal,
  events_output.hepCReactiveResults,
  events_output.hepCLinkedToCare,
  events_output.hepCServicesReferredTo,
  events_output.hepCFemale,
  events_output.hepCMale,
  events_output.hepCTransgenderFemale,
  events_output.hepCTransgenderMale,
  events_output.hepCGenderNonConforming,
  events_output.hepCNonBinary,
  events_output.hepCOtherGenderIdentity,
  events_output.hepCGenderDeclinedToAnswer,
  events_output.altAgeHepC13_18,
  events_output.altAgeHepC19_24,
  events_output.hepC25_29,
  events_output.hepC30_34,
  events_output.hepC35_39,
  events_output.hepC40_44,
  events_output.hepC45_49,
  events_output.hepC50_54,
  events_output.hepC55_59,
  events_output.hepC60_64,
  events_output.hepC65_69,
  events_output.hepC70,
  events_output.hepCBlackOrAfricanAmerican,
  events_output.hepCHispanic,
  events_output.hepCAsian,
  events_output.hepCAmericanIndianOrAlaskaNative,
  events_output.hepCMiddleEasternOrNorthAfrican,
  events_output.hepCNativeHawaiianOrOtherPacificIslander,
  events_output.hepCWhite,
  events_output.hepCSomeOtherRace,
  events_output.hepCMoreThanOneRace,
  events_output.hepCRaceDeclinedToAnswer,
  events_output.hepCNotHispanic,
  events_output.hepCMexicanMexicanAmericanOrChicano,
  events_output.hepCPuertoRican,
  events_output.hepCCuban,
  events_output.hepCDominican,
  events_output.hepCEcuadorian,
  events_output.hepCOtherHispanic,
  events_output.hepCEthnicityDeclinedToAnswer,
  events_output.otherTesting,
  events_output.otherTestingType,
  events_output.otherTestedTotal
          from events
          join events_output on  events.id = events_output.eventid 
          where events.programname='OEF' and events.surveyname='oef-fbo-outreach' order by events.eventdate asc`
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
getOefCbtQuarterly: async (req, res) => {
  const query = `select
  participant_survey_outputs.programId,
  participant_survey_outputs.programName,
  participant_survey_outputs.surveyName,
  participant_survey_outputs.surveyCompleted,
  participant_survey_outputs.surveyCompleted as eventdate,
  participant_survey_outputs.deliveryPartner,
  participant_survey_outputs.fboPosition,
  participant_survey_outputs.participantCbtActions,
  participant_survey_outputs.participantHivKnowledge,
  participant_survey_outputs.participantPrepKnowledge,
  participant_survey_outputs.participantPrepResourceKnowledge,
  participant_survey_outputs.participantConsentKnowledge,
  participant_survey_outputs.participantStiInfectionKnowledge,
  participant_survey_outputs.participantPepUsageKnowledge,
  participant_survey_outputs.participantPrepUse,
  participant_survey_outputs.participantCreateSurvey,
  participant_survey_outputs.participantSurveyTool,
  participant_survey_outputs.participantSurveyGoal,
  participant_survey_outputs.participantDataCollecting,
  participant_survey_outputs.participantDataComfort,
  participant_survey_outputs.participantDataUse,
  participant_survey_outputs.participantDataUseOther,
  participant_survey_outputs.participantFboEngagement,
  participant_survey_outputs.participantFboImprove,
  participant_survey_outputs.participantFboFeedbackResponse,
  participant_survey_outputs.participantInfoUnderstandable,
  participant_survey_outputs.participantInfoAccessible,
  participant_survey_outputs.participantCabCreation,
  participant_survey_outputs.participantCabRecruitment,
  participant_survey_outputs.participantCabImpact,
  participant_survey_outputs.participantCabMembers,
  participant_survey_outputs.participantFboStrategy,
  participant_survey_outputs.participantTargetGroups,
  participant_survey_outputs.participantTargetGroupsOther,
  participant_survey_outputs.participantYouthMinistryCreation,
  participant_survey_outputs.participantYouthMinistryRecruitment,
  participant_survey_outputs.participantFboYouth,
  participant_survey_outputs.participantGrantsIdentify,
  participant_survey_outputs.participantGrantsApplied,
  participant_survey_outputs.participantGrantsProcess,
  participant_survey_outputs.participantGrantsMore,
  participant_survey_outputs.participantGrantsSuccess,
  participant_survey_outputs.participantGrantsWhySuccess,
  participant_survey_outputs.participantGrantsLearned,
  participant_survey_outputs.participantGrantsSuccessMore
  from participant_survey_outputs
  where participant_survey_outputs.surveyname='cbt-quarterly-evaluation'`
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
