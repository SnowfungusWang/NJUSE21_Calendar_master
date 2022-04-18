// miniprogram/pages/team/team_add/team_add.js
const { $Toast } = require('../../../lib/iview/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            pageTitle: "添加团队"//页面标题
        })
        wx.setNavigationBarTitle({
            title: that.data.pageTitle//设置页面标题
        })
    },

    createTeam: function () {
        console.log("team title", this.data.name)
        wx.cloud.callFunction({
            name: 'CreateTeam',
            data: {name: this.data.name},
            success: res => {
                this.setData({
                    name: res?.result?.data.name || []
                })
                wx.switchTab({
                    url: '/pages/team/team'
                })
            },
            fail: err => {
                console.log(err)
            }
        })
    },

    inputChangeHandle: function (e) {
        this.setData({ name: e.detail.value })
    },

    addTitleHandle: function (e) {
        this.setData({
            name: this.detail.value
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