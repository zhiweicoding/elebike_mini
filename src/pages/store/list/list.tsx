import React, {useState, useEffect} from 'react'
import Taro, {useDidShow, useDidHide, useShareAppMessage, usePageScroll, useRouter} from '@tarojs/taro';
import './list.scss'
import {
  ScrollView,
  View,
} from '@tarojs/components'
import {AtSearchBar} from 'taro-ui'
import {queryStore} from '@bike/services/api';
import StoreItem from "@bike/components/storeItem/StoreItem";

const List: React.FC = () => {
  const [storeVo, setStoreVo] = useState<Params.StoreVo>({
    cityName: '全国',
    searchVal: '',
    storeId: '',
    lng: 0,
    lat: 0
  });
  const [list, setList] = useState<Params.StoreBean[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const router = useRouter();
  const {city: routerCity} = router.params; // 获取传递的参数

  useEffect(() => {
    //componentDidMount
    loadData().then(r => console.log(r));
    // 返回的函数将在组件卸载时执行
    return () => {
      //componentWillUnmount
    };
  }, []);

  const loadData = async () => {
    try {
      const response: Params.StoreBean[] = await queryStore(storeVo);
      if (response) {
        Taro.getStorage({
          key: 'defaultStoreId',
          success: function (res) {
            const defaultStoreId = res.data;
            if (defaultStoreId) {
              response.map(item => {
                if (item.storeId === defaultStoreId) {
                  item.checked = true;
                }
              })
            }
            setList(response);
          },
          fail: function () {
            setList(response);
          }
        })

      }
    } catch (error) {
      console.error(error)
    }
  };

  const onChange = (value: string) => {
    storeVo.searchVal = value;
    setStoreVo(storeVo);
  };

  const onActionClick = () => {
    console.log('开始搜索');
    Taro.setStorage({
      key: "searchValueRouter",
      data: storeVo.searchVal
    }).then(() => {
      Taro.switchTab({
        url: `/pages/catalog/catalog`
      });
    });
  };

  useDidShow(() => {
    if (routerCity && routerCity !== '全国' && routerCity !== '') {
      storeVo.cityName = routerCity;
      setStoreVo(storeVo);
    }
    Taro.getFuzzyLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(latitude, longitude)
        storeVo.lat = latitude;
        storeVo.lng = longitude;
        loadData().then(r => console.log(r));
      },
    })
  });

  useDidHide(() => {
    console.log('页面隐藏');
  });

  useShareAppMessage(() => {
    return {
      title: '电动车产品库',
      desc: '电动车产品库',
      path: '/pages/store/list/list',
    }
  });

  usePageScroll((res) => {
    console.log(res)
  });

  const selectCity = () => {
    Taro.navigateTo({
      url: `/pages/store/city/city`
    })
  }

  const handleSwitchChange = (storeId: string, checked: boolean) => {
    if (checked) {
      setSelectedStoreId(storeId);
    } else if (storeId === selectedStoreId) {
      setSelectedStoreId(null);
    }
    Taro.setStorage({
      key: 'defaultStoreId',
      data: storeId
    }).then(() => {
      Taro.showToast({
        title: '设置成功',
        icon: 'success',
        duration: 2000
      })
    });
  };

  return (
    <View className='container'>
      <View className={'head'}>
        <View className={'head-order'} onClick={selectCity}>
          <View className={'head-order-txt'}>{storeVo.cityName}</View>
          <View
            className={'head-order-icon at-icon at-icon-chevron-down'}></View>
        </View>
        <AtSearchBar
          showActionButton
          actionName='搜索'
          className={'head-searchBar'}
          value={storeVo.searchVal!}
          onChange={onChange}
          placeholder={'搜索, 更多产品'}
          onActionClick={onActionClick}
        />
      </View>
      <ScrollView className={`store-list-list`} scrollY={true}>
        {list.map((item) => {
            return (
              <StoreItem
                item={item}
                key={item.storeId}
                onSwitchChange={handleSwitchChange}
                checked={selectedStoreId === item.storeId}
              />
            )
          }
        )}
      </ScrollView>

    </View>
  )
}

export default List;

