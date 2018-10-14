// pages/helper/helper.js
const app = getApp().globalData;
Page({
  data: {

  },
  onLoad: function (options) {

  },
	cantact: function () {
		wx.makePhoneCall({
			phoneNumber: app.serviceMobile,
		})
	},
})