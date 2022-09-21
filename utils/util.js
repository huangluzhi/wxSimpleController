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
  },
  writeBLECharacteristicValue: msgSend => {
    var buffer = stringToBytes(msgSend)
    console.log("发送数据：", buffer)
    let dataView = new DataView(buffer)
    dataView.setUint8(0, Math.random() * 255 | 0)
    console.log("发送服务码：" +  this.wxBLE.data._characteristicId)
    wx.writeBLECharacteristicValue({
      deviceId: this.wxBLE.data._deviceId,
      serviceId: this.wxBLE.data._serviceId,
      characteristicId: this.wxBLE.data._characteristicId,
      value: buffer,
      complete: res => {
        this.wxBLE.data.setData({
          shuju: res
        })
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
  console.log(array);
  return array.buffer;
}