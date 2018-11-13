// pages/cashManage/cashManage.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
	noopen: function () {
		wx.showModal({
			title: '提示',
			content: '请联系客服提现',
			showCancel: false,
		})
	},
})