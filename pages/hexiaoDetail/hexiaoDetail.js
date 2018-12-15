// pages/hexiaoDetail/hexiaoDetail.js
const app = getApp().globalData;
const api = {
	orderInfo: app.baseUrl + '/btx/btx-rest/writeOff-order-info',		//核销订单详情
	fee: app.baseUrl + '/btx/btx-rest/fee',													//获取手续费
};
const util = require('../../utils/util.js');
Page({
	data: {
		fee: 0,
	},
	onLoad: function (options) {
		if (options.id && options.gid && options.uid) {
			this.setData({ id: options.id, gid: options.gid, uid: options.uid, title: options.name });
			this.getData();
			this.getFee();
		} else {
			wx.showModal({
				title: '',
				content: '参数错误',
				showCancel: false,
				success: res => {
					if (res.confirm) {
						wx.reLaunch({
							url: '/pages/index/index',
						})
					}
				}
			})
		}
	},
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		let dd = this.data;
		wx.request({
			url: api.orderInfo + '?groupBuyingId=' + dd.id + '&groupId=' + dd.gid + '&buyUserId=' + dd.uid,
			method: 'POST',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					r.createTime = util.formatTime(new Date(r.createTime), '-');
					this.setData({ info: r });
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
	getFee: function () {
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
	},
})