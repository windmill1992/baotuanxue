// pages/cashRecord/cashRecord.js
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
		})
		wx.hideLoading();
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