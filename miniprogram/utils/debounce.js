function debounce(func, wait) {

  // 定义唯一的timeout
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    clearTimeout(timeout)
    timeout = setTimeout(function () {
      func.apply(context, args)
    }, wait);
  }
}


module.exports = {
  debounce: debounce
}
