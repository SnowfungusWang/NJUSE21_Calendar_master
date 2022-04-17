const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    let t =  await db.collection('teams').where({
      _id: event.teamId
    }).get()
    // let u = new Array()
    // t.data[0].memberList.map(async (user, index, arr) => {
    //   let su = await db.collection('users').where({
    //     userId: user
    //   }).get()
    //   return arr[index] = su.data[0]
    // })
    // return t
    if (t.data.length !== 0) {
      for (let i in t.data[0].memberList) {
        let su = await db.collection('users').where({
          userId: t.data[0].memberList[i]
        }).get()
        t.data[0].memberList[i] = su.data[0]
      }
    }
    return t
  } catch (e) {
    console.error(e)
  }
}