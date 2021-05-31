// pages/songDetail/songDetail.js
import request from "../../../utils/request"
import Pubsub from "pubsub-js"
import Moment from "moment"
var appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//音乐是否正在播放
    songId:'',//歌曲ID
    song:{},//歌曲详情
    musicLink:'',//歌曲URL
    currentTime:'00:00',//当前时间
    duration:'',//总时间
    currentWdith:0,//当前进度条宽度
    mode:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.backgroundAdudioManager = wx.getBackgroundAudioManager();
    
    this.backgroundAdudioManager.onPause(()=>{
     this.changePlayState(false);
    })
    this.backgroundAdudioManager.onPlay(()=>{
      this.changePlayState(true);
      console.log(this.data.songId)
      appInstance.globalData.musicId = this.data.songId;
    })
    this.backgroundAdudioManager.onStop(()=>{
      this.changePlayState(false);
    })
    this.backgroundAdudioManager.onEnded(()=>{
      Pubsub.subscribe("getMusicIdFromRecommend",(msg,songId)=>{
        this.setData({
          songId,
          currentWdith:0,
          currentTime:'00:00',
        })
        this.getMusicData(songId,true);
        Pubsub.unsubscribe("getMusicIdFromRecommend")
      })
      Pubsub.publish("switchType",'next')
    })
    // 监听音乐实时播放
    this.backgroundAdudioManager.onTimeUpdate(()=>{
      if(this.data.songId == appInstance.globalData.musicId){
        let currentTime = Moment(this.backgroundAdudioManager.currentTime * 1000).format("mm:ss")
        let currentWdith = 450*this.backgroundAdudioManager.currentTime/this.backgroundAdudioManager.duration
        this.setData({
          currentTime,
          currentWdith
        })
      }
    })
    let songId = options.songId;
    this.setData({
      songId
    },this.getMusicData(songId))
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId == songId){
      this.setData({
        isPlay:true
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
// 获取音乐信息
  getMusicData(songId,autoPlay){
    request("/song/detail","get",{ids:songId},(data)=>{
      if(data.code == 200 && data.songs.length){
        let duration = Moment(data.songs[0].dt).format("mm:ss")
        this.setData({
          duration
        })
        this.setData({
          song:data.songs[0]
        },this.musicInit(autoPlay))
        wx.setNavigationBarTitle({
          title: data.songs[0].name
        })
      }
    })
  },

  // 播放音乐
  musicPlay(event){
    if(!this.data.musicLink){
      return
    }
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    if(isPlay){
      appInstance.globalData.musicId = this.data.songId;
      this.backgroundAdudioManager.src = this.data.musicLink;
      this.backgroundAdudioManager.title = this.data.song.name;
    }else{
      this.backgroundAdudioManager.pause();
    }
  },
  musicInit(autoPlay){
    request("/song/url","get",{id:this.data.songId},(data)=>{
        let musicLink = data.data[0].url
        this.setData({
          musicLink
        })
        if(autoPlay){
          this.backgroundAdudioManager.title = this.data.song.name;
          this.backgroundAdudioManager.src = musicLink;
          this.setData({
            isPlay:true
          })
        }
    })
  },
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },
  //切歌函数
  handleSwitch(event){
    this.data.isPlay && this.musicPlay();
    if(this.data.mode == 1){
      //顺序播放
      Pubsub.subscribe("getMusicIdFromRecommend",(msg,songId)=>{
        this.setData({
          songId,
        })
        this.getMusicData(songId,true);
        Pubsub.unsubscribe("getMusicIdFromRecommend")
      })
      Pubsub.publish("switchType",event.currentTarget.dataset.type)

    }else if(this.data.mode == 2){
      // 无序播放
      Pubsub.subscribe("getMusicIdFromRecommend",(msg,songId)=>{
        this.setData({
          songId,
        })
        this.getMusicData(songId,true);
        Pubsub.unsubscribe("getMusicIdFromRecommend")
      })
      Pubsub.publish("switchType",'random')
    }else{
      //单曲循环
      this.backgroundAdudioManager.src = this.data.musicLink;
      this.backgroundAdudioManager.title = this.data.song.name;
      this.backgroundAdudioManager.seek(0)
    }
    
  },
  //切换播放模式
  switchModel(){
    let mode = this.data.mode;
    mode = mode>=2?0:++mode;
    this.setData({
      mode
    })
  },
})