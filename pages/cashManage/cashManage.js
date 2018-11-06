// pages/cashManage/cashManage.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
	noopen: function () {
		wx.showModal({
			title: '提示',
			content: '暂未开放',
			showCancel: false,
		})
	},
})