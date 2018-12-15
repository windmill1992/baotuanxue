// pages/setRules/setRules.js

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
	next: function () {
		let dd = this.data;
    if (!dd.proName || !dd.groupBuyingNumber || !dd.time || !dd.proPrice || !dd.groupBuyingPrice){
			this.showError('请填写完整信息！');
			return;
		}
		if (dd.groupBuyingNumber <= 1) {
			this.showError('拼团人数至少为2人！');
			return;
		}
		let t = util.formatTime(new Date(Date.now() + dd.time * 60 * 60 * 1000), '-');
		let obj = {
      proName: dd.proName,
			groupBuyingNumber: dd.groupBuyingNumber,
			groupBuyingEndTime: t,
			groupBuyingEndTimeShow: new Date(t),
			proPrice: dd.proPrice,
			groupBuyingPrice: dd.groupBuyingPrice,
		}
		// wx.setStorageSync('saveObj', obj);
		wx.setStorage({
			key: 'saveObj',
			data: obj,
			success: () => {
				wx.navigateTo({
					url: '/pages/create/create',
				})
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