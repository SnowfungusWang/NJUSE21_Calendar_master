export const login = () => {
    const hasUserInfo = wx.getStorageSync('hasUserInfo');
    if (!hasUserInfo) {
        wx.cloud.callFunction({
            name: "GetUserInfo",
            data: {},
            success: res => {
                if (res.result.data.length === 0) {
                    try {
                        wx.setStorageSync('hasUserInfo', false)
                    } catch (e) { }
                    finally {
                        wx.reLaunch({ url: "/pages/userCenter/userCenter" })
                    }
                } else {
                    const usr = res.result.data[0]
                    try {
                        wx.setStorageSync('hasUserInfo', true)
                        wx.setStorageSync('nickName', usr.nickName)
                        wx.setStorageSync('userId', usr.userId)
                        wx.setStorageSync('userIcon', usr.userIcon)
                    } catch (e) { }
                    this.setData({
                        userId: usr.userId,
                    })
                }
            },
            fail: err => {
                console.log("err", err);
            }
        })
    }


}