const util = require('../../utils/util.js')


Page({

  data: {
    logs: [],
    StartX: '0',
    StartY: '0',
    leftLooks: '',
    topLooks: '',
    //半径
    radius: '60',
    angle: '',
    //posX:'',
    //posY:''

  },

  onLoad: function () {
    var self = this;
    const query = wx.createSelectorQuery()
    query.select('.pic_tou').boundingClientRect(function(res){
      self.data.StartX = res.left + res.width / 2; // #the-id 节点的上边界坐标（相对于显示区域） 
      self.data.StartY = res.top + res.height / 2; // #the-id 节点的上边界坐标（相对于显示区域） 
      // self.data.leftLooks = self.data.StartX
      // self.data.topLooks = self.data.StartY
    })
    query.selectViewport().scrollOffset(function(res){
      res.scrollTop // 显示区域的竖直滚动位置
    })
    query.exec()
  },


  //摇杆点击事件
  ImageTouch: function (e) {
    console.log("点击")
  },

  //拖动摇杆移动
  ImageTouchMove: function (e) {
    var self = this;
    //e.touches[0].clientX是触碰的位置，需要减40使得图片中心跟随触碰位置
    var touchX = e.touches[0].clientX;
    var touchY = e.touches[0].clientY;
    var movePos = self.GetPosition(touchX, touchY);
    //console.log("接触坐标：(" + touchX + "," + touchY + ")");
    // console.log("图片坐标：("+movePos.posX + "," + movePos.posY+")");
    
    self.setData({
      // leftLooks: movePos.posX,
      // topLooks: movePos.posY
      leftLooks: movePos.posX,
      topLooks: movePos.posY
    })
  },

  //松开摇杆复原
  ImageReturn: function (e) {
    var self = this;
    self.setData({
      // leftLooks: self.data.StartX,
      // topLooks: self.data.StartY,
      leftLooks: '',
      topLooks: '',
      angle: ""
    })
  },

  //获得触碰位置并且进行数据处理获得触碰位置与拖动范围的交点位置
  GetPosition: function (touchX, touchY) {
    var self = this;
    var DValue_X;
    var Dvalue_Y;
    var Dvalue_Z;
    var imageX;
    var imageY;
    var ratio;
    // DValue_X = touchX - self.data.StartX;
    // Dvalue_Y = touchY - self.data.StartY;
    DValue_X = touchX - self.data.StartX;
    Dvalue_Y = touchY - self.data.StartY;
    Dvalue_Z = Math.sqrt(DValue_X * DValue_X + Dvalue_Y * Dvalue_Y);
    self.GetAngle(DValue_X, Dvalue_Y)
    //触碰点在范围内
    if (Dvalue_Z <= self.data.radius) {
      // imageX = touchX;
      // imageY = touchY;
      imageX = DValue_X;
      imageY = Dvalue_Y;
      imageX = Math.round(imageX);
      imageY = Math.round(imageY);
      return { posX: imageX, posY: imageY };
    }

    //触碰点在范围外
    else {

      ratio = self.data.radius / Dvalue_Z;
      imageX = DValue_X * ratio;
      imageY = Dvalue_Y * ratio;
      imageX = Math.round(imageX);
      imageY = Math.round(imageY);
      return { posX: imageX, posY: imageY };

    }
  },

  //获取角度
  GetAngle: function (DValue_Y, Dvalue_X) {
    var self = this;
    if (DValue_Y != 0) {
      var angleTan = Dvalue_X / DValue_Y;
      var ang = Math.atan(angleTan);

      var angs = ang * 180 / 3.14;
      var result = Math.round(angs);
      self.setData({
        angle: result
      })
    }

  }
})