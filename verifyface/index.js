Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: 'back',
  },
  transferImg(tempImagePath) {
    return new Promise(resolve=>{
      wx.getFileSystemManager().readFile({
        filePath: tempImagePath, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: res => { //成功的回调
          resolve(res)
        }
      })
    })
  },
  chooseImage(e){
    let type = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: async n=> {
        var i = n.tempFilePaths;
        var cardimg = await this.transferImg(i[0]);
        cardimg.errMsg==='readFile:ok' && 
        this.setData({
          [`card${type}`]: "data:image/png;base64,"+cardimg.data,
          [`${type}`]: cardimg.data
        })

      }
    });
  },
  cardverify(){
    wx.request({
      url: 'http://apis.juhe.cn/idimage/verify',
      method: 'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        key: 'b09f5497453600d131c1c624cd863ead',
        side: 'font',
        image: this.data.font
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: async (res) => {
        var tempImagePath = res.tempImagePath;
        console.log(tempImagePath);
        var faceimg = await this.transferImg(tempImagePath)
        debugger
        wx.request({
          url:'http://apis.juhe.cn/verifyface/verify',
          method:'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data:{
            key:'f24ef18a4917bbc300bd768601e8c5b9',
            idcard: '320283199402194416',
            realname:'朱佳育',
            image: faceimg.data
          },
          success:res=>{
            console.log(res)
          },
          fail: err=>{
            console.log(err)
          }
        })

        // wx.uploadFile({
        //   url: ....., //仅为示例，非真实的接口地址
        //   header: {
        //     Cookie: wx.getStorageSync('session_id')
        //   },
        //   filePath: tempImagePath,
        //   name: 'file',
        //   success: (res) => {
        //     wx.hideLoading();
        //     this.setData({ loindisables: false });
        //     var data = res.data
        //     console.log(data)
        //     //do something
        //     wx.showModal({
        //       title: '提示',
        //       content: data,
        //       showCancel: false
        //     })
        //   }
        // })

      }
    })
  }
})