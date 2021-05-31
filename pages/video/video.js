// pages/video/video.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId:"",
    triggered:false,//下拉刷新是否被触发
    videoId:"",
    videoList:[],
    videoUpdateTime:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cookie = wx.getStorageSync('cookie')
    if(!cookie){
      wx.showToast({
        title: '请先登录',
        success:()=>{
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 1000);
        }
      })
    }
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
    this.getNavData()
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
    setTimeout(() => {
    console.log("下拉刷新")
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触底了")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    console.log(from)
  },

  getNavData(){
    request("/video/group/list","get",{},(data)=>{
      this.setData({
        videoGroupList:data.data.slice(0,14),
        navId:data.data[0].id
      })
      this.getVideoList(this.data.navId)
    })
  },
  handleTap(e){
    let navId = e.currentTarget.id
    this.setData({
      navId
    })
    this.getVideoList(this.data.navId)
  },
  getVideoList(id){
    request("/video/group","get",{
      id
    },(data)=>{
      if(data.code == 200){
        this.setData({
          videoList:data.datas.slice(0,14),
          // navId:data.datas[0].id
        })
        setTimeout(()=>{
          this.setData({
          triggered:false
          })
        },300)
      }else if(data.code == 301){
       
      }
    })
  },
  /***播放或继续播放**/
  handlePlay(event){
    let vid = event.currentTarget.id
    // this.videoContext && this.videoContext.stop();
    this.setData({
      videoId:vid
    })
    this.videoContext = wx.createVideoContext(vid);
    let result = this.data.videoUpdateTime.find(item=>item.id == vid)
    if(result){
        this.videoContext.seek(result.time);
    }else{
      this.videoContext.play();
    }
  },
  handlerUpdateTime(event){
    let videoTimeObj = {
      id:event.currentTarget.id,
      time:event.detail.currentTime
    }
    let result = this.data.videoUpdateTime.find(item=>item.id == videoTimeObj.id)
    if(result){
        result.time = videoTimeObj.time
    }else{
      this.data.videoUpdateTime.push(videoTimeObj)
    }
  },
  // scrollView的下拉刷新
  handlePullFresh(event){
    this.getVideoList(this.data.navId)
  },
  // scrollView的上拉触底
  handleToLower(event){
    let videoList = [...this.data.videoList]
    videoList = this.data.videoList.concat(videoList)
    this.setData({
      videoList
    })
  },
  toSearchPage(){
    wx.navigateTo({
      url: '/pages/search/search'
      
    })
  }
})