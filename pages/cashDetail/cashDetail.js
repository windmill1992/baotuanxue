// pages/cashDetail/cashDetail.js
const app = getApp().globalData;
const api = {
	cashInfo: app.baseUrl + '/btx/btx-rest/withdraw-info',			//提现记录
};
const util = require('../../utils/util.js');
Page({
  data: {

  },
  onLoad: function (options) {
		if (options.id) {
			this.setData({ id: options.id });
			this.getData();
		} else {
			wx.redirectTo({
				url: '/pages/cashRecord/cashRecord',
			})
		}
  },
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.cashInfo,
			method: 'GET',
			header: app.header,
			data: {
				withdrawId: this.data.id,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					r.money = parseFloat(r.capital * 0.95).toFixed(2);
					r.applyTime = util.formatTime(new Date(r.applyTime), '-');
					r.payTime = util.formatTime(new Date(r.payTime), '-');
					this.setData({ info: res.data.resultData });
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
	}
})