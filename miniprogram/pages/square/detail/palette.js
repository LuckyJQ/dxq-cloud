// canvas实列
export default class ImageExample {
  palette(obj) {
    return ({
      width: '1200rpx',
      height: '1920rpx',
      background: '#fff',
      views: [
        {
          type: 'image',
          url: '/images/head.jpg',
          css: {
            width: '1200rpx',
            height: '580rpx',
          },
        },
        {
          type: 'image',
          url: obj.avatar,
          css: {
            width: '320rpx',
            height: '320rpx',
            top: '480rpx',
            left: '80rpx',
            borderRadius: '20rpx',
            borderWidth: '12rpx',
            borderColor: '#fff',
          },
        },
        {
          type: 'text',
          text: obj.nickName,
          css: {
            fontSize: '32px',
            top: '620rpx',
            lineHeight: '40rpx',
            left: '440rpx'
          }
        },
        {
          type: 'text',
          text: obj.school_name,
          css: {
            fontSize: '24px',
            top: '720rpx',
            left: '440rpx'
          }
        },
        {
          type: 'text',
          text: obj.title,
          css: {
            fontSize: '32px',
            top: '880rpx',
            left: '80rpx'
          }
        },
        {
          type: 'text',
          text: obj.description,
          css: {
            fontSize: '24px',
            top: '1020rpx',
            left: '80rpx',
            width: '1000rpx',
            lineHeight: '40px',
            maxLines: '2',

          }
        },
        {
          type: 'image',
          url: '/images/code.jpg',
          css: {
            bottom: '200rpx',
            left: '220rpx',
            width: '320rpx',
            height: '320rpx',
          }
        },
        {
          type: 'text',
          text: '长按识别，查看详情',
          css: {
            bottom: '380rpx',
            left: '580rpx',
            width: '400rpx',
            fontSize: '20px',

          }
        },
        {
          type: 'text',
          text: '分享自「丢小墙」',
          css: {
            bottom: '300rpx',
            left: '580rpx',
            width: '400rpx',
            fontSize: '20px',

          }
        }
      ],
    });
  }
}
