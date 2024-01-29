import React, {useEffect, useState} from 'react'
import Taro, {useDidShow, useDidHide, useShareAppMessage, usePageScroll, useRouter} from '@tarojs/taro';
import './detail.scss'
import {
  View,
  Image, ScrollView,
} from '@tarojs/components'
import {queryGoodDetail, queryStoreDetail} from "@bike/services/api";
import {AtButton} from "taro-ui";

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

  const goToStaff = () => {
    Taro.getStorage({
      key: 'defaultStoreId',
      success: function (res) {
        const defaultStoreId = res.data;
        if (defaultStoreId && defaultStoreId !== '') {
          queryStoreDetail({
            storeId: defaultStoreId
          }).then(r => {
            const staffWx = r.staffWx;
            if (staffWx) {
              Taro.openCustomerServiceChat({
                extInfo: {url: `${staffWx}`},
                corpId: 'ww115db6fd649631c9',
                success: function (res) {
                  console.log(res);
                }
              })
            } else {
              Taro.navigateTo({
                url: '/pages/store/list/list',
              });
            }
          })
        } else {
          Taro.navigateTo({
            url: '/pages/store/list/list',
          });
        }
      },
      fail: function () {
        Taro.navigateTo({
          url: '/pages/store/list/list',
        });
      }
    })
  };

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
      <AtButton className={`contain-staff`} type='secondary'
                onClick={goToStaff}>联系微信客服</AtButton>
    </View>
  )
}

export default Index;

