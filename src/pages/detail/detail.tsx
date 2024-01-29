import React, {useEffect, useState} from 'react'
import Taro, {useDidShow, useDidHide, useShareAppMessage, usePageScroll, useRouter} from '@tarojs/taro';
import './detail.scss'
import {
  View,
  Image, ScrollView,
} from '@tarojs/components'
import {queryGoodDetail} from "@bike/services/api";

const Index: React.FC = () => {
  const [goodItem, setGoodItem] = useState<Params.GoodItem>({});

  const router = useRouter();
  const {goodId} = router.params; // 获取传递的参数

  useEffect(() => {
    //componentDidMount
    return () => {
      //componentWillUnmount
    };
  }, [goodId]);

  const loadData = async (goodId: string) => {
    try {
      const param: Params.GoodIdParam = {
        goodId: goodId
      }
      const response: Params.GoodItem = await queryGoodDetail(param);
      if (response) {
        setGoodItem(response);

        const footprintArrayStr: string = Taro.getStorageSync('footprintArray')
        let footprintArray: Params.FootprintEntity[] = [];
        if (footprintArrayStr && footprintArrayStr.length > 0) {
          footprintArray = JSON.parse(footprintArrayStr);
        }
        //获取当前时间戳
        const timestamp = Date.parse(new Date().toString());

        const fpItem: Params.FootprintEntity = {
          id: timestamp+'',
          goodId: response.goodId,
          goodTitle: response.goodTitle,
          goodBrief: response.goodBrief,
          createTime: timestamp,
          url: response.scenePicUrl,
        }
        footprintArray.unshift(fpItem)
        Taro.setStorageSync('footprintArray', JSON.stringify(footprintArray));
      } else {
        console.warn(`queryGoodDetail response is null`)
      }
    } catch (error) {
      console.error(error)
    }
  };

  useDidShow(() => {
    if (goodId) {
      loadData(goodId).then(r => {
        console.log(r);
      });
    } else {
      console.warn(`goodId is null`)
      Taro.redirectTo({
        url: '/pages/error/error'
      });
    }
  });

  useDidHide(() => {
    console.log('页面隐藏');
  });

  useShareAppMessage(() => {
    return {
      title: '电动车产品库',
      desc: '电动车产品库',
      path: '/pages/detail/detail',
    }
  });

  usePageScroll((res) => {
    console.log(res)
  });

  return (
    <View className="contain">
      <ScrollView
        className={'contain-scroll'}
      >
        {goodItem.photoUrlArray?.map((item) => {
          return (
            <Image src={item} mode={'widthFix'} className={'scrollImg'}/>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default Index;

