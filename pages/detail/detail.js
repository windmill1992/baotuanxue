// pages/detail/detail.js
const app = getApp().globalData;
const api = {
	orderInfo: app.baseUrl + '/btx/btx-rest/group-buying-info', 		//拼团信息
}
Page({
  data: {
		user: {},
		showShare: false,
  },
  onLoad: function (options) {
		if (options.id) {
			let user = wx.getStorageSync('user');
			this.setData({ id: options.id, user: user });
			this.getData();
		} else {
			wx.redirectTo({
				url: '/pages/index/index',
			})
		}
  },
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.orderInfo,
			method: 'POST',
			header: app.header,
			data: {
				groupBuyingId: this.data.id,
				needGroupBuyingExtendInfo: true,
				needSaleRecordInfo: false,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					let d = false;
					for (let v of r.groupBuyingExtendInfoVOList) {
						if (v.url) {
							d = true;
							break;
						}
					}
					this.setData({ info: r, haspic: d });
					if (r.groupBuyingStatus == 1) {
						this.countdown();
					}
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
				})
			},
			complete: () => {
				wx.hideLoading();
			}
		})
	},
	countdown: function () {
		let f = this.setTime();
		this.timer = setInterval(() => {
			f = this.setTime();
			if (!f) clearInterval(this.timer);
		}, 60000);
	},
	setTime: function () {
		let v = this.data.info;
		let f = false;
		let t = v.groupBuyingEndTimeShow;
		let n = Date.now();
		let d = t - n;
		if (d > 1000) {
			f = true;
			let hh = Number.parseInt(d / 1000 / 60 / 60);
			let mm = Number.parseInt(d / 1000 / 60 % 60);
			v.time = [hh, '小时', mm, '分'].join('');
			v.groupBuyingEndTimeShow -= 600000;
		} else {
			v.groupBuyingStatus = 3;
		}
		this.setData({ info: v });
		return f;
	},
	share: function () {
		this.setData({ showShare: true });
	},
	closeShare: function () {
		this.setData({ showShare: false });
	},
	onUnload: function () {
		clearInterval(this.timer);
	},
})