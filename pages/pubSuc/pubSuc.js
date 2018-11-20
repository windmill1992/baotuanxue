// pages/pubSuc/pubSuc.js
const app = getApp().globalData;
const api = {
	orderInfo: app.baseUrl + '/btx/btx-rest/group-buying-info', 		//拼团信息
};
const util = require('../../utils/util.js');
Page({
  data: {
		info: {},
		showShare: false,
		canIUse: false,
  },
  onLoad: function (options) {
		if (options.id) {
			let user = wx.getStorageSync('user');
			this.setData({ id: options.id, user: user });
			this.getData();
			wx.authorize({
				scope: 'scope.writePhotosAlbum',
				success: () => {
					this.setData({ refuseAuth: false });
				},
				fail: () => {
					this.setData({ refuseAuth: true });
				}
			})
			if (wx.canIUse('button.open-type.openSetting')) {
				this.setData({ canIUse: true });
			} else {
				let arr = wx.getSystemInfoSync().SDKVersion.split('.');
				if (arr[0] >= 2 && arr[1] == 0 && arr[2] >= 7) {
					this.setData({ canIUse: true });
				} else {
					this.setData({ canIUse: false });
				}
			}
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
				needSaleRecordInfo: true,
			},
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
	getProp: function (e) {
		this.setData({
			imgW: e.detail.width,
			imgH: e.detail.height
		});
	},
	openSetting: function (e) {
		const that = this;
		if (e.detail.authSetting['scope.writePhotosAlbum']) {
			this.makeShareImg();
		}
	},
	savePhoto: function (path) {
		const that = this;
		wx.getSetting({
			success: res1 => {
				if (!res1.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success: () => {
							wx.saveImageToPhotosAlbum({
								filePath: path,
								success: () => {
									wx.showToast({
										title: '保存成功~',
									})
								}
							})
						},
						fail: () => {
							wx.showModal({
								title: '未授权，无法保存到相册',
								content: '是否授权？',
								cancelColor: '#ff6960',
								confirmColor: '#151419',
								confirmText: '授权',
								success: res => {
									if (res.confirm) {
										wx.openSetting({
											success: res2 => {
												if (res2.authSetting['scope.writePhotosAlbum']) {
													wx.showToast({
														title: '授权成功~'
													})
													setTimeout(function () {
														wx.saveImageToPhotosAlbum({
															filePath: path,
															success: () => {
																wx.showToast({
																	title: '保存成功~'
																})
															}
														})
													}, 1000);
												} else {
													that.showToast('授权失败！')
												}
											}
										})
									}
								}
							})
						}
					})
				} else {
					wx.saveImageToPhotosAlbum({
						filePath: path,
						success: () => {
							wx.showToast({
								title: '保存成功~',
							})
						}
					})
				}
			}
		})
	},
	makeShareImg: function () {
		if (this.data.making) return;
		this.setData({ making: true, showPic: true });
		wx.showLoading({
			title: '正在保存...'
		});
		let dd = this.data;
		let img = dd.info.cover;
		let code = dd.info.shareCodeUrl;
		let avatar = dd.info.merchantAvatar;
		wx.downloadFile({
			url: img,
			success: res => {
				img = res.tempFilePath;
				wx.downloadFile({
					url: code,
					success: res1 => {
						code = res1.tempFilePath;
						wx.downloadFile({
							url: avatar,
							success: res2 => {
								avatar = res2.tempFilePath;
								exec();
							}
						})
					},
					fail: res1 => {
						wx.hideLoading();
						this.setData({ making: false });
						wx.showModal({
							title: '',
							content: JSON.stringify(res1),
							showCancel: false
						})
					}
				})
			},
			fail: res => {
				wx.hideLoading();
				this.setData({ making: false });
				wx.showModal({
					title: '',
					content: JSON.stringify(res),
					showCancel: false
				})
			}
		})
		const that = this;

		function exec() {
			let name = dd.info.proName;
			let r = wx.getSystemInfoSync().windowWidth / 375;
			let w = 750 * r;
			let h = 1190 * r;
			let imgX = (w - dd.imgW * r) / 2;
			imgX = imgX < 0 ? 0 : imgX;
			let ctx = wx.createCanvasContext('cv', that);

			ctx.beginPath();
			ctx.setFillStyle('#ffffff');
			ctx.fillRect(0, 0, w, h);
			ctx.closePath();

			ctx.beginPath();
			ctx.setFillStyle('#333333');
			ctx.setFontSize(26 * r);
			ctx.fillText(dd.info.merchantName + '发起了一个拼团', 118 * r, 75 * r, 600 * r);
			ctx.closePath();

			ctx.beginPath();
			ctx.drawImage(img, imgX, 120 * r, dd.imgW, dd.imgH);
			ctx.closePath();

			ctx.beginPath();
			ctx.setFontSize(36 * r);
			ctx.setTextBaseline('top');
			ctx.setFillStyle('#000000');
			ctx.setTextAlign('left');
			if (ctx.measureText) {
				util.changeLine(name, ctx, imgX, dd.imgH + 148 * r, 45, dd.imgW);
			} else {
				if (name.length > 18) {
					ctx.fillText(name.substr(0, 18), imgX, dd.imgH + 148 * r);
					ctx.fillText(name.substr(18), imgX, dd.imgH + 198 * r);
				} else {
					ctx.fillText(name, imgX, dd.imgH + 198 * r);
				}
			}
			ctx.closePath();

			ctx.beginPath();
			ctx.setFontSize(26 * r);
			ctx.setFillStyle('#666666');
			ctx.fillText('拼团价：' + dd.info.groupBuyingPrice, imgX, dd.imgH + 268 * r);
			ctx.closePath();

			ctx.beginPath();
			ctx.setTextAlign('center');
			ctx.fillText('原价：' + dd.info.proPrice, dd.imgW / 2, dd.imgH + 268 * r);
			ctx.closePath();

			ctx.beginPath();
			ctx.setTextAlign('right');
			ctx.fillText(dd.info.groupBuyingNumber + '人成团', dd.imgW + imgX, dd.imgH + 268 * r);
			ctx.closePath();

			ctx.beginPath();
			ctx.drawImage(code, (w - 280 * r) / 2, h / 2 + 220, 280 * r, 280 * r);
			ctx.closePath();

			ctx.beginPath();
			ctx.setFontSize(28 * r);
			ctx.setTextAlign('center');
			ctx.setFillStyle('#000000');
			ctx.fillText('长按扫码，购买后，邀请好友拼团', w / 2, h - 60);
			ctx.closePath();

			ctx.save();
			ctx.beginPath();
			// ctx.arc(69 * r, 69 * r, 29 * r, 0, Math.PI * 2);
			// ctx.clip();
			ctx.drawImage(avatar, imgX, 40 * r, 58 * r, 58 * r);
			ctx.closePath();
			ctx.restore();

			ctx.draw(true, setTimeout(() => {
				wx.canvasToTempFilePath({
					canvasId: 'cv',
					x: 0,
					y: 0,
					width: w,
					height: h,
					destWidth: 1260,
					destHeight: 2000,
					success: res => {
						wx.hideLoading();
						that.setData({ making: false });
						that.savePhoto(res.tempFilePath);
					},
					fail: res => {
						that.setData({ making: false });
						wx.hideLoading();
					}
				}, that)
			}, 100));
		}
	},
	toDetail: function () {
		wx.navigateTo({
			url: '/pages/detail/detail?id='+ this.data.id,
		})
	},
	share: function () {
		this.setData({ showShare: true });
	},
	closeShare: function () {
		this.setData({ showShare: false });
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
	}
})