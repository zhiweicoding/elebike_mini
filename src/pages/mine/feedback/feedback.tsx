import React, {useEffect, useState} from 'react'
import {View, Textarea, Button,} from '@tarojs/components'
import Taro, {useDidHide, useDidShow, usePageScroll, useShareAppMessage} from '@tarojs/taro'
import './feedback.scss'
import {saveAdvice} from "@bike/services/api";
import {AtToast} from "taro-ui";

const Feedback: React.FC = () => {

  const [msg, setMsg] = useState<string>('');
  const [submitSuccess, setSubmitResult] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);


  useEffect(() => {
    //componentDidMount
    // 返回的函数将在组件卸载时执行
    return () => {
      //componentWillUnmount
    };
  }, []);


  useDidShow(() => {
    console.log('页面显示');
  });

  useDidHide(() => {
    console.log('页面隐藏');
  });

  useShareAppMessage(() => {
    return {
      title: '电动车产品库',
      desc: '电动车产品库',
      path: '/pages/mine/index/index',
    }
  });

  usePageScroll((res) => {
    console.log(res)
  });

  const msgAction = async (e: any) => {
    setMsg(e.detail.value);
  }

  const submitFeedback = async () => {
    try {
      const response: boolean = await saveAdvice({
        msg: msg
      });
      if (response) {
        setSubmitResult(true);
        setSubmitError(false);
      } else {
        setSubmitError(true);
        setSubmitResult(false);
      }
    } catch (error) {
      console.error(error)
    }
  }

  const backAction = async () => {
    Taro.switchTab({
      url: '/pages/mine/index/index'
    });
  }

  return (
    <View className='container'>

      <AtToast isOpened={submitSuccess} text={`反馈成功`} status={`success`} hasMask={true} duration={2000}
               onClose={backAction}></AtToast>
      <AtToast isOpened={submitError} text={`操作失败`} status={`error`} hasMask={true} duration={2000}
               onClose={backAction}></AtToast>


      <View className='fb-body'>
        <Textarea
          className='content'
          placeholder='对我们书籍服务，你还有什么建议吗？你还希望在咱们的软件上看到什么书籍呢？请告诉我们...'
          onInput={msgAction.bind(this)}
          value={msg}
        ></Textarea>
        <View className='text-count'>0/500</View>
      </View>

      <Button className='fb-btn' onClick={submitFeedback}>
        提交
      </Button>
    </View>
  )
}

export default Feedback;
