const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let cps;
  try {
    let teams = await db.collection('user_team').where({
      userId: wxContext.OPENID
    }).get()

    console.log(teams)
    
    if (teams.data.length == 0) return { data: [], errMsg: "用户未在任何一个团队中" }
    let allteams = await db.collection('teams').where({
      _id: _.in(teams.data[0].teams)
    }).get()

    if (allteams.data.length !== 0) {
      for (let i in allteams.data) {
        for (let j in allteams.data[i].memberList) {
          let su = await db.collection('users').where({
            userId: allteams.data[i].memberList[j]
          }).get()
          allteams.data[i].memberList[j] = su.data[0]
        }
      }
    }

    return allteams
  } catch (e) {
    console.error(e)
  }
}