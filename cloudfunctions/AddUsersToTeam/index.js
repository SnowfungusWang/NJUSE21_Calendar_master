// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  event.users.forEach(async (user) => {
    let u = await db.collection('user_team').where({
      userId: user
    }).get()
    // console.log("u", u)
    if (u.data.length !== 0) {
      db.collection('user_team').where({
          userId: user
      }).update({
        data: {
          teams: _.push(event.teamId)
        }
      })
    } else {
      db.collection('user_team').add({
        data: {
          userId: user,
          teams: [event.teamId]
        }
      })
    }
  })

  await db.collection('teams').where({
    _id: event.teamId
  }).update({
    data: {
      memberList: _.push(event.users)
    }
  })

}