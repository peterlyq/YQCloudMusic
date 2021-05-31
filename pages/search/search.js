// pages/search/search.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'',
    hotList:[],
    flag:false,
    showSearch:false,
    songList:[],
    searchContent:"",
    historyList:[],//搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initialData();
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
  initialData(){
    request("/search/default","get",{},(data)=>{
      if(data.code == 200){
        let placeholder = data.data.showKeyword;
        this.setData({
          placeholder
        })
      }
    })
    request("/search/hot/detail","get",{},(data)=>{
      if(data.code ==200){
        let hotList = data.data;
        this.setData({
          hotList
        })
      }
    })
    let historyList = wx.getStorageSync('historyList');
    if(historyList){
      historyList = JSON.parse(wx.getStorageSync('historyList'));
      console.log(historyList)
      this.setData({
        historyList
      })
    }
  },
  handleInput(event){
    let content = event.detail.value.trim();
    clearTimeout(this.timer)
      if(content){
        this.setData({
          showSearch:true
        })
         this.timer = setTimeout(()=>{
          this.getsearchList(content);
        },300)
        this.setData({
          flag:true
        })
    }else{
      this.setData({
        showSearch:false
      })
    }

  },
  getsearchList(content){
    request("/search","get",{keywords:content},(data)=>{
      let songList = data.result.songs.splice(0,10);
      let historyList = this.data.historyList;
      let index = historyList.indexOf(content);
      if(index!==-1){
        historyList.splice(index,1)
      }
      historyList.unshift(content);
      this.setData({
        flag:false,
        searchContent:content,
        songList,
        historyList
      })
      wx.setStorageSync("historyList",JSON.stringify(historyList))
    })
  },
  clearSearchContent(){
    console.log(this.data.searchContent)
    this.setData({
      searchContent:"",
      showSearch:false

    })
  },
  clearHistoryList(){
    wx.showModal({
      content: '是否清空历史记录？',
      success:(res)=>{
        if(res.confirm){
          this.setData({
            historyList:[]
          })
          wx.removeStorage({
            key: 'historyList',
          })
        }
      }
    })
    
  },
  searchOne(e){
  let searchContent = e.target.id;
    this.setData({
      showSearch:true
    })
    this.getsearchList(searchContent)
  }
})