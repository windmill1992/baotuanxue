// pages/bargainOrderList/bargainOrderList.js
const app = getApp().globalData;
const api = {
  orderList: app.baseUrl + '/btx/btx-rest/bargain-order-list',		//订单列表
}
Page({
  data: {
    tab: 0,
    hasmore: -1,
    list: [],
    hasNet: true,
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
        orderStatus: +dd.tab + 1,
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
          r.list = r.list == null ? [] : r.list;
          if (r.total == 0) {
            m = 0;
          }
          this.setData({ list: [...dd.list, ...r.list], hasmore: m });
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
  changeTab: function (e) {
    let t = e.currentTarget.dataset.tab;
    this.setData({ tab: t });
    this.page = 1;
    this.getData();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.page = 1;
    this.getData();
  },
  onReachBottom: function () {
    if (this.data.hasmore != 2) return;
    this.page++;
    this.getData();
  },
  onUnload: function () {
    clearInterval(this.timer);
  },
  bargainOrderListRefresh: function () {
    this.page = 1;
    this.getData();
  },
})