// pages/success/success.js
Page({
  data: {
		edit: false,
  },
  onLoad: function (options) {
		if (options.edit) {
			this.setData({ edit: true });
		}
  },
	know: function () {
		wx.navigateBack({
			delta: -1,
		})
	},
})