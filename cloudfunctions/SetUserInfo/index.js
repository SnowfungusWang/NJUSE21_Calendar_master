// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    let userInfo = await db.collection('users').where({userId: wxContext.OPENID}).get()
    if (userInfo.data.length == 0){
      await db.collection('users').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          userId: wxContext.OPENID,
          nickName: event.name,
          userIcon: event.icon,
          createTime: new Date()
        }
      })
    } else {
      await db.collection('users').where({
        userId: wxContext.OPENID
      }).update({
        data: {
          nickName: event.name,
          userIcon: event.icon
        }
      })
    }
    return await db.collection('users').where({userId: wxContext.OPENID}).get()
  } catch (e) {
    console.log(e)
    return e
  }
}