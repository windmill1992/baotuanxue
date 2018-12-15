// pages/success/success.js
const app = getApp().globalData;
const api = {
	state: app.baseUrl + '/btx/btx-rest/merchant-stauts',			//获取门店审核状态
}
Page({
  data: {
		edit: false,
  },
  onLoad: function (options) {
		if (options.edit) {
			this.setData({ edit: true });
		}
  },
	onShow: function () {
		let userId = wx.getStorageSync('userId');
		if (!userId) {
			wx.redirectTo({
				url: '/pages/login/login',
			})
		} else {
			app.header.userId = userId;
			this.getState();
		}
	},
	getState: function () {
		wx.request({
			url: api.state,
			method: 'GET',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					this.setData({ states: r });
					if (r == 2) {
						wx.reLaunch({
							url: '/pages/index/index',
						})
					} else if (r == 1 || r == 3) {
						wx.reLaunch({
							url: '/pages/helper/helper',
						})
					}
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
				});
				console.log(err);
			},
			complete: () => {
				wx.hideLoading();
			}
		})
	},
	know: function () {
		wx.navigateBack({
			delta: -1,
		})
	},
})