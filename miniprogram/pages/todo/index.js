Page({
  data: {
    rankisSelect: false,
    stateisSelect: false,
    teamNameSelected: '全部',
    teamList: [{ teamName: 'hxh & zsx', teamId: "csxnb!" }],
    checkPointList: [],
    teamCheckPoint: [],
    input: '',
    leftCount: 0,
    allCompleted: false,
    targetTime: new Date().getTime() + 84813000,
    clearTimer: false,
    rank: '按时间排序',
    endDate: new Date(),
    endDateString: new Date().format("yyyy-MM-dd"),
    trueddl: []
  },
  onLoad: function () {
    this.rankType = "time"
    this.teamIdSelected = "all"
    this.allCpList = []
  },
  onShow: function () {
    var that = this
    that.teamNameDict = [];
    that.teamNameDict[""] = "个人"
    // console.log('myTeams', that.teamNameDict)
    that.fetchCpListAndSetDate(new Date(), that.refreshPage.bind(that))
  },
  // 获取Cp数据, 时间范围为 [today, endDate]
  // 获取到数据之后callback
  fetchCpListAndSetDate(endDateString, callback) {
    let that = this
    let endDate = new Date(endDateString)
    //调用云函数
    wx.cloud.callFunction({
      name: 'GetCheckPointByUserIdAndDateRange',
      data: {
        "beginDate": new Date().format("yyyy-MM-dd" + " 00:00"),
        "endDate": endDate.format("yyyy-MM-dd") + " 23:59"
      },
      success: res => {
        // console.log('cpList', res)
        let checkPointList = []
        res.result.data.forEach(cpObj => {
            // TODO
          let ddlDate = new Date(cpObj.ddl)
        //   ddlDate.setHours(ddlDate.getHours() - 8)
          ddlDate.setHours(ddlDate.getHours())
          // CheckPointCard数据
          checkPointList.push({
            checkPointId: cpObj._id,
            title: cpObj.title,
            details: cpObj.details,
            ddl: ddlDate.format("yyyy-MM-dd hh:mm"),
            teamId: cpObj.participateTeamId,
            teamName: that.teamNameDict[cpObj.participateTeamId],
            isFinish: cpObj.isFinish,
            urgency: cpObj.urgency,
            urgencyColor: that.getUrgencyColor(cpObj.urgency)
          })
        });
        that.allCpList = checkPointList
        that.setData({
          endDate: endDate,
          endDateString: endDate.format("yyyy-MM-dd")
        })
        if (callback != null)
          callback()
      },
      fail: err => {
        console.error
      },
    })
  },
  // 刷新页面, 根据
  refreshPage() {
    let checkPointList = []
    let leftCount = 0
    this.allCpList.forEach(element => {
      if (this.teamIdSelected == "all" || this.teamIdSelected == element.teamId) {
        checkPointList.push(element)
        if (!element.isFinish)
          leftCount++
      }
    });
    let timeRankFunc = (a, b) => {
      let aDate = new Date(a.ddl)
      let bDate = new Date(b.ddl)
      if (aDate < bDate)
        return -1
      return 1
    }
    let urgencyRankFunc = (a, b) => {
      if (a.urgency < b.urgency)
        return 1
      if (a.urgency > b.urgency)
        return -1
      return timeRankFunc(a, b)
    }
    let mixRankFunc = (a, b) => {
      let aDate = new Date(a.ddl)
      let bDate = new Date(b.ddl)
      if (a.urgency <= b.urgency && aDate <= bDate)
        return 1
      if (a.urgency >= b.urgency && aDate >= bDate)
        return -1
      return 0
    }
    switch (this.rankType) {
      case "time":
        checkPointList.sort(timeRankFunc)
        break
      case "urgency":
        checkPointList.sort(urgencyRankFunc)
        break
      case "mix":
        checkPointList.sort(mixRankFunc)
        break
    }
    // 获取最紧迫的ddl
    let targetTime = new Date().getTime() + 84813000
    console.log(targetTime)
    checkPointList.forEach(element => {
      let td = new Date(element.ddl)
      if (td > new Date()) {
        targetTime = td.getTime()
      }
    });
    console.log(targetTime)
    this.setData({
      checkPointList,
      leftCount,
      targetTime,
      clearTimer: false
    })
  },

  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed ? 'Finish' : 'Restart',
      name: todos[index].name
    })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
      logs: logs
    })
    this.save()
  },

  // 选择排序方式
  bindShowMsg_rank() {
    this.setData({
      rankisSelect: !this.data.rankisSelect,
    })
  },
  rankSelect(e) {
    this.setData({
      rankisSelect: false
    })
    // console.log (e.target.dataset)
    this.rankType = e.target.dataset.ranktype
    this.refreshPage()
  },


  //团队下拉
  bindShowMsg() {
    this.setData({
      stateisSelect: !this.data.stateisSelect,
    })
  },
  mySelect(e) {
    this.setData({
      teamNameSelected: e.currentTarget.dataset.teamname,
      stateisSelect: false
    })
    this.teamIdSelected = e.currentTarget.dataset.teamid
    this.refreshPage()
  },

  // 日期选择器修改endDate
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.fetchCpListAndSetDate(e.detail.value, this.refreshPage.bind(this))
  },

  // 点击进入详细信息界面
  checkDetail: function (e) {
    console.log(e)
    if (e.detail.checkPointId) {
      wx.navigateTo({
        url: '../details/details?id=' + e.detail.checkPointId
      })
    } else {
      wx.navigateTo({
        url: '../details/details'
      })
    }
  },
  // 修改一个CheckPointBox的Finish状态
  _onChangeCheckPointFinish: function (e) {
    let cp = null
    // console.log(e)
    this.allCpList.forEach(element => {
      if (element.checkPointId == e.detail.checkPointId) {
        element.isFinish = e.detail.isFinish
        cp = element
        // console.log (element)
      }
    });
    wx.cloud.callFunction({
      name: 'UpdateCheckPoint',
      data: {
        "checkpointId": cp.checkPointId,
        "title": cp.title,
        "details": cp.details,
        "participateTeamId": cp.teamId,
        "ddl": cp.ddl,
        "isFinish": cp.isFinish,
        "urgency": cp.urgency
      }
    })
    this.refreshPage()
  },
  getUrgencyColor(urgency) {
    switch (urgency) {
      case "5":
        return '#C82E2E'
      case "4":
        return "#F5A623"
      case "3":
        return "#B8E986"
      case "2":
        return "#2FA0CD"
      case "1":
        return "#9013FE"
      case "0":
        return "grey"
    }
    return "grey"
  }
})
