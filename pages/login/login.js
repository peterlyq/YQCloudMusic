// pages/login/login.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    password:""
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

  handleInput(e){
    // 小程序传参的方式ID和自定义属性data-XX 通过e.target.id和e.target.dataset.type接收  自定义属性适用于多参场景
    this.setData({
      [e.target.dataset.type]:e.detail.value
     })

  },
  handleLogin(){
    let {phone,password} = {...this.data}
    if(!phone){
      wx.showToast({
        title: '号码不能为空',
        icon:"none"
      })
      return
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '号码格式不正确',
        icon:"none"
      })
      return
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:"none"
      })
      return
    }
    request("/login/cellphone","get",{phone,password},(data)=>{
      if(data.code === 200){
        wx.showToast({
          title: "登陆成功！",
        })
        wx.setStorageSync('userInfo', JSON.stringify(data.profile))
        wx.switchTab({
          url: '/pages/personal/personal',
        })
      }else{
        wx.showToast({
          title:data.msg,
          icon:"none"
        })
      }
    })
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