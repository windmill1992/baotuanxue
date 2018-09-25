// pages/login/login.js
Page({
  data: {
  
  },
  onLoad: function (options) {
		if (options.from) {
			this.setData({ froms: options.from });
		}
  },
	getUserInfo: function (e) {
		if (e.detail.userInfo) {
			this.setData({ userInfo: e.detail.userInfo });
		}
	}
})