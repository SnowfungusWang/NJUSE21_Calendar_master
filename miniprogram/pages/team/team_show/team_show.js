// miniprogram/pages/team/team_show/team_show.js
const { $Message } = require('../../../lib/iview/base/index');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        teamId: '',
        teamTitle: '',
        creatorName: '',
        creatorUserId: '',
        createTime: '',
        members: [],
        disable_invite: false,  // 设置邀请权限
        disable_del: false,  // 设置删除权限
        visible: false,
        actions: [
            {
                name: '取消'
            },
            {
                name: '删除',
                color: '#ed3f14',
                loading: false
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var that = this;
        that.setData({
            pageTitle: "团队信息"//页面标题
        })
        wx.setNavigationBarTitle({
            title: that.data.pageTitle//设置页面标题
        })
        that.setData({
            teamId: options.teamId
        })
        // 拉取团队数据
        wx.cloud.callFunction({
            name: 'GetTeamByTeamId',
            data: {
                teamId: this.data.teamId
            },
            success: res => {
                var tmpData = res.result.data[0];
                this.setData({
                    teamTitle: tmpData.name,
                    createTime: new Date(tmpData.createTime).format('yyyy-MM-dd hh：mm'),
                    creatorUserId: tmpData.creatorUserId,
                    members: tmpData.memberList.length === 1 && tmpData.memberList[0] === null ? [] : tmpData.memberList
                })
                for (var i = 0; i < tmpData.memberList.length; i++) {
                    if (tmpData.memberList[i] !== null && tmpData.memberList[i].userId == tmpData.creatorUserId) {
                        this.setData({
                            creatorName: tmpData.memberList[i].nickName
                        })
                    }
                }
            },
            fail: err => {
                console.log(err);
            }
        })
    },

    // 删除团队
    remove: function () {
        this.setData({
            visible: true
        });
    },

    // 确认删除
    confirmRemove: function ({ detail }) {
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
            // 执行删除操作
            wx.cloud.callFunction({
                name: 'DeleteTeamById',
                data: {
                    teamId: that.data.teamId
                },
                success: res => {
                    // 停止加载样式
                    action[1].loading = false;
                    that.setData({
                        visible: false,
                        actions: action
                    });
                    $Message({
                        content: '删除成功！',
                        type: 'success'
                    });
                    setTimeout(() => {
                        wx.switchTab({
                            url: '/pages/team/team'
                        })
                    }, 1000);
                },
                fail: err => {
                    console.log(err);
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
        return {
            title: this.data.teamTitle + '邀请您的加入',
            path: '/pages/team/team_invite/index?teamId=' + this.data.teamId,
            // imageUrl: '这个是显示的图片，不写就默认当前页面的截图',
            success: function (shareTickets) {
                console.info(shareTickets + '成功');
            },
            fail: function (res) {
                console.log(res + '失败');
            },
        }
    }

})