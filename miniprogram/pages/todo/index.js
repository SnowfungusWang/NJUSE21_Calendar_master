Page({
    data: {
        rankisSelect: false,
        stateisSelect: false,
        teamNameSelected: '全部',
        teamList: [],
        checkPointList: [],
        teamCheckPoint: [],
        input: '',
        leftCount: 0,
        allCompleted: false,
        targetTime: new Date().getTime() + 84813000,
        clearTimer: false,
        rank: '按时间排序',
        rankSelect: 'time',
        endDate: new Date(),
        endDateString: new Date().format("yyyy-MM-dd"),
        trueddl: [],
        refresh: false,
        loading: true
    },
    onLoad: function () {
        this.rankType = "time"
        this.teamIdSelected = "all"
        this.allCpList = []
        const userId = wx.getStorageSync('userId')
        this.setData({
            userId: userId
        })
    },
    onShow: function () {
        var that = this
        that.teamNameDict = [];
        that.teamNameDict[""] = "个人"
        that.teamNameDict = []
        wx.cloud.callFunction({
            name: 'GetTeamByUserId',
            data: { user_id: this.data.userId },
            success: res => {
                let teamList = []
                res.result.data.forEach(element => {
                    that.teamNameDict[element._id] = element.name
                    teamList.push({
                        teamId: element._id,
                        teamName: element.name
                    })
                });
                that.setData({
                    teamList
                })
                that.teamNameDict[""] = "个人"
                // console.log('myTeams', that.teamNameDict)
                that.fetchCpListAndSetDate(new Date(), that.refreshPage.bind(that))
            },
            fail: err => {
                console.error(err)
            },
        })
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
                let checkPointList = []
                res.result.data.forEach(cpObj => {
                    // TODO
                    // console.log(cpObj)
                    let ddlDate = new Date(cpObj.ddl)
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

    // 获取最紧迫的ddl
    countNearTime(checkPointList) {
        let nearDate = ''
        if (checkPointList.length > 0) {
            let curDate = new Date()
            checkPointList.forEach(element => {
                let td = new Date(element.ddl)
                if (td > curDate && !element.isFinish) {
                    nearDate = nearDate === '' ? td : nearDate < td ? nearDate : td;
                }
            });
        }
        let targetTime = nearDate === '' ? -1 : nearDate.getTime()
        return targetTime
    },

    // 刷新页面
    refreshPage() {
        this.setData({
            loading: true
        })
        let checkPointList = []
        let leftCount = 0
        // 展示显示的list，计算完成数 
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

        let targetTime = this.countNearTime(checkPointList)

        this.setData({
            checkPointList,
            leftCount,
            targetTime: targetTime,
            refresh: !this.data.refresh,
            loading: false
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
        const rankMap = {
            'time': '按时间排序',
            'urgency': '按重要程度排序',
            'mix': '综合排序'
        }
        this.setData({
            rankisSelect: false
        })
        this.setData({
            rank: rankMap[e.target.dataset.ranktype]
        })
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
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.fetchCpListAndSetDate(e.detail.value, this.refreshPage.bind(this))
    },

    // 点击进入详细信息界面
    checkDetail: function (e) {
        // console.log(e)
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
            },
            success: res => {
                this.refreshPage()
            }
        })
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
