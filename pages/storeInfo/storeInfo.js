// pages/storeInfo/storeInfo.js
const app = getApp().globalData;
const api = {
	state: app.baseUrl + '/btx/btx-rest/merchant-stauts',					//获取门店审核状态
	storeInfo: app.baseUrl + '/btx/btx-rest/merchant-info',				//获取门店信息
}
Page({
  data: {
		show: true,
		states: -1,
		info: {},
  },
  onLoad: function (options) {
		
  },
	onShow: function () {
		this.getState();
	},
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.storeInfo + '?businessUserId=' + app.header.userId,
			method: 'POST',
			header: app.header,
			data: {},
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
						wx.setNavigationBarTitle({
							title: '门店信息',
						})
						this.getData();
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
	edit: function () {
		wx.navigateTo({
			url: '/pages/perfectInfo/perfectInfo?id='+ this.data.id,
		})
	},
	contact: function () {
		wx.makePhoneCall({
			phoneNumber: app.serviceMobile,
		})
	},
})