const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('teams').where({
      _id: event.teamId
    })
      .update({
        data: {
          name: event.name,
        },
      })
  } catch (e) {
    console.error(e)
  }
}