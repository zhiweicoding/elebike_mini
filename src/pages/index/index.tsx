import React, {useState, useEffect} from 'react'
import Taro, {useDidShow, useDidHide, useShareAppMessage, usePageScroll} from '@tarojs/taro';
import './index.scss'
import {
  Text,
  View,
  Swiper,
  SwiperItem,
  Navigator,
  Image,
} from '@tarojs/components'
import {queryHome} from '@bike/services/api';
import HorGoodList from "@bike/components/horGoodList/HorGoodList";
import TwoColumnGoodList from "@bike/components/twoColumnGoodList/TwoColumnGoodList";
import Staff from "@bike/components/staff/staff";
import {Button, SearchBar} from "@nutui/nutui-react-taro";
import {AtTabs} from "taro-ui";

const Index: React.FC = () => {
  const defaultBanner: Params.Banner[] = [
    {
      "imageUrl": "https://lg-qrm18qcm-1255940368.cos.ap-shanghai.myqcloud.com/rabbish/1.jpg",
      "link": "",
      "id": "1"
    }
  ]

  const tabList = [{title: '无锡'}, {title: '天津'}]

  const [banner, setBanner] = useState<Params.Banner[]>(defaultBanner);
  const [topics, setTopics] = useState<Params.GoodItem[]>([]);
  const [floorGoods, setFloorGoods] = useState<Params.FloorGood[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [tabIndex, setTabIndex] = useState<number>(0);


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

  const onChangeAction = (value: string) => {
    setSearchValue(value);
  };

  const onClearAction = async () => {
    setSearchValue('');
    Taro.setStorage({
      key: "searchValueRouter",
      data: ""
    }).then(r => {
      console.log(r)
    });
  }

  const onActionClickAction = () => {
    console.log('开始搜索');
    Taro.setStorage({
      key: "searchValueRouter",
      data: searchValue
    }).then(() => {
      Taro.switchTab({
        url: `/pages/catalog/catalog`
      });
    });
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

  const swiperAction = (link: string) => {
    console.log(link)
    Taro.navigateTo({
      url: `/pages/webview/webview?url=${link}`
    });
  };

  usePageScroll((res) => {
    console.log(res)
  });
  const setTabAction = (val: number) => {
    setTabIndex(val);
    Taro.setStorage({
      key: "placeArrayId",
      data: val
    }).then(() => {
      Taro.switchTab({
        url: `/pages/catalog/catalog`
      });
    });
  }

  return (
    <View className='container'>
      <Staff/>
      <Swiper
        duration={1000}
        autoplay={true}
        className={'banner'}
        indicatorDots={true}
        interval={3000}
      >
        {banner.map((item) => {
          return (
            <SwiperItem key={item.id} onClick={() => swiperAction(item.link)}>
              <Navigator url={item.link}>
                <Image mode={'aspectFill'} fadeIn={true} src={item.imageUrl}></Image>
              </Navigator>
            </SwiperItem>
          )
        })}
      </Swiper>
      <SearchBar
        shape="round"
        className={'searchBar'}
        clearable={true}
        onChange={onChangeAction}
        value={searchValue}
        onSearch={onActionClickAction}
        placeholder={'搜索, 更多产品'}
        onClear={onClearAction}
        right={
          <>
            <Button shape="round" type="primary"
                    className={'searchBarBtn'}
                    onClick={onActionClickAction}>
              搜索
            </Button>
          </>
        }
      />
      <AtTabs current={tabIndex} tabList={tabList} onClick={setTabAction}>
      </AtTabs>
      {topics.length > 0 && (
        <View className="a-section ">
          <View className="a-section-title">
            <View>
              <Navigator openType="switchTab" url={'/pages/catalog/catalog'}>
                <Text className="txt">精选推荐</Text>
              </Navigator>
            </View>
          </View>
          <HorGoodList
            goodList={topics}
          />
        </View>
      )}
      {floorGoods.map((item) => {
        return (
          <>
            {item.goodsList.length > 0 && (
              <View className="floor-good-grid" key={item.id}>
                <View className="floor-good-grid-title">{item.name}</View>
                <TwoColumnGoodList
                  goodList={item.goodsList}
                  floorName={item.name}
                  floorId={item.id}
                />
              </View>
            )}
          </>
        )
      })}

    </View>
  )
}

export default Index;

