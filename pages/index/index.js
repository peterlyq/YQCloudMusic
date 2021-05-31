// pages/index/index.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//轮播图数据
    recommondList:[],//推荐数据
    topList:[],//排行榜数据
    recommondObj:{
      title:"推荐歌曲",
      text:"为你精心推荐",
      button:"查看更多"
    },
    topObj:{
      title:"排行榜",
      text:"热歌风向标",
      button:"查看更多"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },
  init(){
    request("/banner","get",{type:1},(data)=>{
      this.setData({
        bannerList:data.banners
      })
    })
    request("/personalized","get",{limit:10},(data)=>{
      this.setData({
        recommondList:data.result
      })
    })
    let resArr = [],taskList=[];
    for(let i=0;i<5;i++){
     taskList.push(this.getTopData(i))
    }
    //用户体验较差，但是性能更优 看需求取舍了 在调接口的地方this.setData就会快一些
    Promise.all(taskList).then(data=>{
      this.setData({
        topList:data
      })
    })
    
  },
  getTopData(index){
    return new Promise((resolve,reject) => {
      request("/top/list","get",{idx:index},(data)=>{
        let obj = {
          name:data.playlist.name,
          tracks:data.playlist.tracks.slice(0,3)
        }
        resolve(obj)
      })
    })
  },
  routerToRecommend(event){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    })
  },
  toOtherPage(){
    wx.navigateTo({
      url: '/practicePackage/pages/practice/practice',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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