// pages/withdrawCash/withdrawCash.js
const app = getApp().globalData;
const api = {
	balance: app.baseUrl + '/btx/btx-rest/user-balance',			//用户信息
	withdraw: app.baseUrl + '/btx/btx-rest/withdraw',						//提现申请
};
Page({
  data: {
		over: false,
  },
  onLoad: function (options) {
		
	},
	onShow: function () {
		this.getData();
	},
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.balance,
			method: 'GET',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					this.setData({ balance: res.data.resultData });
				} else {
					if (res.data.resultMsg) {
						wx.showToast({
							title: res.data.resultMsg,
							icon: 'none',
						})
					} else {
						wx.showToast({
							title: '服务器错误！',
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
	getMoney: function (e) {
		let b = e.detail.value;
		let a = b > this.data.balance;
		this.setData({ money: b, over: a });
	},
	all: function () {
		this.setData({ money: this.data.balance });
	},
	getValue: function (e) {
		let p = e.currentTarget.dataset.prop;
		this.setData({ [p]: e.detail.value });
	},
	submit: function () {
		let dd = this.data;
		if (dd.money < 0.01) {
			this.showError('提现金额不得少于100元');
			return;
		}
		if (dd.money > dd.balance) {
			this.showError('余额不足');
			return;
		}
		if (!dd.name || !dd.mobile || !dd.bankNo) {
			this.showError('请填写完整提现信息！');
			return;
		}
		if (!/^(13[0-9]|14[579]|15[0-3,5-9]|166|17[0135678]|18[0-9]|19[89])\d{8}$/.test(dd.mobile)) {
			this.showError('手机号格式不正确!');
			return;
		}
		wx.showModal({
			title: '请确认您的银行卡号：',
			content: `${dd.bankNo}`,
			confirmText: '确定提交',
			cancelText: '返回修改',
			confirmColor: '#00BF4A',
			success: res => {
				if (res.confirm) {
					this.cash();
				}
			}
		})
	},
	cash: function () {
		let dd = this.data;
		wx.showLoading({
			title: '正在提交...',
		});
		wx.request({
			url: api.withdraw,
			method: 'POST',
			header: app.header,
			data: {
				capital: dd.money,
				userName: dd.name,
				mobile: dd.mobile,
				cardNo: dd.bankNo,
				bank: dd.bankInfo,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					wx.showToast({
						title: '申请成功',
					});
					setTimeout(() => {
						wx.navigateTo({
							url: '/pages/cashRecord/cashRecord'
						})
					}, 1000);
				} else {
					if (res.data.resultMsg) {
						this.showError(res.data.resultMsg);
					} else {
						this.showError('服务器错误！');
					}
				}
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
	},
})