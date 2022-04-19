var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
//获取月份  
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//获取当日日期 
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
var teamid = '';

Page({
    data: {
        teamName: '个人',
        isSelect: false,
        select: [{ name: '5', teamID: '' }],
        state: '个人',
        items: [
            { name: '5', value: '' },
            { name: '4', value: '' },
            { name: '3', value: '' },
            { name: '2', value: '' },
            { name: '1', value: '' },
            { name: '0', value: '', checked: 'true' },
        ],
        radioColor: 'grey',
        title: '',
        urgency: 0,
        textarea: '',
        startDate: date.getFullYear() + '-' + M + '-' + D + ' ' + currentHours + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
        multiArray: [['今天'], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [0]],
        multiIndex: [0, 0, 0],
    },

    radioChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({
            urgency: e.detail.value
        })
        switch (e.detail.value) {
            case '5':
                {
                    this.setData({
                        radioColor: '#C82E2E'
                    })
                    break;
                }
            case '4':
                this.setData({
                    radioColor: "#F5A623"
                })
                break;
            case '3':
                this.setData({
                    radioColor: "#B8E986"
                })
                break;
            case '2':
                this.setData({
                    radioColor: "#2FA0CD"
                })
                break;
            case '1':
                this.setData({
                    radioColor: "#9013FE"
                })
                break;
            case '0':
                this.setData({
                    radioColor: "grey"
                })
                break;
        }
    },

    //类型
    changeColor: function (e) {
        // console.log(this.data.items[0].name)
        // var name='0'

    },


    //备注 失去焦点时获取里面的内容
    bindTextAreaBlur: function (e) {
        this.setData({
            textarea: e.detail.value
        })
    },

    //点击按钮时赋值给detail
    bindFormSubmit: function (e) {
        this.setData({
            focus: 'false',
            textarea: this.data.textarea
        })
        //调用云函数
        wx.cloud.callFunction({
            name: 'CreateCheckPoint',
            data: {
                title: this.data.title,
                details: this.data.textarea,
                participateTeamId: this.data.teamid,
                ddl: this.data.startDate,
                isFinish: false,
                urgency: this.data.urgency
            },
            success: res => {
                wx.switchTab({
                    url: '../todo/index',
                })
            },
            fail: err => {
                console.log(err)
            }
        })
    },

    //DDL名称
    inputChangeHandle: function (e) {
        this.setData({ title: e.detail.value })
    },

    addTitleHandle: function (e) {
        this.setData({
            title: this.detail.value
        })
    },


    onLoad: function (options) {
        this.setData({
            teamid: '',
        })
        const userId = wx.getStorageSync('userId')
        console.log('userInfo', userId)
        //获取队名
        wx.cloud.callFunction({
            name: 'GetTeamByUserId',
            data: {
                user_id: userId
            },
            success: res => {
                let select = []
                res.result.data.forEach(cpObj => {
                    // select数据
                    select.push({
                        teamID: cpObj._id,
                        name: cpObj.name,
                    })
                });
                this.setData({
                    select,
                })
                // console.log('teamid_add', res)
            },
            fail: err => {
                console.log(err)
            },
        })

    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    },

    pickerTap: function () {
        date = new Date();

        var monthDay = ['今天'];
        var hours = [];
        var minute = [];

        currentHours = date.getHours();
        currentMinute = date.getMinutes();

        // 月-日
        for (var i = 1; i <= 363; i++) {
            var date1 = new Date(date);
            date1.setDate(date.getDate() + i);
            var md = (date1.getFullYear()) + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
            monthDay.push(md);
        }

        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };

        if (data.multiIndex[0] === 0) {
            if (data.multiIndex[1] === 0) {
                this.loadData(hours, minute);
            } else {
                this.loadMinute(hours, minute);
            }
        } else {
            this.loadHoursMinute(hours, minute);
        }

        data.multiArray[0] = monthDay;
        data.multiArray[1] = hours;
        data.multiArray[2] = minute;

        this.setData(data);
    },

    bindMultiPickerColumnChange: function (e) {
        date = new Date();

        var that = this;

        var monthDay = ['今天'];
        var hours = [];
        var minute = [];

        currentHours = date.getHours();
        currentMinute = date.getMinutes();

        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        // 把选择的对应值赋值给 multiIndex
        data.multiIndex[e.detail.column] = e.detail.value;

        // 然后再判断当前改变的是哪一列,
        //如果第1列改变了,则有当前时刻的日期限制；否则hours、minutes全从0开始
        if (e.detail.column === 0) {
            // 如果第一列是今天
            if (e.detail.value === 0) {
                that.loadData(hours, minute);
            } else {
                that.loadHoursMinute(hours, minute);
            }
            data.multiIndex[1] = 0;
            data.multiIndex[2] = 0;

            // 如果是第2列改变
        } else if (e.detail.column === 1) {
            // 如果第一列为今天
            if (data.multiIndex[0] === 0) {
                if (e.detail.value === 0) {
                    that.loadData(hours, minute);
                } else {
                    that.loadMinute(hours, minute);
                }
                // 第一列不为今天
            } else {
                that.loadHoursMinute(hours, minute);
            }
            data.multiIndex[2] = 0;

            // 如果是第3列改变
        } else {
            // 如果第一列为'今天'
            if (data.multiIndex[0] === 0) {
                // 如果第一列为 '今天'并且第二列为当前时间
                if (data.multiIndex[1] === 0) {
                    that.loadData(hours, minute);
                } else {
                    that.loadMinute(hours, minute);
                }
            } else {
                that.loadHoursMinute(hours, minute);
            }
        }
        data.multiArray[1] = hours;
        data.multiArray[2] = minute;
        this.setData(data);
    },

    loadData: function (hours, minute) {

        var minuteIndex = currentMinute;
        //hours
        for (var i = currentHours; i < 24; i++) {
            hours.push(i);
        }
        //minutes
        for (var i = currentMinute; i < 60; i++) {
            minute.push(i);
        }
    },

    //时、分全部从0开始
    loadHoursMinute: function (hours, minute) {
        // 时
        for (var i = 0; i < 24; i++) {
            hours.push(i);
        }
        // 分
        for (var i = 0; i < 60; i++) {
            minute.push(i);
        }
    },

    //时从当前时刻的后面开始，分从0开始
    loadMinute: function (hours, minute) {
        for (var i = currentHours; i < 24; i++) {
            hours.push(i);
        }
        // 分
        for (var i = 0; i < 60; i++) {
            minute.push(i);
        }
    },

    bindStartMultiPickerChange: function (e) {
        var that = this;
        var monthDay = that.data.multiArray[0][e.detail.value[0]];
        var hours = that.data.multiArray[1][e.detail.value[1]];
        var minute = that.data.multiArray[2][e.detail.value[2]];
        hours = hours < 10 ? '0' + hours : hours;
        minute = minute < 10 ? '0' + minute : minute;

        if (monthDay === "今天") {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            monthDay = year + "-" + month + "-" + day;

        } else {
            var year = monthDay.split("-")[0];
            var month = (monthDay.split("-")[1] < 10 ? '0' + monthDay.split("-")[1] : monthDay.split("-")[1] + 1); // 返回月
            var day = monthDay.split("-")[2] < 10 ? '0' + monthDay.split("-")[2] : monthDay.split("-")[2]; // 返回日
            monthDay = year + "-" + month + "-" + day;
        }
        var startDate = (monthDay + " " + hours + ":" + minute);
        that.setData({
            startDate: startDate
        })
    },

    //下拉
    bindShowMsg() {
        this.setData({
            isSelect: true
        })
    },

    mySelect(e) {
        this.setData({
            teamName: e.currentTarget.dataset.name,
            teamid: e.currentTarget.dataset.teamid,
            isSelect: false
        })
    },

    mySelect_person(e) {
        this.setData({
            teamName: '个人',
            teamid: '',
            isSelect: false
        })
    }

})

