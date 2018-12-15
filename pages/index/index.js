//index.js
const app = getApp().globalData;
const api = {
	indexData: app.baseUrl + '/btx/btx-rest/index-data',			//用户信息
	state: app.baseUrl + '/btx/btx-rest/merchant-stauts',			//获取门店审核状态
}
Page({
  data: {
		info: {},
  },
  onLoad: function () {
    
  },
	onShow: function () {
		let userId = wx.getStorageSync('userId');
		if (!userId) {
			wx.redirectTo({
				url: '/pages/login/login',
			})
		} else {
			app.header.userId = userId;
			this.getState();
		}
	},
  getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.indexData,
			method: 'GET',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					this.setData({ info: res.data.resultData });
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
	getState: function () {
		wx.request({
			url: api.state,
			method: 'GET',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					this.setData({ states: r });
					if (r == 2) {
						this.getData();
					} else if (r == 1 || r == 3) {
						wx.reLaunch({
							url: '/pages/helper/helper',
						})
					}
				} else if (res.data.resultCode == 2002) {
					wx.reLaunch({
						url: '/pages/perfectInfo/perfectInfo',
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
	scan: function () {
		wx.scanCode({
			onlyFromCamera: true,
			scanType: ['qrCode'],
			success: res => {
				console.log(res);
				if (res && typeof res.result == 'string') {
					try {
						let r = JSON.parse(res.result);
            let url = "";
            if (r.businessType == '1') {//拼团
              url = `/pages/hexiaoSure/hexiaoSure?id=${r.groupBuyingId}&gid=${r.groupId}&uid=${r.userId}`;
            } else {//砍价
              url = `/pages/hexiaoBargainSure/hexiaoBargainSure?id=${r.bargainCourseId}&bid=${r.bargainId}&uid=${r.userId}`;
            }
						wx.navigateTo({
							url: url,
						})
					} catch (err) {
						console.log(err);
						wx.showModal({
							title: '错误提示',
							content: '请确认扫描正确的核销码！',
						})
					}
				}
			},
			fail: () => {
				// wx.navigateBack();
			}
		})
	},
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
		this.getData();
	}
})
