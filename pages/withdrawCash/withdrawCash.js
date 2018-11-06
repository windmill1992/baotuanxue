// pages/withdrawCash/withdrawCash.js
Page({
  data: {
		over: true,
  },
  onLoad: function (options) {

  },
	getMoney: function (e) {
		this.setData({ money: e.detail.value });
	},
})