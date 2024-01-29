export default {
  pages: [
    'pages/index/index',
    'pages/mine/index/index',
    'pages/catalog/catalog',
    'pages/detail/detail',
    'pages/webview/webview',
    'pages/mine/feedback/feedback',
    'pages/mine/footprint/footprint',
    'pages/store/list/list',
    'pages/store/detail/detail',
    'pages/store/city/city',
    'pages/error/error',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#868686',
    selectedColor: '#f5222d',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/homeC.png',
      },
      {
        pagePath: 'pages/catalog/catalog',
        text: '分类',
        iconPath: 'assets/apps.png',
        selectedIconPath: 'assets/appsC.png',
      },
      {
        pagePath: 'pages/mine/index/index',
        text: '我的',
        iconPath: 'assets/people.png',
        selectedIconPath: 'assets/peopleC.png',
      },
    ],
  },
  requiredPrivateInfos: ['getFuzzyLocation'],
  permission: {
    'scope.userFuzzyLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
  },
}
