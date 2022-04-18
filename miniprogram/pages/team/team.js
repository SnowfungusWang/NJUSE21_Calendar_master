// miniprogram/pages/team/team.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 模拟数据
        teams: [{
            teamId: 0,
            teamName: 'TeamA',
            teamMembers: [{
                personName: 'xiaoming',
                role: 'captain'
            }]
        },
        {
            teamId: 1,
            teamName: 'TeamB',
            teamMembers: [{
                personName: 'xiaoming',
                role: 'captain'
            }]
        },
        {
            teamId: 2,
            teamName: 'TeamC',
            teamMembers: [{
                personName: 'xiaoming',
                role: 'captain'
            }]
        },
        {
            teamId: 3,
            teamName: 'TeamD',
            teamMembers: [{
                personName: 'xiaoming',
                role: 'captain'
            }]
        },
        {
            teamId: 4,
            teamName: 'TeamE',
            teamMembers: [{
                personName: 'xiaoming',
                role: 'captain'
            }]
        }],

        teamList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            pageTitle: "我的团队"//页面标题
        })
        wx.setNavigationBarTitle({
            title: that.data.pageTitle//设置页面标题
        })
        // console.log(this.data.teams)
        // let l = this.data.teams.map(v => {
        //     return {
        //         teamId: v.teamId,
        //         _id: 'a',
        //         name: v.teamName,
        //         memberList: v.teamMembers
        //     }
        // })
        // that.setData({
        //     teamList: l
        // })
        // console.log(l)

        // 初始化拉取信息
        wx.cloud.callFunction({
            name: 'GetTeamByUserId',
            data: {},
            success: res => {
                console.log("?", res)

                this.setData({
                    teamList: res?.result?.data || []
                })
            },
            fail: err => {
                console.log(err)
            }
        })
    },

    /**
     * 监听team_card的事件
     */
    myEventListener: function (e) {
        wx.navigateTo({
            url: '/pages/team/team_show/team_show?teamId=' + e.detail.teamId
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.onLoad();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})