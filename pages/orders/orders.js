// pages/orders/orders.js
Page({
	data: {
		tab: 0,
		hasmore: -1,
		list: [],
		hasNet: false,
	},
	onLoad: function (options) {
		this.page = 1;
		this.getData();
	},
	getData: function () {

	},
	changeTab: function (e) {
		let t = e.currentTarget.dataset.tab;
		this.setData({ tab: t });
	},
	onPullDownRefresh: function () {
		this.page = 1;
		this.getData();
	},
	onReachBottom: function () {

	},
})