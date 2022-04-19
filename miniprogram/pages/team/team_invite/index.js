// miniprogram/pages/team/team_invite/index.js
const { $Message } = require('../../../lib/iview/base/index');
import { login } from '../../../utils/common'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: '',
        userIcon: '',
        nickName: '',
        logged: false,
        visible: false,
        actions: [
            {
                name: '取消'
            },
            {
                name: '确认',
                color: '#ed3f14',
                loading: false
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        var that = this;
        that.setData({
            pageTitle: "加入团队"//页面标题
        })
        wx.setNavigationBarTitle({
            title: that.data.pageTitle//设置页面标题
        })
        // 拉取用户id
        login();
        const userId = wx.getStorageSync('userId');
        console.log(userId)
        this.setData({
            userId: userId,
            visible: true,
            teamId: options.teamId
        })
    },

    onGetUserInfo: function (e) {
        if (!this.data.logged) {
            this.setData({
                logged: true,
            })
        }
        // 授权成功，拉取信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                logged: true,
                                avatarUrl: res.userInfo.avatarUrl,
                                nickName: res.userInfo.nickName
                            })
                        }
                    })
                }
            }
        })
        // 创建user
        wx.cloud.callFunction({
            name: 'CreateUser',
            data: {
                nickName: this.data.nickName,
                avatarUrl: this.data.avatarUrl
            },
            success: res => {
                console.log('创建成功');
            },
            fail: err => {
                console.log(err);
            }
        })
        // 弹出提示框 是否加入
        if (this.data.logged) {
            this.setData({
                visible: true
            })
        }
    },

    // 确认加入团队
    confirmJoin: function ({ detail }) {
        var that = this;
        if (detail.index === 0) {
            this.setData({
                visible: false
            });
        } else {
            const action = [...this.data.actions];
            action[1].loading = true;
            this.setData({
                actions: action
            });
            // 执行加入操作
            wx.cloud.callFunction({
                name: 'AddUsersToTeam',
                data: {
                    teamId: this.data.teamId,
                    users: [
                        that.data.userId
                    ]
                },
                success: res => {
                    // 停止加载样式
                    console.log("add", this.data.teamId, res)
                    action[1].loading = false;
                    that.setData({
                        visible: false,
                        actions: action
                    });
                    $Message({
                        content: '加入成功！',
                        type: 'success'
                    });
                    setTimeout(() => {
                        wx.switchTab({
                            url: '/pages/todo/index'
                        })
                    }, 1000);
                },
                fail: err => {
                    console.log("fail join", err);
                }
            })
        }
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