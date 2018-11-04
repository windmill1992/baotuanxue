// pages/ucenter/ucenter.js
const app = getApp().globalData;
Page({
  data: {
		showTel: false,
		serviceMobile: app.serviceMobile,
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
	call: function () {
		wx.makePhoneCall({
			phoneNumber: app.serviceMobile,
		})
	},
})