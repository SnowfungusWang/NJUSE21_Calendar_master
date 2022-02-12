const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let cps;
  try {
    return await db.collection('checkpoints').where({
      ddl: _.lte(new Date(event.endDate)).and(_.gte(new Date(event.beginDate))),
      userId: wxContext.OPENID
    }).get()
  } catch (e) {
    console.error(e)
  }
}