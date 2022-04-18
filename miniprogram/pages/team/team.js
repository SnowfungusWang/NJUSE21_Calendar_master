// miniprogram/pages/team/team.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 模拟数据
        teams: [
            {
                teamId: 0,
                teamName: "TeamA",
                teamMembers: [
                    {
                        personName: "xiaoming",
                        role: "captain",
                    },
                ],
            },
            {
                teamId: 1,
                teamName: "TeamB",
                teamMembers: [
                    {
                        personName: "xiaoming",
                        role: "captain",
                    },
                ],
            },
            {
                teamId: 2,
                teamName: "TeamC",
                teamMembers: [
                    {
                        personName: "xiaoming",
                        role: "captain",
                    },
                ],
            },
            {
                teamId: 3,
                teamName: "TeamD",
                teamMembers: [
                    {
                        personName: "xiaoming",
                        role: "captain",
                    },
                ],
            },
            {
                teamId: 4,
                teamName: "TeamE",
                teamMembers: [
                    {
                        personName: "xiaoming",
                        role: "captain",
                    },
                ],
            },
        ],

        teamList: [],
        hasUserInfo: false,
        userName: "",
        userIcon: "",
    },
    login() {
        wx.cloud.callFunction({
            name: "GetUserInfo",
            data: {},
            success: res => {
                if (res.result.data.length === 0) {
                    try {
                        wx.setStorageSync('hasUserInfo', true)
                    } catch (e) { }
                    finally {
                        // wx.reLaunch({ url: "/pages/userCenter/userCenter" })
                        this.init()
                    }
                } else {
                    this.init();

                }
            },
            fail: err => {
                console.log(err);
            }
        })

        // if (!this.data.hasUserInfo) {
        //     wx.reLaunch({ url: "/pages/userCenter/userCenter" });
        // }
    },

    init() {
        // 初始化拉取信息
        wx.cloud.callFunction({
            name: "GetTeamByUserId",
            data: {},
            success: (res) => {
                this.setData({
                    teamList: res?.result?.data || [],
                });
            },
            fail: (err) => {
                console.log(err);
            },
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.login();
        var that = this;
        that.setData({
            pageTitle: "我的团队", //页面标题
        });
        wx.setNavigationBarTitle({
            title: that.data.pageTitle, //设置页面标题
        });

    },

    /**
     * 监听team_card的事件
     */
    myEventListener: function (e) {
        wx.navigateTo({
            url: "/pages/team/team_show/team_show?teamId=" + e.detail.teamId,
        });
    },

    /**
     * 初次访问协作页面，检查nickname
     */
    checkNickName: function () {
        wx.cloud.callFunction({
            name: "GetUserInfo",
            data: {},
            success: (res) => {
                this.setData({
                    userName: res.data[0].nickName,
                });
                return res;
            },
            fail: (err) => {
                console.log(err);
            },
        });
    },

    /**
     * 初次访问协作页面，设置nickname
     */
    setNickName: function (nickName, icon) {
        wx.cloud.callFunction({
            name: "SetUserInfo",
            data: {
                name: nickName,
                icon: icon,
            },
            success: (res) => {
                this.setData({
                    userName: nickName,
                    userIcon: icon,
                });
            },
            fail: (err) => {
                console.log(err);
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log("show");
        this.onLoad();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () { },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () { },
});
