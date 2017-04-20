import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import nprogress from 'nprogress'
import storage from 'simplestorage.js'

nprogress.configure({
  minimum: 0.618,
  speed: 618,
  showSpinner: false
})
let apiClient = function (medthod, urllink, param, successCallback, errorCallback) {
  if (medthod === 'GET') {
    nprogress.start()
    Vue.axios.get(urllink,
      {
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': storage.get('user').authKey || ''
        },
        'params': param
      }).then((response) => {
        nprogress.done()
        if (response.status === 200) {
          if (successCallback) {
            successCallback(response.data)
          }
        }
      }).catch(function (error) {
        nprogress.done()
        if (error.message.indexOf('401') !== -1) {
          window.appRouter.replace('/login')
          return false
        }
        if (errorCallback) {
          errorCallback(error)
        }
      })
  } else if (medthod === 'POST') {
    if(window.plus) window.plus.nativeUI.showWaiting('loading...')
    Vue.axios.post(urllink, JSON.stringify(param), 
    {
    	'headers': {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json',
	      'x-auth-token': (storage.get('user') !== null && storage.get('user') !== undefined) ? storage.get('user').authKey : ''
	    }
    }).then(function (response) {
    	 if(window.plus) window.plus.nativeUI.closeWaiting()
      if (response.status === 200) {
        if (successCallback) {
          successCallback(response.data)
        }
      }
    }).catch(function (error) {
    	if(window.plus) window.plus.nativeUI.closeWaiting()
      if (errorCallback) {
        errorCallback()
      }
    })
  } else if (medthod === 'PUT') {
  	 if(window.plus) window.plus.nativeUI.showWaiting('loading...')
    Vue.axios.put(urllink, JSON.stringify(param), {'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': (storage.get('user') !== null && storage.get('user') !== undefined)? storage.get('user').authKey : ''
    },
    }).then(function (response) {
    	 if(window.plus) window.plus.nativeUI.closeWaiting()
      if (response.status === 200) {
        if (successCallback) {
          successCallback(response.data)
        }
      }
    }).catch(function (error) {
    	if(window.plus) window.plus.nativeUI.closeWaiting()
      if (errorCallback) {
        errorCallback()
      }
    })
  } else if (medthod === 'DELETE') {
  	 if(window.plus) window.plus.nativeUI.showWaiting('loading...')
    Vue.axios.delete(urllink,
    {
    	'headers':{
	      'Accept': 'application/json',
	      'Content-Type': 'application/json',
	      'x-auth-token': (storage.get('user') !== null && storage.get('user') !== undefined) ? storage.get('user').authKey : ''
	    },
	    'params': param
    }).then(function (response) {
    	 if(window.plus) window.plus.nativeUI.closeWaiting()
      if (response.status === 200) {
        if (successCallback) {
          successCallback(response.data)
        }
      }
    }).catch(function (error) {
    	if(window.plus) window.plus.nativeUI.closeWaiting()
      if (errorCallback) {
        errorCallback()
      }
    })
  }
}
export default apiClient
