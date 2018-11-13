// pages/funds/funds.js
const app = getApp().globalData;
const api = {
	waterList: app.baseUrl + '/btx/btx-rest/capital-water-list',			//资金流水
};
const util = require('../../utils/util.js');
Page({
	data: {
		hasmore: -1,
		list: [],
	},
	onLoad: function (options) {
		this.page = 1;
		this.getData();
	},
	getData: function () {
		wx.request({
			url: api.waterList,
			method: 'GET',
			header: app.header,
			data: {
				pageIndex: this.page,
				pageSize: 20,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					if (this.page == 1) {
						this.setData({ list: [] });
					}
					let m = 0;
					if (r.total == 0) {
						m = 0;
					} else if (r.total <= this.page * 20) {
						m = 1;
					} else {
						m = 2;
					}
					r.list = r.list == null ? [] : r.list;
					for (let v of r.list) {
						v.createTime = util.formatTime(new Date(v.createTime), '-');
					}
					this.setData({ list: [...this.data.list, ...r.list], hasmore: m });
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
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
		this.page = 1;
		this.getData();
	},
	onReachBottom: function () {
		if (this.data.hasmore != 2) return;
		this.page++;
		this.getData();
	},
})