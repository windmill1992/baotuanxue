// pages/cashRecord/cashRecord.js
const app = getApp().globalData;
const api = {
	cashList: app.baseUrl + '/btx/btx-rest/withdraw-list',			//提现记录
};
const util = require('../../utils/util.js');
Page({
  data: {
		tab: 0,
		list: 0,
		hasmore: -1,
  },
  onLoad: function (options) {
		this.page = 1;
		this.getData();
  },
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		let dd = this.data;
		wx.request({
			url: api.cashList,
			method: 'GET',
			header: app.header,
			data: {
				pageIndex: this.page,
				pageSize: 10,
				status: dd.tab,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					if (this.page == 1) {
						this.setData({ list: [] });
					}
					let m = r.hasNextPage ? 2 : 1;
					r.list = r.list == null ? [] : r.list;
					if (r.total == 0) {
						m = 0;
					}
					for (let v of r.list) {
						v.applyTime = util.formatTime(new Date(v.applyTime), '-');
					}
					this.setData({ list: [...dd.list, ...r.list], hasmore: m });
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
	changeTab: function (e) {
		let t = e.currentTarget.dataset.tab;
		this.setData({ tab: t });
		this.page = 1;
		this.getData();
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