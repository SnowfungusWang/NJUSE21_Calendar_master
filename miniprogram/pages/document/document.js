
Page({
  data: {
    year: 2019,
    month: 2,
    daysColorList: [],
    checkPointList: [],
    loading: true
  },
  onShow: function (options) {
    let that = this
    let today = new Date()
    // 重置ddl卡片显示
    this.setData({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      daysColorList: [],
      checkPointList: [],
      loading: true
    })
  },
  onMonthChange(event) {
    let that = this
    // 重置ddl卡片显示
    this.setData({
      daysColorList: [],
      checkPointList: [],
      loading: true
    })
    // 获取当月所有ddl
    let beginDate = new Date()
    beginDate.setDate(1)
    beginDate.setFullYear(event.detail.currentYear)
    beginDate.setMonth(event.detail.currentMonth - 1, 1)
    let endDate = new Date()
    endDate.setFullYear(event.detail.currentYear)
    endDate.setMonth(event.detail.currentMonth, 1)
    wx.cloud.callFunction({
      name: 'GetCheckPointByUserIdAndDateRange',
      data: {
        "beginDate": beginDate.format("yyyy-MM-dd") + " 00:00",
        "endDate": endDate.format("yyyy-MM-dd") + " 00:00"
      },
      success: res => {
        var checkPointList = []
        var days = []
        // console.log("rawCpList", res.result.data)
        // 处理checkPointList
        res.result.data.forEach(cpObj => {
          let ddlDate = new Date(cpObj.ddl)
          ddlDate.setHours(ddlDate.getHours() - 8)
          // CheckPointCard数据
          checkPointList.push({
            checkPointId: cpObj._id,
            title: cpObj.title,
            details: cpObj.details,
            ddl: ddlDate.format("yyyy.MM.dd hh:mm"),
            isFinish: cpObj.isFinish,
            urgencyColor: that.getUrgencyColor(cpObj.urgency)
          })
          // 统计CheckPoint完成情况(按日)
          let cpDateStr = ddlDate.format("yyyy-MM-dd")
          if (days[cpDateStr] == null)
            days[cpDateStr] = { nb: 0, gg: 0 }
          if (cpObj.isFinish)
            days[cpDateStr].nb++
          else
            days[cpDateStr].gg++
        });
        // 按照时间排序
        let timeRankFunc = (a, b) => {
          let aDate = new Date(a.ddl)
          let bDate = new Date(b.ddl)
          if (aDate < bDate)
            return -1
          return 1
        }
        checkPointList.sort(timeRankFunc)
        // console.log("days", days)
        // 决定日历中Day的颜色
        var daysColorList = []
        for (var key in days) {
          let bkColor = "#958561"
          let fontColor = "#fff"
          if (days[key].nb == 0) {
            bkColor = "#958561"
          }
          else if (days[key].gg != 0) {
            bkColor = "#333"
          }
          daysColorList.push({
            month: "current",
            day: new Date(key).getDate(),
            color: fontColor,
            background: bkColor
          })
        }
        // console.log("days", days)
        // console.log ("daysColor", daysColorList)
        this.setData({
          checkPointList,
          loading: false,
          daysColorList
        })
      },
      fail: err => {
        console.error
      },
    })
  },
  onClickCardCheckbox(event) {
    console.log(event)
  },
  onClickCardBody(event) {
    console.log(event)
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