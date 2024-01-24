import Taro, {useRouter} from '@tarojs/taro'
import {View, WebView} from '@tarojs/components'
import React, {useEffect} from 'react'

const WebViewPage: React.FC = () => {
  const router = useRouter();
  const {url, title} = router.params; // 获取传递的参数

  useEffect(() => {
    //componentDidMount
    Taro.setNavigationBarTitle({
      title: title || ''
    });
  }, []);

  return (
    <View className={'container'}>
      <WebView src={url || ''}/>
    </View>
  )
}

export default WebViewPage;
