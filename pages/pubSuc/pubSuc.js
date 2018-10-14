// pages/pubSuc/pubSuc.js
const app = getApp().globalData;
const api = {
	orderInfo: app.baseUrl + '/btx/btx-rest/group-buying-info', 		//拼团信息
}
Page({
  data: {
		info: {},
		showShare: false,
  },
  onLoad: function (options) {
		if (options.id) {
			let user = wx.getStorageSync('user');
			this.setData({ id: options.id, user: user });
			this.getData();
		} else {
			wx.redirectTo({
				url: '/pages/index/index',
			})
		}
  },
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.orderInfo,
			method: 'POST',
			header: app.header,
			data: {
				groupBuyingId: this.data.id,
				needGroupBuyingExtendInfo: true,
				needSaleRecordInfo: false,
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
	toDetail: function () {
		wx.navigateTo({
			url: '/pages/detail/detail?id='+ this.data.id,
		})
	},
	share: function () {
		this.setData({ showShare: true });
	},
	closeShare: function () {
		this.setData({ showShare: false });
	},
})