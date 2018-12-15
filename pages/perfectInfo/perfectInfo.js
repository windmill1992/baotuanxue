// pages/perfectInfo/perfectInfo.js
const app = getApp().globalData;
const api = {
	upload: app.baseUrl + '/btx/btx-rest/upload',								//上传图片
	save: app.baseUrl + '/btx/btx-rest/save-user-extend-info',	//保存门店信息
	storeInfo: app.baseUrl + '/btx/btx-rest/merchant-info',			//获取门店信息
}
Page({
  data: {
		info: {},
		indust: [
			['艺术·兴趣', '技能', '语言', '资格证书', '学业辅导'],
			[],
		],
		industArr: [
			['舞蹈', '声乐', '器乐', '瑜伽', '跆拳道', '空手道', '泰拳', '其他'],
			['IT', '设计', '后期', '会计', '其他'],
			['英语', '小语种', '托福', '雅思', '其他'],
			['教师资格证', '人力资源', '其他'],
			['小学', '初中', '高中', '成考', '其他'],
		],
		industValue: [0, 0],
  },
  onLoad: function (options) {
		if (options.edit) {
			wx.setNavigationBarTitle({
				title: '编辑门店信息',
			});
			this.setData({ edit: 1 });
			this.getData();
		}
		this.setData({ ['indust[1]']: this.data.industArr[0] });
  },
	onShow: function () {
		let src = wx.getStorageSync('uploadSrc');
		if (src) {
			this.uploadImg(src);
			wx.removeStorageSync('uploadSrc');
		}
	},
	getData: function () {
		wx.showLoading({
			title: '加载中...',
		});
		wx.request({
			url: api.storeInfo + '?businessUserId='+ app.header.userId,
			method: 'POST',
			header: app.header,
			data: {},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					this.setData({
						logoUrl: r.logo,
						name: r.merchantName,
						industry: r.merchantIndustry,
						region: r.city,
						detailAddr: r.address,
						linkman: r.linkMan,
						mobile: r.linkMobile,
						wxId: r.linkWechat,
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
				})
			},
			complete: () => {
				wx.hideLoading();
			}
		})
	},
	upload: function () {
		wx.chooseImage({
			count: 1,
			success: res => {
				let url = res.tempFilePaths[0];
				wx.navigateTo({
					url: '/pages/upload/upload?rect=1&src='+ url,
				})
			},
		})
	},
	uploadImg: function (url) {
		wx.showLoading({
			title: '正在上传...',
		});
		const task = wx.uploadFile({
			url: api.upload + '?picType=1',
			filePath: url,
			name: 'file',
			formData: {
				userId: app.header.userId
			},
			success: res2 => {
				let r = JSON.parse(res2.data);
				if (r.resultCode == 200 && r.resultData) {
					wx.showToast({
						title: '上传成功！',
					});
					this.setData({ logoUrl: r.resultData });
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
				wx.hideLoading();
				wx.showToast({
					title: '上传失败！',
					icon: 'none',
				})
				console.log(err);
			}
		});
		
		task.onProgressUpdate(res3 => {
			if (res3.progress >= 100) {
				wx.hideLoading();
			}
		})
	},
	getValue: function (e) {
		let p = e.currentTarget.dataset.prop;
		if (p == 'industry') {
			this.setData({ [p]: this.data.indust[e.detail.value] });
		} else {
			this.setData({ [p]: e.detail.value });
		}
	},
	getIndustryCol: function (e) {
		let i = e.detail.column;
		if (i == 0) {
			let j = e.detail.value;
			this.setData({ ['indust[1]']: this.data.industArr[j], industValue: [j, 0] });
		}
	},
	getIndustry: function (e) {
		let v = e.detail.value;
		let s = this.data.indust[0][v[0]] + ' ' + this.data.indust[1][v[1]];
		this.setData({ industry: s });
	},
	submit: function () {
		let dd = this.data;
		if (!dd.logoUrl || !dd.name || !dd.industry || !dd.region || !dd.detailAddr || !dd.linkman || !dd.mobile || !dd.wxId) {
			this.showError('信息还没有填写完成哦，不能保存~');
			return;
		}
		if (!/^(13[0-9]|14[579]|15[0-3,5-9]|166|17[0135678]|18[0-9]|19[89])\d{8}$/.test(dd.mobile)) {
			this.showError('手机号格式不正确!');
			return;
		}
		if (!/^[a-zA-Z0-9]{1}[-_a-zA-Z0-9]{5,19}$/.test(dd.wxId)) {
			this.showError('微信号格式不正确!');
			return;
		}
		if (dd.edit == 1) {
			wx.showModal({
				title: '提示',
				content: '修改门店信息需要重新审核，是否确认修改？',
				success: result => {
					if (result.confirm) {
						this.submit2();
					}
				}
			})
		} else {
			this.submit2();
		}
	},
	submit2: function () {
		let dd = this.data;
		let data = {
			logo: dd.logoUrl,
			merchantName: dd.name,
			merchantIndustry: dd.industry,
      city: dd.region[0] + dd.region[1] + dd.region[2],
			address: dd.detailAddr,
			linkMan: dd.linkman,
			linkMobile: dd.mobile,
			linkWechat: dd.wxId,
			userId: app.header.userId,
		};
		wx.showLoading({
			title: '正在保存...',
		});
		wx.request({
			url: api.save,
			method: 'POST',
			header: app.header,
			data: data,
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					wx.showToast({
						title: '提交成功！',
					});
					setTimeout(() => {
						wx.reLaunch({
							url: '/pages/success/success',
						})
					}, 1000);
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
	},
})