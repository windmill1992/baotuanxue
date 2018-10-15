// pages/userInfo/userInfo.js
const app = getApp().globalData;
const api = {
	userInfo: app.baseUrl + '',				//用户信息
}
Page({
  data: {
		
  },
  onLoad: function (options) {
		if (options.id) {
			this.setData({ id: id });
			this.getData();
		}
  },
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.orderInfo,
			method: 'GET',
			header: app.header,
			data: {
				userId: this.data.id,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					this.setData({ info: res.data.resultData });
				} else {
					if (res.data.resultMsg) {
						wx.showToast({
							title: res.data.resultMsg,
							icon: 'none',
						})
					} else {
						wx.showToast({
							title: '服务器开了小差，请稍后再试！',
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
	contact: function () {
		wx.makePhoneCall({
			phoneNumber: this.data.info.mobile,
		})
	},
})