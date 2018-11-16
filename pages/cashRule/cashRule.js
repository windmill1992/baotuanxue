// pages/cashRule/cashRule.js
const app = getApp().globalData;
const api = {
	fee: app.baseUrl + '/btx/btx-rest/fee',			//获取手续费
}
Page({
  data: {
		fee: 0,
  },
  onLoad: function (options) {
		this.getData();
  },
	getData: function () {
		wx.request({
			url: api.fee,
			method: 'GET',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200) {
					let f = res.data.resultData * 100;
					this.setData({ fee: f });
				} else {
					if (res.data.resultMsg) {
						wx.showToast({
							title: res.data.resultMsg,
							icon: 'none'
						});
					} else {
						wx.showToast({
							title: '服务器错误',
							icon: 'none'
						});
					}
				}
			},
			fail: () => {
				wx.showToast({
					title: '未知异常',
					icon: 'none'
				});
			}
		})
	}
})