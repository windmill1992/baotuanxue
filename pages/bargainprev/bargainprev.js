// pages/bargainprev/bargainprev.js
const app = getApp().globalData;
const api = {
	orderInfo: app.baseUrl + '/btx/btx-rest/group-buying-info', 		//拼团信息
};
const util = require('../../utils/util.js');
Page({
  data: {
		user: {},
		showShare: false,
		canIUse: false,
  },
  onLoad: function (options) {
		if (options.id) {
			let user = wx.getStorageSync('user');
			this.setData({ id: options.id, user: user, r: wx.getSystemInfoSync().windowWidth / 375 });
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
          let r = res.data.resultData;
          let d = false;
          let s = false;
          for (let v of r.groupBuyingExtendInfoVOList) {
            if (v.url) {
              d = true;
              break;
            }
          }
          if (r.courseStartTime) {
            s = true;
          }
          this.setData({ info: r, haspic: d, showContent: s });
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
	getProp: function (e) {
		this.setData({
			imgW: 690,
			imgH: 388,
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
			let r = dd.r;
			let w = 750 * r;
			let h = 1190 * r;
			let imgX = (w - dd.imgW * r) / 2;
			let ctx = wx.createCanvasContext('cv', that);
			let str = dd.info.merchantName + '发起了一个拼团';

			ctx.beginPath();
			ctx.setFillStyle('#ffffff');
			ctx.fillRect(0, 0, w, h);
			ctx.closePath();

			ctx.beginPath();
			ctx.drawImage(avatar, imgX, 40 * r, 58 * r, 58 * r);
			ctx.setFillStyle('#333333');
			ctx.setFontSize(26 * r);
			if (ctx.measureText) {
				util.changeLine(str, ctx, 118 * r, 75 * r, 36, 600 * r);
			} else {
				if (str.length > 20) {
					ctx.fillText(str.substr(0, 20), 118 * r, 65 * r);
					ctx.fillText(str.substr(20), 118 * r, 105 * r);
				} else {
					ctx.fillText(str, 118 * r, 75 * r);
				}
			}
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

			ctx.draw(false, setTimeout(() => {
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
			}, 200));
		}
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
			// v.groupBuyingEndTimeShow -= 60000;
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