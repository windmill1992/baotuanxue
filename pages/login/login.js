// pages/login/login.js
const app = getApp().globalData;
const api = {
	login: app.baseUrl + '/btx/btx-rest/login',
}
Page({
  data: {
		
  },
  onLoad: function (options) {
		if (options.from) {
			this.setData({ froms: options.from });
		}
  },
	login: function (code) {
		let dd = this.data;
		wx.showLoading({
			title: '正在登录...',
		});
		wx.request({
			url: api.login,
			method: 'POST',
			header: app.header,
			data: {
				authType: 0,
				loginMethod: 2,
				userAvatar: dd.userInfo.avatarUrl,
				userNickName: dd.userInfo.nickName,
				wechatCode: code,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					wx.showToast({
						title: '登录成功！',
					});
					let r = res.data.resultData;
					app.header.userId = r.userId;
					wx.setStorageSync('validTime', r.validTime);
					wx.setStorageSync('userId', r.userId);
					setTimeout(() => {
						wx.switchTab({
							url: '/pages/index/index',
						})
					}, 1000);
				} else {
					if (res.data.resultMsg) {
						wx.showToast({
							title: res.data.resultMsg,
							icon: 'none',
						})
					} else {
						wx.showToast({
							title: '服务器开了小差，请稍后再试！',
							icon: 'none',
						})
					}
				}
			},
			fail: err => {
				wx.showToast({
					title: '未知异常！',
					icon: 'none',
				});
				console.log(err);
			},
			complete: () => {
				wx.hideLoading();
			}
		})
	},
	getUserInfo: function (e) {
		if (e.detail.userInfo) {
			this.setData({ userInfo: e.detail.userInfo });
			wx.setStorageSync('user', e.detail.userInfo);
			wx.login({
				success: res => {
					this.login(res.code);
				}
			})
		}
	}
})