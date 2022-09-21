const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const wxBLE = {
  data: {
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    _deviceId: '',
    _serviceId: '',
    _characteristicId: '',
    // canWrite: false,
    writer: {
      deviceId: '',
      serviceId: '',
      characteristicId: '',
    }
  },
  writeBLECharacteristicValue: function (msgSend) {
    var msgLen = msgSend.length
    var msgLenBuffer = new ArrayBuffer(4);
    new DataView(msgLenBuffer).setUint32(0, msgLen)
    var buffer = stringToBytes(String.fromCharCode(233) + String.fromCharCode.apply(null, new Uint8Array(msgLenBuffer) ) + msgSend)

    // console.log("发送数据：", buffer)
    let dataView = new DataView(buffer)
    // dataView.setUint8(0, Math.random() * 255 | 0)
    // console.log("发送chsID：" +  this.data.writer.characteristicId)
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.writer.serviceId,
      characteristicId: this.data.writer.characteristicId,
      value: buffer,
      complete: res => {
        // this.setData({
        //   shuju: res
        // })
      }
    })
  }
}

module.exports = {
  formatTime,
  wxBLE
}

// 字符串转byte
function stringToBytes(str) {
  var array = new Uint8Array(str.length);
  for (var i = 0, l = str.length; i < l; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
}