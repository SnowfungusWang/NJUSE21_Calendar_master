
Page({
    data: {
        year: 2019,
        month: 2,
        daysColorList: [],
        checkPointList: [],
        loading: true
    },
    onShow: function (options) {
        let today = new Date()
        // 重置ddl卡片显示
        this.setData({
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            daysColorList: [],
            checkPointList: [],
            loading: true
        })
        wx.cloud.callFunction({
            name: 'GetTeamByUserId',
            success: res => {
                const teamMap = new Map()
                res.result.data.forEach(v => {
                    teamMap.set(v._id, v.name)
                })
                teamMap.set("", "个人")
                this.teamMap = teamMap
                this.onMonthChange({
                    detail: {
                        currentMonth: today.getMonth() + 1,
                        currentYear: today.getFullYear()
                    }
                })
            },
            fail: err => {
                console.error(err)
            },
        })
    },

    getDayColor(days, type) {
        console.log(days)
        let daysColorList = []
        const curDay = new Date().getDate()
        const curMonth = new Date().getMonth()
        // if (curMonth === )
        daysColorList.push({
            month: 'current',
            day: curDay,
            color: '#EDE7DC',
            background: '#7b5d46'
        })

        if (type === 'month') {
            for (var key in days) {
                if (new Date(key).getDate() !== curDay) {
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
            }
        } else {
            daysColorList.push({
                month: "current",
                day: new Date(type).getDate(),
                color: "#fff",
                background: "#958561"
            })
        }
        return daysColorList
    },

    processRes(ddlList, type) {
        var checkPointList = []
        var days = []
        // 处理checkPointList
        ddlList.forEach(cpObj => {
            let ddlDate = new Date(cpObj.ddl)
            // CheckPointCard数据
            checkPointList.push({
                checkPointId: cpObj._id,
                title: cpObj.title,
                details: cpObj.details,
                ddl: ddlDate.format("yyyy.MM.dd hh:mm"),
                teamName: this.teamMap.get(cpObj.participateTeamId),
                isFinish: cpObj.isFinish,
                urgencyColor: this.getUrgencyColor(cpObj.urgency)
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

        // 决定日历中Day的颜色
        var daysColorList = this.getDayColor(days, type)
        this.setData({
            checkPointList,
            loading: false,
            daysColorList
        })

    },

    onMonthChange(event) {
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
                this.processRes(res.result.data, 'month')
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
    },

    onDayClick(event) {
        // loading
        this.setData({
            daysColorList: [],
            checkPointList: [],
            loading: true
        })

        // get data
        const { detail } = event
        const { year, month, day } = detail
        const dayStr = year + '-' + (month - 9 > 0 ? "" : 0) + month + '-' + (day - 9 > 0 ? '' : '0') + day;

        wx.cloud.callFunction({
            name: 'GetCheckPointByUserIdAndDateRange',
            data: {
                "beginDate": dayStr + " 00:00",
                "endDate": dayStr + " 23:59"
            },
            success: res => {
                console.log('cpList', res)
                this.processRes(res.result.data, dayStr)
            },
            fail: err => {
                console.error
            },
        })

    }
})