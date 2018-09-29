// pages/hexiao/hexiao.js
Page({
  data: {

  },
  onLoad: function (options) {
		wx.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode'],
			success: res => {
				console.log(res);
			}
		})
  },
})