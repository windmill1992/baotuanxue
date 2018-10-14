// pages/manage/manage.js
const app = getApp().globalData;
const api = {
	orderList: app.baseUrl + '/btx/btx-rest/group-buying-list',		//拼团列表
}
Page({
	data: {
		tab: 0,
		hasmore: -1,
		list: [],
	},
	onLoad: function (options) {
		this.page = 1;
		this.getData();
	},
	getData: function () {
		let dd = this.data;
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.orderList,
			method: 'POST',
			header: app.header,
			data: {
				groupBuyingStatus: +dd.tab + 1,
				pageIndex: this.page,
				pageSize: 10,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					if (this.page == 1) {
						this.setData({ list: [] });
					}
					let m = r.hasNextPage ? 2 : 1;
					if (r.total == 0) {
						m = 0;
					}
					r.list = r.list == null ? [] : r.list;
					this.setData({ list: [...dd.list, ...r.list], hasmore: m });
					this.countdown();
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
	changeTab: function (e) {
		let t = e.currentTarget.dataset.tab;
		this.setData({ tab: t });
		this.page = 1;
		this.getData();
	},
	countdown: function () {
		let f = this.setTime();
		let timer = setInterval(() => {
			f = this.setTime();
			if (!f) clearInterval(timer);
		}, 60000);
	},
	setTime: function () {
		let arr = this.data.list;
		let f = false;
		for (let v of arr) {
			let t = v.groupBuyingEndTimeShow;
			let n = Date.now();
			let d = t - n;
			if (d > 1000) {
				f = true;
			}
			let hh = Number.parseInt(d / 1000 / 60 / 60);
			let mm = Number.parseInt(d / 1000 / 60 % 60);
			v.time = [hh, '小时', mm, '分'].join('');
			v.groupBuyingEndTimeShow -= 60000;
		}
		this.setData({ list: arr });
		return f;
	},
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
		this.page = 1;
		this.getData();
	},
	onReachBottom: function () {
		if (this.hasmore != 2) return;
		this.page++;
		this.getData();
	},
})