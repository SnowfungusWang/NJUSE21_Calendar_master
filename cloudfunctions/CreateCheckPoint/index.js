// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    let id = await db.collection('checkpoints').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: event.title,
        details: event.details,
        participateTeamId: event.participateTeamId,
        ddl: new Date(event.ddl),
        urgency: event.urgency,
        isFinish: false,
        userId: wxContext.OPENID,
        urgency: event.urgency
      }
    })

    return {
      data: {
        checkPointId: id._id,
        title: event.title,
        details: event.details,
        urgency: event.urgency,
        participateTeamId: event.participateTeamId,
        ddl: new Date(event.ddl),
        isFinish: false,
        urgency: event.urgency
      }
    }
  } catch (e) {
    console.log(e)
  }
}