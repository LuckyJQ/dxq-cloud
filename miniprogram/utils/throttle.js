// 节流函数
function throttle(fn, wait) {
  var timer
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, args)
      }, wait)
    }
  }
}

module.exports = {
  throttle: throttle
}
