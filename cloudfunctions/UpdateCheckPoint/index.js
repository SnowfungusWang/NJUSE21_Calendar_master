const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('checkpoints').where({
      _id: event.checkpointId
    })
      .update({
        data: {
          title: event.title,
          details: event.details,
          participateTeamId: event.participateTeamId,
          ddl: new Date(event.ddl),
          isFinish: event.isFinish,
          urgency: event.urgency
        },
      }).then((res) => console.log(res))
  } catch (e) {
    console.error(e)
  }
}