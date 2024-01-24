import React, {useState, useEffect} from 'react'
import {useDidShow, useDidHide, useShareAppMessage, usePageScroll} from '@tarojs/taro';
import './index.scss'
import {
  Text,
  View,
  Swiper,
  SwiperItem,
  Navigator,
  Image,
} from '@tarojs/components'
import {AtSearchBar} from 'taro-ui'
import {queryHome} from '@bike/services/api';
import HorGoodItem from "@bike/components/horGoodItem/HorGoodItem";
import TwoColumnGoodList from "@bike/components/twoColumnGoodList/TwoColumnGoodList";

const Index: React.FC = () => {
  const defaultBanner: Params.Banner[] = [
    {
      "imageUrl": "https://lg-qrm18qcm-1255940368.cos.ap-shanghai.myqcloud.com/rabbish/1.jpg",
      "link": "",
      "id": "1"
    }
  ]

  const [banner, setBanner] = useState<Params.Banner[]>(defaultBanner);
  const [topics, setTopics] = useState<Params.GoodItem[]>([]);
  const [floorGoods, setFloorGoods] = useState<Params.FloorGood[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');


  useEffect(() => {
    //componentDidMount
    loadHomeData().then(r => console.log(r));
    // 返回的函数将在组件卸载时执行
    return () => {
      //componentWillUnmount
    };
  }, []);

  const loadHomeData = async () => {
    try {
      const response: Params.HomeEntity = await queryHome();
      if (response) {
        if (response.banners && response.banners.length > 0) {
          setBanner(response.banners);
        }
        if (response.topics && response.topics.length > 0) {
          setTopics(response.topics);
        }
        if (response.floorGoods && response.floorGoods.length > 0) {
          setFloorGoods(response.floorGoods);
        }
      } else {
        console.warn(`queryHome response is null`)
      }
    } catch (error) {
      console.error(error)
    }
  };

  const onChange = (value: string) => {
    setSearchValue(value);
  };

  const onActionClick = () => {
    console.log('开始搜索');
  };

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
      path: '/pages/index/index',
    }
  });

  usePageScroll((res) => {
    console.log(res)
  });

  return (
    <View className='container'>
      <Swiper
        duration={1000}
        autoplay={true}
        className={'banner'}
        indicatorDots={true}
        interval={3000}
      >
        {banner.map((item) => {
          return (
            <SwiperItem key={item.id}>
              <Navigator url={item.link}>
                <Image mode={'aspectFill'} fadeIn={true} src={item.imageUrl}></Image>
              </Navigator>
            </SwiperItem>
          )
        })}
      </Swiper>
      <AtSearchBar
        showActionButton
        actionName='搜索'
        className={'searchBar'}
        value={searchValue}
        onChange={onChange}
        placeholder={'搜索, 更多产品类型'}
        onActionClick={onActionClick}
      />
      {topics.length > 0 && (
        <View className="a-section ">
          <View className="h">
            <View>
              <Navigator openType="switchTab" url={'/pages/catalog/catalog'}>
                <Text className="txt">精选推荐</Text>
              </Navigator>
            </View>
          </View>
          <HorGoodItem
            goodList={topics}
          />
        </View>
      )}
      {floorGoods.map((item) => {
        return (
          <>
            {item.goodsList.length>0 && (
              <View className="good-grid" key={item.id}>
                <View className="h">
                  <View>
                    <Text>{item.name}</Text>
                  </View>
                </View>
                <TwoColumnGoodList
                  goodList={item.goodsList}
                  floorName={item.name}
                  floorId={item.id
                  }/>
              </View>
            )}
          </>
        )
      })}

    </View>
  )
}

export default Index;
