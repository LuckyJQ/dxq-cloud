export default class ImageExample {
  palette(obj) {
    console.log('obj is', obj)
    return ({
      width: obj.imgWidth,
      height: obj.imgHeight,
      background: obj.bg,
      views: [
        {
          type: 'image',
          url: '/images/logo-color.png',
          css: {
            width: obj.width,
            height: obj.height,
            top: obj.top,
            left: obj.left
          },
        }
      ]
    })
  }
}