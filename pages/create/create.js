// pages/create/create.js
const app = getApp().globalData;
const api = {
	upload: app.baseUrl + '/btx/btx-rest/upload',
	orderInfo: app.baseUrl + '/btx/btx-rest/order-info', 		//拼团信息
};
Page({
  data: {
		groupBuyingType: 1,
		imgs: ['', '', ''],
		nameLen: 0,
  },
  onLoad: function (options) {
		if (options.id) {
			this.setData({ id: options.id });
			wx.setNavigationBarTitle({
				title: '编辑拼团',
			});
			this.getData();
		}
  },
	onShow: function () {
		let src = wx.getStorageSync('uploadSrc');
		if (src) {
			this.upload(src);
			wx.removeStorageSync('uploadSrc');
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
				orderId: this.data.id,
				needGroupBuyingExtendInfo: true,
				needSaleRecordInfo: false,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					let arr = [];
					for (let v of r.groupBuyingExtendInfoVOList) {
						arr.push(v.url);
					}
					this.setData({
						cover: r.cover,
						proName: r.proName,
						proCount: r.proCount,
						groupBuyingType: r.groupBuyingType,
						imgs: arr,
						nameLen: r.proName.length,
					})
					this.setData({ info: res.data.resultData });
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
	getName: function (e) {
		this.setData({ proName: e.detail.value, nameLen: e.detail.value.length });
	},
	getType: function (e) {
		this.setData({ groupBuyingType: e.detail.value });
	},
	getNum: function (e) {
		this.setData({ proCount: e.detail.value });
	},
	uploadImg: function (e) {
		let n = e.currentTarget.dataset.name;
		let it = e.currentTarget.dataset.it;
		this.setData({ tempImg: {
			n: n, it: it,
		} });
		wx.chooseImage({
			count: 1,
			success: res => {
				let url = res.tempFilePaths[0];
				wx.navigateTo({
					url: '/pages/upload/upload?src='+ url,
				})
			},
		})
	},
	upload: function (url) {
		wx.showLoading({
			title: '正在上传...',
		});
		const task = wx.uploadFile({
			url: api.upload + '?picType=1',
			filePath: url,
			name: 'file',
			formData: {
				userId: app.header.userId,
			},
			success: res2 => {
				let dt = JSON.parse(res2.data);
				if (dt.resultCode == 200 && dt.resultData) {
					wx.showToast({
						title: '上传成功！',
					});
					let tmp = this.data.tempImg;
					if (tmp.n) {
						this.setData({ [tmp.n]: dt.resultData });
					} else if (tmp.it) {
						this.setData({ ['imgs[' + (tmp.it - 1) + ']']: dt.resultData });
					}
				} else {
					if (dt.resultMsg) {
						wx.showToast({
							title: dt.resultMsg,
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
				console.log(err);
			}
		})

		task.onProgressUpdate(res3 => {
			if (res3.progress >= 100) {
				wx.hideLoading();
			}
		})
	},
	next: function () {
		let dd = this.data;
		let obj = {
			cover: dd.cover,
			proName: dd.proName,
			proCount: dd.proCount,
			groupBuyingType: dd.groupBuyingType,
			groupBuyingExtendInfoVOList: [
				{ introType: 1, text: '', url: dd.imgs[0]},
				{ introType: 2, text: '', url: dd.imgs[1]},
				{ introType: 3, text: '', url: dd.imgs[2]},
			]
		}
		wx.setStorageSync('saveObj', obj);
		wx.navigateTo({
			url: '/pages/setRules/setRules',
		})
	}, 
	touchStart(e) {
		this.wecropper.touchStart(e)
	},
	touchMove(e) {
		this.wecropper.touchMove(e)
	},
	touchEnd(e) {
		this.wecropper.touchEnd(e)
	}

})