// pages/cashManage/cashManage.js
const app = getApp().globalData;
const api = {
	balance: app.baseUrl + '/btx/btx-rest/user-can-withdraw-balance',		//用户可提现余额
};
Page({
  data: {

  },
  onLoad: function (options) {

  },
	onShow: function () {
		this.getData();
	},
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.balance,
			method: 'GET',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200) {
					this.setData({ balance: res.data.resultData });
				} else {
					if (res.data.resultMsg) {
						wx.showToast({
							title: res.data.resultMsg,
							icon: 'none',
						})
					} else {
						wx.showToast({
							title: '服务器错误！',
							icon: 'none',
						})
					}
				}
			},
			fail: err => {
				wx.showToast({
					title: '未知异常！',
					icon: 'none',
				})
			},
			complete: () => {
				wx.hideLoading();
			}
		})
	},
	noopen: function () {
		wx.showModal({
			title: '提示',
			content: '请联系客服提现',
			showCancel: false,
		})
	},
})