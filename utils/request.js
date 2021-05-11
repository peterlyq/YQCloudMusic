import config from "./config"

export default (url,method="GET",data={},cb)=>{
  wx.request({
    url: config.baseUrl+url,
    method:method,
    data:data,
    success:(data)=>{
      cb(data.data)
    },
    fail:(err)=>{
      cb(err)
    },
    
  })
}