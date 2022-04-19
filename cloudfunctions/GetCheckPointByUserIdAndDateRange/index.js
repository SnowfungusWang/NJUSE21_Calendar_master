const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const currentUser = wxContext.OPENID
  try {
    let ddl_list = await db.collection('checkpoints').where({
      ddl: _.lte(new Date(event.endDate)).and(_.gte(new Date(event.beginDate))),
      userId: currentUser
    }).get()
    return ddl_list
  } catch (e) {
    console.error(e)
  }
}