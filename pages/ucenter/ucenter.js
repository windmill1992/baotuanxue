// pages/ucenter/ucenter.js
Page({
  data: {
		showTel: false,
  },
  onLoad: function (options) {

  },
	showBox: function () {
		this.setData({ showTel: true });
	},
	closeTel: function () {
		this.setData({ showTel: false });
	},
})