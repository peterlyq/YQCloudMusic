import config from "./config"

export default (url,method="GET",data={},cb)=>{
  // wx.showLoading({
  //   title: '正在加载',
  // })
  wx.request({
    url: config.baseUrl+url,
    method:method,
    data:data,
    header:{
      cookie:wx.getStorageSync("cookie")?wx.getStorageSync("cookie"):""
    },
    success:(data)=>{
      // wx.hideLoading({
      //   success: (res) => {},
      // })
      if(data.cookies.length > 0 && url == '/login/cellphone'){
        let cookie = data.cookies.filter(item=>{
          return item.startsWith("MUSIC_U")
        })
        wx.setStorageSync('cookie', ...cookie)
      }
      
      cb(data.data)
    },
    fail:(err)=>{
      wx.hideLoading({
        success: (res) => {},
      })
      cb(err)
    },
    
  })
}