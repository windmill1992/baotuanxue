//app.js
App({
  onLaunch: function () {
    let prod = wx.getStorageSync('prod100');
		if (prod != 1) {
			wx.clearStorageSync();
			wx.setStorageSync('prod100', 1);
		}
		if (wx.getUpdateManager) {
			const updateManager = wx.getUpdateManager();
			updateManager.onCheckForUpdate(res => {
				if (res.hasUpdate) {
					updateManager.onUpdateReady(() => {
						wx.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: res => {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate()
								}
							}
						})
					})
					updateManager.onUpdateFailed(() => {
						// 新的版本下载失败
						wx.showModal({
							title: '提示',
							content: '下载失败！',
							showCancel: false
						})
					})
				}
			})
		}
  },
  globalData: {
		baseUrl: 'https://api.baotuanxue.com',
		header: {
			// 'content-type': 'application/x-www-form-urlencoded',
			'content-type': 'application/json',
			'applicationId': 2,
			'userId': -1,
			'buildVersion': '100',
		},
		serviceMobile: '010-80339994',
  }
})