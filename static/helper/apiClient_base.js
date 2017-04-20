import config from '../../config'
import apiClient from './apiClient.js'
import storage from 'simplestorage.js'

let baseDomain = process.env.NODE_ENV === 'production' ? config.build.env.base_domain : config.dev.env.base_domain

// 登陆验证接口
function baseAuth (user, success, error) {
  apiClient('POST', baseDomain + '/auth', user, function (data) {
    if (success) {
      success(data)
    }
  }, function (errdata) {
    if (error) {
      error(errdata)
    }
  })
}

const loginOut = function (token,successCallback,errorCallback) {
  apiClient('DELETE', baseDomain + '/auth', {
  	'auth': token
  },function(data){
  	if(successCallback){
  		successCallback(data)
  	}
  },function(data){
  	if(errorCallback){
  		successCallback
  	}
  })
}

const switchHotel = function (token,hotelid,successCallback,errorCallback) {
  apiClient('PUT', baseDomain + '/auth', {
  	'hotelid': hotelid
  },function(data){
  	if(successCallback) {
  		successCallback(data)
  	}
  },function(data){
  	if(errorCallback) {
  		errorCallback(data)
  	}
  })
}

const uploadDevice = function (userid,ostype,cid,devicetoken,appversion,successCallback,errorCallback) {
  apiClient('POST', baseDomain + '/app/uploadDevice', {
  	'userid': userid,
  	'ostype': ostype,
  	'cid': cid,
  	'appversion': appversion,
  	'devicetoken': devicetoken
  },function(data){
  	if(successCallback) {
  		successCallback(data)
  	}
  },function(data){
  	if(errorCallback) {
  		errorCallback(data)
  	}
  })
}

export {
  baseAuth,
  loginOut,
  switchHotel,
  uploadDevice
}

export default baseAuth

