const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let cps;
  try {
    let ddl_list = await db.collection('checkpoints').where({
      ddl: _.lte(new Date(event.endDate)).and(_.gte(new Date(event.beginDate))),
      userId: wxContext.OPENID
    }).get()
    console.log("云函数内日期", event.beginDate, event.endDate)
    console.log("openid", wxContext.OPENID)
    return ddl_list
  } catch (e) {
    console.error(e)
  }
}