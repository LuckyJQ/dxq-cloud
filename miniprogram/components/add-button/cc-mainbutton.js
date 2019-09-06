'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Component({
  lifetimes: {
    attached: function attached() {
      // 在组件实例进入页面节点树时执行
      // 创建一个动画实例，对应菜单按钮
      this.animation = wx.createAnimation();
    },
    detached: function detached() {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  data: {
    // 按钮状态，打开/关闭，默认关闭。
    dial_btn_options_show: false
  },

  methods: {
    // 菜单按钮的动画
    rotate: function rotate() {
      if (this.data.dial_btn_options_show == false) {
        this.setData({
          dial_btn_options_show: true
        });
        // 旋转-135
        this.animation.rotate(-135).step();
        this.setData({
          animation: this.animation.export()
        });
      } else {
        this.setData({
          dial_btn_options_show: false
        });
        // 复原
        this.animation.rotate(0).step();
        this.setData({
          animation: this.animation.export()
        });
      }
    },
    // 事件
    click_option: function click_option(e) {
      this.triggerEvent('add', e.currentTarget.dataset.option)
    }
  }
});