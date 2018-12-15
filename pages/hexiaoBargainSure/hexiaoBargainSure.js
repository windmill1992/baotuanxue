// pages/hexiaoSure/hexiaoSure.js
const app = getApp().globalData;
const api = {
	orderInfo: app.baseUrl + '/btx/btx-rest/bargain-writeOff-order-info',		//核销订单详情
  hexiao: app.baseUrl + '/btx/btx-rest/bargain-writeOff-order',						//核销订单
}
Page({
  data: {

  },
  onLoad: function (options) {
		if (options.id && options.bid && options.uid) {
			this.setData({ id: options.id, bid: options.bid, uid: options.uid });
			this.getData();
		}
  },
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		let dd = this.data;
		wx.request({
			url: api.orderInfo + '?bargainCourseId=' + dd.id + '&bargainId=' + dd.bid + '&buyUserId=' + dd.uid,
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
	submit: function () {
		let dd = this.data;
		wx.showLoading({
			title: '正在提交...',
		});
		wx.request({
			url: api.hexiao + '?bargainCourseId=' + dd.id + '&bargainId=' + dd.bid + '&buyUserId=' + dd.uid,
			method: 'POST',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					wx.navigateTo({
						url: `/pages/hexiaoSuc/hexiaoSuc`,
					})
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
})