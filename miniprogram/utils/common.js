export const login = () => {
    const userId = wx.getStorageSync('userId');
    console.log("i am login~", userId === '')
    if (userId === '') {
        wx.cloud.callFunction({
            name: "GetUserInfo",
            data: {},
            success: res => {
                if (res.result.data.length === 0) {
                    try {
                        // wx.setStorageSync('hasUserInfo', false)
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
                }
            },
            fail: err => {
                console.log("err", err);
            }
        })
    }


}