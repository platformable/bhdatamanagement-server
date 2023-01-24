const db = require("../dbConnect");

module.exports = {
  getSiteVisits: async (req, res) => {
    try {
      const allData = await db.query("select * from site_visits");
      const response = allData.rows;
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  getSiteVisitById: async (req, res) => {
    let {id} = req.params
    console.log("id",id)
    try {
      const allData = await db.query(`select * from site_visits where id=${id}`);
      const response = allData.rows;
      response.length>=1 ? res.status(200).send(response) : res.status(200).send({message:"There is no site visit with that ID"});
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  createSiteVisit: (req, res) => {
    const {
      userId,
      eventDate,
      eventStartTime,
      eventFinishTime,
      fbo,
      fboAttendees,
      fboAttendeesOther,
      sanctuary,
      privateTestingArea,
      healthMinistry,
      healthMinistryMembers,
      healthMinistryActive,
      healthMinistryCoordinators,
      strategiesHealthDisparities,
      targetAudience,
      targetAudienceOther,
      targetAudienceAdditional,
      barriersEngagement,
      barriersEngagementOther,
      bestPractices,
      eventChallenges,
      fboChanges,
      fboImprovements,
      fboObservations,
      fboBeyondGrant,
      fboCabFeedback,
      fboAliFeedback,
      fboYipFeedback,
      fboLeaderHivOpenness,
      healthMinistryHivOpenness,
      membershipHivOpenness,
      communityHivOpenness,
      faithLeaderDiversityOpenness,
      healthMinistryDiversityOpenness,
      membershipDiversityOpenness,
      communityDiversityOpenness,
      boroughFbo,
      submissionStatus,
      submissionNotes,
      surveyName,
      programId,
      programName,
    } = req.body
    const query = {
      text: `insert into site_visits (
        userId,
        eventDate,
        eventStartTime,
        eventFinishTime,
        fbo,
        fboAttendees,
        fboAttendeesOther,
        sanctuary,
        privateTestingArea,
        healthMinistry,
        healthMinistryMembers,
        healthMinistryActive,
        healthMinistryCoordinators,
        strategiesHealthDisparities,
        targetAudience,
        targetAudienceOther,
        targetAudienceAdditional,
        barriersEngagement,
        barriersEngagementOther,
        bestPractices,
        eventChallenges,
        fboChanges,
        fboImprovements,
        fboObservations,
        fboBeyondGrant,
        fboCabFeedback,
        fboAliFeedback,
        fboYipFeedback,
        fboLeaderHivOpenness,
        healthMinistryHivOpenness,
        membershipHivOpenness,
        communityHivOpenness,
        faithLeaderDiversityOpenness,
        healthMinistryDiversityOpenness,
        membershipDiversityOpenness,
        communityDiversityOpenness,
        boroughFbo,
        submissionStatus,
        submissionNotes,
        surveyName,
        programId,
        programName
      ) VALUES (
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
        $42
      ) RETURNING *`,
      values : [
        userId,
        eventDate,
        eventStartTime,
        eventFinishTime,
        fbo,
        fboAttendees,
        fboAttendeesOther,
        sanctuary,
        privateTestingArea,
        healthMinistry,
        healthMinistryMembers,
        healthMinistryActive,
        healthMinistryCoordinators,
        strategiesHealthDisparities,
        targetAudience,
        targetAudienceOther,
        targetAudienceAdditional,
        barriersEngagement,
        barriersEngagementOther,
        bestPractices,
        eventChallenges,
        fboChanges,
        fboImprovements,
        fboObservations,
        fboBeyondGrant,
        fboCabFeedback,
        fboAliFeedback,
        fboYipFeedback,
        fboLeaderHivOpenness,
        healthMinistryHivOpenness,
        membershipHivOpenness,
        communityHivOpenness,
        faithLeaderDiversityOpenness,
        healthMinistryDiversityOpenness,
        membershipDiversityOpenness,
        communityDiversityOpenness,
        boroughFbo,
        submissionStatus,
        submissionNotes,
        surveyName,
        programId,
        programName,
      ]
    }


    db.query(query)
      .then((data) => {
        if ((data.rowCount = 1)) {
          res.send({
            statusText: "OK",
            response: "Event created",
          });
        }
      })
      .catch((e) => console.error(e.stack));
  }, 
  updateSiteVisit: async (req, res) => {
    let {
        userId,
        eventDate,
        eventStartTime,
        eventFinishTime,
        fbo,
        fboAttendees,
        fboAttendeesOther,
        sanctuary,
        privateTestingArea,
        healthMinistry,
        healthMinistryMembers,
        healthMinistryActive,
        healthMinistryCoordinators,
        strategiesHealthDisparities,
        targetAudience,
        targetAudienceOther,
        targetAudienceAdditional,
        barriersEngagement,
        barriersEngagementOther,
        bestPractices,
        eventChallenges,
        fboChanges,
        fboImprovements,
        fboObservations,
        fboBeyondGrant,
        fboCabFeedback,
        fboAliFeedback,
        fboYipFeedback,
        fboLeaderHivOpenness,
        healthMinistryHivOpenness,
        membershipHivOpenness,
        communityHivOpenness,
        faithLeaderDiversityOpenness,
        healthMinistryDiversityOpenness,
        membershipDiversityOpenness,
        communityDiversityOpenness,
        boroughFbo,
        submissionStatus,
        submissionNotes,
        surveyName,
        programId,
        programName,
    } = req.body;

    try {
      const query = await {
        name: "update-fbo",
        text: `update site_visits set 
        userId=$1,
        eventDate=$2,
        eventStartTime=$3,
        eventFinishTime=$4,
        fbo=$5,
        fboAttendees=$6,
        fboAttendeesOther=$7,
        sanctuary=$8,
        privateTestingArea=$9,
        healthMinistry=$10,
        healthMinistryMembers=$11,
        healthMinistryActive=$12,
        healthMinistryCoordinators=$13,
        strategiesHealthDisparities=$14,
        targetAudience=$15,
        targetAudienceOther=$16,
        targetAudienceAdditional=$17,
        barriersEngagement=$18,
        barriersEngagementOther=$19,
        bestPractices=$20,
        eventChallenges=$21,
        fboChanges=$22,
        fboImprovements=$23,
        fboObservations=$24,
        fboBeyondGrant=$25,
        fboCabFeedback=$26,
        fboAliFeedback=$27,
        fboYipFeedback=$28,
        fboLeaderHivOpenness=$29,
        healthMinistryHivOpenness=$30,
        membershipHivOpenness=$31,
        communityHivOpenness=$32,
        faithLeaderDiversityOpenness=$33,
        healthMinistryDiversityOpenness=$34,
        membershipDiversityOpenness=$35,
        communityDiversityOpenness=$36,
        boroughFbo=$37,
        submissionStatus=$38,
        submissionNotes=$39,
        surveyName=$40,
        programId=$41,
        programName=$42 where id=$43`,
        values: [
            userId,
            eventDate,
            eventStartTime,
            eventFinishTime,
            fbo,
            fboAttendees,
            fboAttendeesOther,
            sanctuary,
            privateTestingArea,
            healthMinistry,
            healthMinistryMembers,
            healthMinistryActive,
            healthMinistryCoordinators,
            strategiesHealthDisparities,
            targetAudience,
            targetAudienceOther,
            targetAudienceAdditional,
            barriersEngagement,
            barriersEngagementOther,
            bestPractices,
            eventChallenges,
            fboChanges,
            fboImprovements,
            fboObservations,
            fboBeyondGrant,
            fboCabFeedback,
            fboAliFeedback,
            fboYipFeedback,
            fboLeaderHivOpenness,
            healthMinistryHivOpenness,
            membershipHivOpenness,
            communityHivOpenness,
            faithLeaderDiversityOpenness,
            healthMinistryDiversityOpenness,
            membershipDiversityOpenness,
            communityDiversityOpenness,
            boroughFbo,
            submissionStatus,
            submissionNotes,
            surveyName,
            programId,
            programName,
            id
        ],
      };
      db.query(query).then((response) =>
        res
          .json({
            data: response.rowCount,
            status: 200,
          })
          .then((response) => console.log("site visit updated"))
      );
      //.catch((e) => res.send(e.stack));
    } catch (error) {
      res.json("an error ocurred");
      console.log("error message:", error);
    }
  },
  deleteSiteVisit: async (req, res) => {
    const { numberfbo } = req.body;
    console.log("users req.body",req.body)
    const query = {
      text: "DELETE from site_visits where id=$1",
      values: [numberfbo],
    };
    // promise
    db.query(query)
      .then((data) => {
        if ((data.rowCount = 1)) {
          res.send({
            status: "OK",
            response: "SV deleted",
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
};
