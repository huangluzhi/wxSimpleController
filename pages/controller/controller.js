const util = require('../../utils/util.js')


Page({

  data: {
    intervalEvent: "",
    logs: [],
    StartX: '0',
    StartY: '0',
    CoorX: '0',
    CoorY: '0',
    CoorX_per: '0',
    CoorY_per: '0',
    //半径
    radius: '110',
    angle: '0',
    //posX:'',
    //posY:''
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    balkp: '',
    balkd: '',
    spdkp: '',
    spdki: '',
  },
  
  bleData: {
    speed: '',
    turn: '',
    balkp: '',
    balkd: '',
    spdkp: '',
    spdki: '',
  },

  onLoad: function (arg) {
    let that=this 

    const query = wx.createSelectorQuery()
    query.select('.pic_tou').boundingClientRect(function(res){
      util.wxBLE.data.deviceId = arg._deviceId,
      util.wxBLE.data.writer.serviceId = arg._serviceId,
      util.wxBLE.data.writer.characteristicId = arg._characteristicId,
      that.setData({
        StartX: (res.left + res.width / 2).toFixed(0),
        StartY: (res.top + res.height / 2).toFixed(0),
        deviceId: util.wxBLE.data.deviceId,
        serviceId: util.wxBLE.data.writer.serviceId,
        characteristicId: util.wxBLE.data.writer.characteristicId,
        // deviceId: arg._deviceId,
        // serviceId: arg._serviceId,
        // characteristicId: arg._characteristicId,
      })
    })
    query.selectViewport().scrollOffset(function(res){
      res.scrollTop // 显示区域的竖直滚动位置
    })
    query.exec()
    this.setData({ //给声明的变量interval赋值，每1000毫秒执行一次 
      intervalEvent: setInterval(() => { that.writeLoop() }, 500) 
    }) 
  },

  onUnload() { 
    //页面销毁停止运行 
    let that = this 
    clearInterval(that.data.intervalEvent) 
  },

  writeLoop() {
    console.log('writeloop func run')
    // this.writeBLECharacteristicValue()
    this.bleData.speed = this.data.CoorX_per;
    this.bleData.turn = this.data.CoorY_per;
    this.bleData.balkp = this.data.balkp;
    this.bleData.balkd = this.data.balkd;
    this.bleData.spdkp = this.data.spdkp;
    this.bleData.spdki = this.data.spdki;
    var bleData_str = JSON.stringify(this.bleData);
    util.wxBLE.writeBLECharacteristicValue(bleData_str)
  },
  
  bindKeyInput: function (e) {
    this.data[`${e.currentTarget.dataset.param}`] = e.detail.value
    // this.setData({
    //   [`${e.currentTarget.dataset.param}`]: e.detail.value
    // })
  },
  
  //摇杆点击事件
  ImageTouch: function (e) {
    console.log("点击")
  },

  //拖动摇杆移动
  ImageTouchMove: function (e) {
    
    //e.touches[0].clientX是触碰的位置，需要减40使得图片中心跟随触碰位置
    var touchX = e.touches[0].clientX;
    var touchY = e.touches[0].clientY;
    var movePos = this.GetPosition(touchX, touchY);
    //console.log("接触坐标：(" + touchX + "," + touchY + ")");
    // console.log("图片坐标：("+movePos.posX + "," + movePos.posY+")");
    
    this.setData({
      CoorX: movePos.posX,
      CoorY: movePos.posY,
      CoorX_per: (movePos.posX/this.data.radius*100).toFixed(0),
      // CoorY_per: -(movePos.posY/this.data.radius*100).toFixed(0)
      CoorY_per: (movePos.posY/this.data.radius*100).toFixed(0)
    })
    // this.writeBLECharacteristicValue()
  },

  //松开摇杆复原
  ImageReturn: function (e) {
    
    this.setData({
      // CoorX: this.data.StartX,
      // CoorY: this.data.StartY,
      CoorX: '0',
      CoorY: '0',
      CoorX_per: '0',
      CoorY_per: '0',
      angle: "0"
    })
  },

  //获得触碰位置并且进行数据处理获得触碰位置与拖动范围的交点位置
  GetPosition: function (touchX, touchY) {
    
    var Dvalue_X;
    var Dvalue_Y;
    var Dvalue_Z;
    var imageX;
    var imageY;
    var ratio;
    // Dvalue_X = touchX - this.data.StartX;
    // Dvalue_Y = touchY - this.data.StartY;
    Dvalue_X = touchX - this.data.StartX;
    Dvalue_Y = touchY - this.data.StartY;
    Dvalue_Z = Math.sqrt(Dvalue_X * Dvalue_X + Dvalue_Y * Dvalue_Y);
    this.GetAngle(Dvalue_X, Dvalue_Y)
    //触碰点在范围内
    if (Dvalue_Z <= this.data.radius) {
      // imageX = touchX;
      // imageY = touchY;
      imageX = Dvalue_X;
      imageY = Dvalue_Y;
      imageX = Math.round(imageX);
      imageY = Math.round(imageY);
      return { posX: imageX, posY: imageY };
    }

    //触碰点在范围外
    else {

      ratio = this.data.radius / Dvalue_Z;
      imageX = Dvalue_X * ratio;
      imageY = Dvalue_Y * ratio;
      imageX = Math.round(imageX);
      imageY = Math.round(imageY);
      return { posX: imageX, posY: imageY };

    }
  },

  //获取角度
  GetAngle: function (Dvalue_X, Dvalue_Y) {
    
    if (Dvalue_Y != 0) {
      var angleTan = Dvalue_X / Dvalue_Y;
    // if (Dvalue_Y != 0) {
    // if (Dvalue_X != 0) {
    //   var angleTan = Dvalue_Y / Dvalue_X;
      var ang = Math.atan(angleTan);

      var angs = ang * 180 / 3.14;
      if (Dvalue_X >= 0 && Dvalue_Y >= 0) {
        angs = -180 + angs
      }
      if (Dvalue_X <= 0 && Dvalue_Y >= 0) {
        angs = 180 + angs
      }
      var result = Math.round(angs);
      this.setData({
        angle: result
      })
    }

  }
})