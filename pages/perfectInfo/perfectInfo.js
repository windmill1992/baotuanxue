// pages/perfectInfo/perfectInfo.js
Page({
  data: {
		
  },
  onLoad: function (options) {
		if (options.id) {
			wx.setNavigationBarTitle({
				title: '编辑门店信息',
			})
		}
  },
	getValue: function (e) {
		let p = e.currentTarget.dataset.prop;
		this.setData({ [p]: e.detail.value });
	},
	submit: function () {
		let dd = this.data;
		if (!dd.logoUrl) {
			this.showError('信息还没有填写完成哦，不能保存~');
			return;
		}
		if (!dd.name) {
			return;
		}
		if (!dd.industry) {
			return;
		}
		if (!dd.region) {
			return;
		}
		if (!dd.detailAddr) {
			return;
		}
		if (!dd.uname) {
			return;
		}
		if (!dd.mobile) {
			return;
		}
		if (!dd.wxId) {
			return;
		}

	},
	showToast: function (txt) {
		const that = this;
		let obj = {};
		obj.show = true;
		obj.title = txt;
		this.setData({ toast: obj });
		setTimeout(function () {
			obj.show = false;
			obj.title = '';
			that.setData({ toast: obj });
		}, 2000);
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