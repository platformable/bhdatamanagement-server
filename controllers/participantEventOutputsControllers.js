const db = require("../dbConnect")

module.exports={
    getParticipantEventOutputs: async (req,res)=>{
        try {
            const allData = await db.query(`
            select events.id eventid, events.programid, events.programname,
            participant_survey_outputs.*
            from events
            join participant_survey_outputs on participant_survey_outputs.eventid = events.id
            where events.programname='NYS CMP'`);
            const response = allData.rows;
            res.send(response);
          } catch (e) {
            res.send("an error ocurred");
          }
    },
    getParticipantEventOutputsById:async (req,res)=>{
        let { id } = await req.params;

        const query = {

          text:`select * from participant_survey_outputs where id=$1`,
          values: [id],
        };
        try {
            const allData = await db.query(query);
            const response = allData.rows[0];
            res.send(response);
          } catch (e) {
            res.send("an error ocurred");
          }
    },
    createParticipantEventOutputs: async (req,res)=>{

        console.log("participant event")
        const {
            eventID,
            eventName,
            eventDate,
            participantZipCode,
            ageID,
            participantAgeRange,
            raceID,
            participantRace,
            ethnicityID,
            participantEthnicity,
            genderID,
            participantGender,
            orientationID,
            participantOrientation,
            participantOrientationOther,
            roleID,
            participantRole,
            educationID,
            participantEducation,
            employmentID,
            participantEmployment,
            livingID,
            participantLiving,
            housingID,
            participantHousing,
            participantFoodInsecurity1,
            participantFoodInsecurity2,
            insuranceID,
            participantInsurance,
            participantHealth,
            participantPCP,
            participantRoutine,
            participantComfortSex,
            participantComfortMentalHealth,
            participantComfortDiet,
            participantComfortExercise,
            participantComfortHealth,
            participantComfortMedications,
            participantComfortScreens,
            participantComfortSubstances,
            participantRelationship,
            participantPHQ2a,
            participantPHQ2b,
            participantHIVTest,
            participantHIV12,
            participantHIVKnowledge,
            participantCondomUse,
            participantPrEPKnowledge,
            participantPrEPUse,
            participantUKnowledge,
            participantTestResourceKnowledge,
            participantPRePResourceKnowledge,
            participantPRePResourceKnowledgeOther,
            interestHIV,
            interestPrEP,
            interestHepC,
            interestImmigration,
            interestScreens,
            interestVaccines,
            interestMentalHealth,
            interestSubstance,
            interestChronic,
            interestOther,
            participantVote,
            participantReferral,
            participantReferralOther,
            participantSuggestions,
            participantPEPKnowledge,
            participantBorough
        }= req.body

        console.log("req.body",req.body)


try {
    const text = `insert into participant_survey_outputs (
        eventID,
        eventName,
        eventDate,
        participantZipCode,
        ageID,
        participantAgeRange,
        raceID,
        participantRace,
        ethnicityID,
        participantEthnicity,
        genderID,
        participantGender,
        orientationID,
        participantOrientation,
        participantOrientationOther,
        roleID,
        participantRole,
        educationID,
        participantEducation,
        employmentID,
        participantEmployment,
        livingID,
        participantLiving,
        housingID,
        participantHousing,
        participantFoodInsecurity1,
        participantFoodInsecurity2,
        insuranceID,
        participantInsurance,
        participantHealth,
        participantPCP,
        participantRoutine,
        participantComfortSex,
        participantComfortMentalHealth,
        participantComfortDiet,
        participantComfortExercise,
        participantComfortHealth,
        participantComfortMedications,
        participantComfortScreens,
        participantComfortSubstances,
        participantRelationship,
        participantPHQ2a,
        participantPHQ2b,
        participantHIVTest,
        participantHIV12,
        participantHIVKnowledge,
        participantCondomUse,
        participantPrEPKnowledge,
        participantPrEPUse,
        participantUKnowledge,
        participantTestResourceKnowledge,
        participantPRePResourceKnowledge,
        participantPRePResourceKnowledgeOther,
        interestHIV,
        interestPrEP,
        interestHepC,
        interestImmigration,
        interestScreens,
        interestVaccines,
        interestMentalHealth,
        interestSubstance,
        interestChronic,
        interestOther,
        participantVote,
        participantReferral,
        participantReferralOther,
        participantSuggestions,
        participantPEPKnowledge,
        participantBorough) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $16,
            $17,
            $18,
            $19,
            $20,
            $21,
            $22,
            $23,
            $24,
            $25,
            $26,
            $27,
            $28,
            $29,
            $30,
            $31,
            $32,
            $33,
            $34,
            $35,
            $36,
            $37,
            $38,
            $39,
            $40,
            $41,
            $42,
            $43,
            $44,
            $45,
            $46,
            $47,
            $48,
            $49,
            $50,
            $51,
            $52,
            $53,
            $54,
            $55,
            $56,
            $57,
            $58,
            $59,
            $60,
            $61,
            $62,
            $63,
            $64,
            $65,
            $66,
            $67,
            $68,
            $69
            ) RETURNING *`;
            const values = [
                eventID,
            eventName,
            eventDate,
            participantZipCode,
            ageID,
            participantAgeRange,
            raceID,
            participantRace,
            ethnicityID,
            participantEthnicity,
            genderID,
            participantGender,
            orientationID,
            participantOrientation,
            participantOrientationOther,
            roleID,
            participantRole,
            educationID,
            participantEducation,
            employmentID,
            participantEmployment,
            livingID,
            participantLiving,
            housingID,
            participantHousing,
            participantFoodInsecurity1,
            participantFoodInsecurity2,
            insuranceID,
            participantInsurance,
            participantHealth,
            participantPCP,
            participantRoutine,
            participantComfortSex,
            participantComfortMentalHealth,
            participantComfortDiet,
            participantComfortExercise,
            participantComfortHealth,
            participantComfortMedications,
            participantComfortScreens,
            participantComfortSubstances,
            participantRelationship,
            participantPHQ2a,
            participantPHQ2b,
            participantHIVTest,
            participantHIV12,
            participantHIVKnowledge,
            participantCondomUse,
            participantPrEPKnowledge,
            participantPrEPUse,
            participantUKnowledge,
            participantTestResourceKnowledge,
            participantPRePResourceKnowledge,
            participantPRePResourceKnowledgeOther,
            interestHIV,
            interestPrEP,
            interestHepC,
            interestImmigration,
            interestScreens,
            interestVaccines,
            interestMentalHealth,
            interestSubstance,
            interestChronic,
            interestOther,
            participantVote,
            participantReferral,
            participantReferralOther,
            participantSuggestions,
            participantPEPKnowledge,
            participantBorough
            ]

            const allData = await db.query(text,values);
            const response = allData.rows;
            res.status(200).send({"message":"participant event outputs saved successfully",'statusText':'OK'});
            console.log("sucess post event report")
           
    
} catch (error) {
    res.status(400).send({"message":"an error occurred, try again later","error":error})
    console.log("create participant event error:",error)
}
    },





// CREATE OEF PARTICIPANT EVENT OUTPUT

createOefParticipantEventOutputs: async (req,res)=>{

    console.log("oef participant event")
    const {
        deliveryPartner,
programName,
eventDate,
programID,
participantZipCode,
ageID,
participantAgeRange,
raceID,
participantRace,
ethnicityID,
participantEthnicity,
genderID,
participantGender,
orientationID,
participantOrientation,
participantOrientationOther,
participantReferral,
participantReferralOther,
participantSuggestions,

participantRaceOther,
    participantEthnicityOther,
    participantSexualIdentityOther
    }= req.body

    console.log("req.body oef participan event output",req.body)


try {
const text = `insert into participant_survey_outputs (
    deliveryPartner,
programName,
eventDate,
programID,
participantZipCode,
ageID,
participantAgeRange,
raceID,
participantRace,
ethnicityID,
participantEthnicity,
genderID,
participantGender,
orientationID,
participantOrientation,
participantOrientationOther,
participantReferral,
participantReferralOther,
participantSuggestions,
participantRaceOther,
    participantEthnicityOther,
    participantSexualIdentityOther) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18,
    $19,$20,$21,$22
        ) RETURNING *`;
        const values = [
            deliveryPartner,
programName,
eventDate,
programID,
participantZipCode,
ageID,
participantAgeRange,
raceID,
participantRace,
ethnicityID,
participantEthnicity,
genderID,
participantGender,
orientationID,
participantOrientation,
participantOrientationOther,
participantReferral,
participantReferralOther,
participantSuggestions,
participantRaceOther,
    participantEthnicityOther,
    participantSexualIdentityOther
        ]

const allData = await db.query(text,values);
const response = allData.rows;
res.status(200).send({"message":"oef participant event outputs saved successfully",'statusText':'OK'});
console.log("sucess post event report")
       

} catch (error) {
res.status(400).send({"message":"an error occurred, try again later","error":error})
console.log("create participant event error:",error)
}
}





}

