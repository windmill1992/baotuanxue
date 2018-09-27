// pages/detail/detail.js
Page({
  data: {
		showShare: false,
  },
  onLoad: function (options) {

  },
	share: function () {
		this.setData({ showShare: true });
	},
	closeShare: function () {
		this.setData({ showShare: false });
	},
  onShareAppMessage: function () {

  }
})