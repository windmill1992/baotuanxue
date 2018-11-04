// pages/setRules/setRules.js
const app = getApp().globalData;
const api = {
	saveOrder: app.baseUrl + '/btx/btx-rest/save-group-buying',			//保存拼团
}
const util = require('../../utils/util.js');
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
		let dd = this.data;
		if (!dd.groupBuyingNumber || !dd.time || !dd.proPrice || !dd.groupBuyingPrice){
			this.showError('请填写完整信息！');
			return;
		}
		if (dd.groupBuyingNumber <= 1) {
			this.showError('拼团人数至少为2人！');
			return;
		}
		let obj = wx.getStorageSync('saveObj');
		let t = util.formatTime(new Date(Date.now() + dd.time * 60 * 60 * 1000), '-');
		let data = Object.assign({
			groupBuyingNumber: dd.groupBuyingNumber,
			groupBuyingEndTime: t,
			groupBuyingEndTimeShow: dd.time,
			proPrice: dd.proPrice,
			groupBuyingPrice : dd.groupBuyingPrice,
			groupBuyingId: 0,
			groupBuyingStatus: 1,
			userId: app.header.userId,
		}, obj);
		console.log(data);
		wx.showLoading({
			title: '正在提交...',
		});
		wx.request({
			url: api.saveOrder,
			method: 'POST',
			header: app.header,
			data: data,
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					wx.showToast({
						title: '提交成功！',
					});
					wx.removeStorageSync('saveObj');
					wx.setStorageSync('saveSuc', 1);
					wx.redirectTo({
						url: '/pages/pubSuc/pubSuc?id='+ res.data.resultData,
					})
				} else {
					if (res.data.resultMsg) {
						wx.showToast({
							title: res.data.resultMsg,
							icon: 'none',
						})
					} else {
						wx.showToast({
							title: '服务器开了小差，请稍后再试！',
							icon: 'none',
						})
					}
				}
			},
			fail: err => {
				wx.showToast({
					title: '未知异常！',
					icon: 'none',
				});
				console.log(err);
			},
			complete: () => {
				wx.hideLoading();
			}
		})
	},
	showError: function (txt) {
		const that = this;
		let obj = {};
		obj.show = true;
		obj.title = txt;
		this.setData({ error: obj });
		setTimeout(function () {
			obj.show = false;
			obj.title = '';
			that.setData({ error: obj });
		}, 2000);
	}
})