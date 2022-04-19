const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    return await db.collection('checkpoints').where({
      _id: event.checkpointId
    }).remove()
    .then((res) => console.log(res))
  } catch (e) {
    console.error(e)
  }
}