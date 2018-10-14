// pages/ucenter/ucenter.js
Page({
  data: {
		showTel: false,
  },
  onLoad: function (options) {
		
  },
	onShow: function () {
		let user = wx.getStorageSync('user');
		if (user && wx.getStorageSync('userId')) {
			this.setData({ userInfo: user });
		} else {
			wx.redirectTo({
				url: '/pages/login/login',
			})
		}
	},
	showBox: function () {
		this.setData({ showTel: true });
	},
	closeTel: function () {
		this.setData({ showTel: false });
	},
})