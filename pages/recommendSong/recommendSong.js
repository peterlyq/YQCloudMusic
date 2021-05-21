// pages/recommendSong/recommendSong.js
import request from "../../utils/request"
import Pubsub from "pubsub-js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:"",//天
    month:"",//月
    index:0,//选中音乐的下标
    songList:[], //歌曲列表
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

    this.initDate();
    this.getMusicData();

    // 订阅songDetail的事件
    Pubsub.subscribe("switchType",(msg,type)=>{
      let {index,songList} = this.data
      if(type == "pre"){
       (index == 0) && (index = songList.length);
          index --
      }else if(type == "next"){
        if(index == this.data.songList.length - 1 ){
          index = -1
        }
        index ++
      }else if(type == "random"){
         index = Math.floor(Math.random()*this.data.songList.length)
      }
      this.setData({
        index
      })
      let musicId = songList[index].id
      Pubsub.publish("getMusicIdFromRecommend",musicId)
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

  },

  initDate(){
    var date = new Date()
    this.setData({
      day:date.getDate()<10?'0'+date.getDate():date.getDate(),
      month:date.getMonth()<9?'0'+(date.getMonth()+1):date.getMonth()
    })
  },
  getMusicData(){
    request("/recommend/songs","get",{},(data)=>{
      console.log(data)
      if(data.code == 200){
        let songList = data.recommend;
        this.setData({
          songList
        })
      }else{
        wx.showToast({
          title:data.msg,
          icon:"error"
        })
      }
    })
  },
  toMusicDetail(event){
    let {song,index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    // 小程序传参长度有限制，多得截取掉
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId='+song.id,
    })
  }
})