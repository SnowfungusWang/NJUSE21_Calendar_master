// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    let memberList = new Array();
    memberList.push(wxContext.OPENID)
    let id = await db.collection('teams').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: event.name,
        creatorUserId: wxContext.OPENID,
        memberList: memberList,
        createTime: new Date()
      }
    })

    let user_team = await db.collection('user_team').where({
      userId: wxContext.OPENID 
    }).get()

    if(user_team.data.length !== 0){
      await db.collection('user_team').doc(user_team.data._id).update({
        data: {
          teams: _.push(id._id)
        }
      })
    } else {
      await db.collection('user_team').add({
        data: {
          userId: wxContext.OPENID,
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