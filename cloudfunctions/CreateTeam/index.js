// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let currentUser = wxContext.OPENID

  try {
    let memberList = new Array();
    memberList.push(currentUser)
    let id = await db.collection('teams').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: event.name,
        creatorUserId: currentUser,
        memberList: memberList,
        createTime: new Date()
      }
    })

    let user_team = await db.collection('user_team').where({
      userId: currentUser
    }).get()
    if(user_team.data.length !== 0){
      await db.collection('user_team').where({
        userId: currentUser
      }).update({
        data: {
          teams: _.push(id._id)
        }
      })
    } else {
      await db.collection('user_team').add({
        data: {
          userId: currentUser,
          teams: [id._id]
        }
      })
    }
    return await db.collection('teams').where({
      _id: id._id
    }).get()

  } catch (e) {
    console.log(e)
  }
}