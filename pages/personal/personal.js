// pages/personal/personal.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX:"",
    startY:"",
    moveY:"",
    coverTransfer:"",
    userInfo:{},
    recentlyPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  handTouchStart(e){
    this.setData({
      startX:e.touches[0].clientX,
      startY:e.touches[0].clientY,
      coverTransfer:""
    })
  },
  handTouchMove(e){
    let moveY = e.touches[0].clientY - this.data.startY;
    moveY > 80 ? 80 :moveY
    if(moveY > 0){
      this.setData({
        moveY:`translateY(${moveY}rpx)`
      })
    }
    
  },
  handTouchEnd(e){
    this.setData({
      moveY:"translateY(0)",
      coverTransfer:"transform .5s linear"
    })
  },
  // login methods
  toLogin(){
    if(this.data.userInfo.avatarUrl){
      console.log("已登录")
      return false;
    }
    wx.navigateTo({
      url: '/pages/login/login',
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  //get recently played list
  getRecentPlayList(){
    let uid = this.data.userInfo.userId
    request("/user/record","get",{uid,type:0},(data)=>{
      if(data.code === 200){
        let recentlyPlayList = data.allData.slice(0,10)
        this.setData({
          recentlyPlayList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //get user info from storage
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      },()=>{
        this.getRecentPlayList()
      })
    }else{
      this.setData({
        userInfo:{},
        recentlyPlayList:[]
      })
    }
  },

  // https://music.163.com/weapi/v1/play/record?csrf_token=ede496a107a6be8ec71fc3205809c461
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})