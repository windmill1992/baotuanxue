// pages/orderDetail/orderDetail.js
const app = getApp().globalData;
const api = {
	orderInfo: app.baseUrl + '/btx/btx-rest/order-info', 		//订单信息
}
Page({
  data: {
		info: {},
		state: '',
  },
  onLoad: function (options) {
		if (options.id) {
			this.setData({ id: options.id });
			this.getData();
		} else {
			wx.redirectTo({
				url: '/pages/orders/orders',
			})
		}
  },
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.orderInfo,
			method: 'GET',
			header: app.header,
			data: {
				groupId: this.data.id,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					r.income = Number.parseFloat(r.groupBuyingPrice * r.groupBuyingNumber).toFixed(2);
					this.setData({ info: r });
					if (r.orderStatus == 1) {
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
		let timer = setInterval(() => {
			f = this.setTime();
			if (!f) clearInterval(timer);
		}, 60000);
	},
	setTime: function () {
		let v = this.data.info;
		let f = false;
		let t = v.groupBuyingEndTime;
		let n = Date.now();
		let d = t - n;
		if (d > 1000) {
			f = true;
		}
		let hh = Number.parseInt(d / 1000 / 60 / 60);
		let mm = Number.parseInt(d / 1000 / 60 % 60);
		v.time = [hh, '小时', mm, '分'].join('');
		v.groupBuyingEndTime -= 60000;
		this.setData({ info: v });
		return f;
	},
})