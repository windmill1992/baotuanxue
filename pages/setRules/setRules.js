// pages/setRules/setRules.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
	getValue: function (e) {
		let p = e.currentTarget.dataset.prop;
		this.setData({ [p]: e.detail.value });
	},
	submit: function () {

	},
})