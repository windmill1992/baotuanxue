// pages/newbargain/newbargain.js
const app = getApp().globalData;
const api = {
	upload: app.baseUrl + '/btx/btx-rest/upload',										//上传
	orderInfo: app.baseUrl + '/btx/btx-rest/bargain-course-info', 	//砍价信息
	saveOrder: app.baseUrl + '/btx/btx-rest/save-bargain-course',			//保存砍价
	delImg: app.baseUrl + '/btx/btx-rest/delete',										//删除图片
};
Page({
  data: {
		imgs: [['', '', ''], ['', '', ''], ['', '', '']],
		nameLen: 0,
  },
  onLoad: function (options) {
    this.setData({startTime: this.getCurrentDate() });
		if (options.id) {
      this.setData({ id: options.id });
			wx.setNavigationBarTitle({
				title: '编辑砍价',
			});
			this.getData();
		}
  },
	onShow: function () {
		if (wx.getStorageSync('bargainsaveSuc') == 1) {
      wx.removeStorageSync('bargainsaveSuc');
			wx.navigateBack();
			return;
		}
		let src = wx.getStorageSync('uploadSrc');
		if (src) {
			this.upload(src);
			wx.removeStorageSync('uploadSrc');
			wx.removeStorageSync('choose');
		} else {
			if (wx.getStorageSync('upload') == 1 && wx.getStorageSync('choose') != 1) {
				this.setData({ tempImg: null });
				wx.removeStorageSync('upload');
			}
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
				needBargainCourseExtendInfo: true,
        needSaleRecordInfo: false,
			},
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					let r = res.data.resultData;
					let arr = [];
					for (let v of r.bargainCourseExtendInfoVOList) {
						arr.push(v.url);
					}
					this.setData({
						cover: r.cover,
						proName: r.proName,
            proPrice: r.proPrice,
            maxBargainTime: r.maxBargainTime,
            maxBargainPrice: r.maxBargainPrice,
            courseStartTime: r.courseStartTime,
            courseMaxStudents: r.courseMaxStudents,
            courseCount: r.courseCount,
            courseInfo: r.courseInfo,
            courseDesc: r.courseDesc,
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
  getValue: function (e) {
    let p = e.currentTarget.dataset.prop;
    this.setData({ [p]: e.detail.value });
  },
	getName: function (e) {
		this.setData({ proName: e.detail.value, nameLen: e.detail.value.length });
	},
	uploadImg: function (e) {
		if (this.data.tempImg && this.data.tempImg != null) {
			this.showError('请等待图片上传...');
			return;
		}
		let n = e.currentTarget.dataset.name;
		let it = e.currentTarget.dataset.it;
		let its = e.currentTarget.dataset.its;
		wx.chooseImage({
			count: 1,
			success: res => {
				this.setData({ tempImg: {
					n: n, it: it, its: its,
				} });
				let url = res.tempFilePaths[0];
				wx.setStorageSync('upload', 1);
				wx.setStorageSync('choose', 1);
				wx.navigateTo({
					url: '/pages/upload/upload?src='+ url,
				})
			},
			fail: () => {
				console.log('cancel');
				this.setData({ tempImg: null });
			}
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
						this.setData({ ['imgs[' + (tmp.it - 1) + '][' + tmp.its + ']']: dt.resultData });
					}
					this.setData({ tempImg: null });
				} else {
					this.setData({ tempImg: null });
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
				this.setData({ tempImg: null });
				wx.showToast({
					title: '未知异常！',
					icon: 'none',
				});
				console.log(err);
			}
		})

		task.onProgressUpdate(res3 => {
			if (res3.progress >= 100) {
				wx.hideLoading();
			}
		})
	},
  preview: function () {
    let dd = this.data;
    if (!dd.cover || !dd.proName || !dd.proPrice || !dd.maxBargainTime
      || !dd.maxBargainPrice || !dd.courseStartTime || !dd.courseMaxStudents || !dd.courseCount
      || !dd.courseInfo || !dd.courseDesc) {
      wx.setStorageSync('bargainComplete', 0);
    }else{
      wx.setStorageSync('bargainComplete', 1);
    }
    let obj = {
      cover: dd.cover,
      proName: dd.proName,
      proPrice: dd.proPrice,
      maxBargainTime: dd.maxBargainTime,
      maxBargainPrice: dd.maxBargainPrice,
      courseStartTime: dd.courseStartTime,
      courseMaxStudents: dd.courseMaxStudents,
      courseCount: dd.courseCount,
      courseInfo: dd.courseInfo,
      courseDesc: dd.courseDesc,
      bargainCourseExtendInfoVOList: [
        { introType: 1, text: '', url: dd.imgs[0][0] },
        { introType: 1, text: '', url: dd.imgs[0][1] },
        { introType: 1, text: '', url: dd.imgs[0][2] },
        { introType: 2, text: '', url: dd.imgs[1][0] },
        { introType: 2, text: '', url: dd.imgs[1][1] },
        { introType: 2, text: '', url: dd.imgs[1][2] },
        { introType: 3, text: '', url: dd.imgs[2][0] },
        { introType: 3, text: '', url: dd.imgs[2][1] },
        { introType: 3, text: '', url: dd.imgs[2][2] },
      ],
      bargainCourseId: 0,
      bargainCourseStatus: 1,
      userId: app.header.userId,
    }
    wx.setStorage({
      key: 'saveBargainObj',
      data: obj,
      success: () => {
        wx.navigateTo({
          url: '/pages/bargainprev/bargainprev',
        })
      }
    })
  },
	submit: function () {
		let dd = this.data;
    if (!dd.cover || !dd.proName || !dd.proPrice || !dd.maxBargainTime
      || !dd.maxBargainPrice || !dd.courseStartTime || !dd.courseMaxStudents || !dd.courseCount 
      || !dd.courseDesc) {
			this.showError('请填写完整信息！');
			return;
		}
    if (dd.proPrice <= dd.maxBargainPrice) {
      this.showError('最多砍价钱数不能大于等于原价！');
      return;
    }
		let data = Object.assign({
			cover: dd.cover,
      proName: dd.proName,
      proPrice: dd.proPrice,
      maxBargainTime: dd.maxBargainTime,
      maxBargainPrice: dd.maxBargainPrice,
      courseStartTime: dd.courseStartTime,
      courseMaxStudents: dd.courseMaxStudents,
      courseCount: dd.courseCount,
      courseInfo: dd.courseInfo,
      courseDesc: dd.courseDesc,
			bargainCourseExtendInfoVOList: [
				{ introType: 1, text: '', url: dd.imgs[0][0] },
				{ introType: 1, text: '', url: dd.imgs[0][1] },
				{ introType: 1, text: '', url: dd.imgs[0][2] },
				{ introType: 2, text: '', url: dd.imgs[1][0] },
				{ introType: 2, text: '', url: dd.imgs[1][1] },
				{ introType: 2, text: '', url: dd.imgs[1][2] },
				{ introType: 3, text: '', url: dd.imgs[2][0] },
				{ introType: 3, text: '', url: dd.imgs[2][1] },
				{ introType: 3, text: '', url: dd.imgs[2][2] },
			],
			bargainCourseId: 0,
			bargainCourseStatus: 1,
			userId: app.header.userId,
		});
		wx.showLoading({
			title: '正在提交...',
		});
		wx.request({
			url: api.saveOrder,
			method: 'POST',
			header: app.header,
			data: data,
			success: res => {
				if (res.data.resultCode == 200 && res.data.resultData) {
					wx.showToast({
						title: '提交成功！',
					});
          wx.setStorageSync('bargainsaveSuc', 1);
					wx.redirectTo({
            url: '/pages/bargainprevsub/bargainprevsub?id=' + res.data.resultData,
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
	delImg: function (e) {
		const dd = this.data;
		wx.showModal({
			title: '提示',
			content: '确定删除该图片吗？',
			success: result => {
				if (result.confirm) {
					let { it, its } = e.currentTarget.dataset;
					wx.request({
						url: api.delImg + '?picType=1&fileName=' + dd.imgs[it - 1][its],
						method: 'POST',
						header: app.header,
						data: {},
						success: res => {
							if (res.data.resultCode == 200 && res.data.resultData) {
								let arr = this.data.imgs;
								arr[it - 1].splice(its, 1);
								arr[it - 1].push('');
								this.setData({ imgs: arr });
								wx.showToast({
									title: '删除成功',
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
					})
				}
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
  getCurrentDate:function(){
    const date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].join("-");
  }
})