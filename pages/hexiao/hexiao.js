// pages/hexiao/hexiao.js
const app = getApp().globalData;
const api = {
	hexiao: app.baseUrl + '/btx/btx-rest/writeOff-order',		//核销订单
}
Page({
  data: {

  },
  onLoad: function (options) {

  },
	scan: function () {
		wx.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode'],
			success: res => {
				console.log(res);
				let r = JSON.parse(res.result);
				wx.navigateTo({
					url: `/pages/hexiaoSure/hexiaoSure?id=${r.groupBuyingId}&gid=${r.groupId}&uid=${r.userId}`,
				})
			}
		})
	}
})