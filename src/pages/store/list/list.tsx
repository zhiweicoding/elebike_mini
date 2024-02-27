import React, {useState, useEffect} from 'react'
import Taro, {useDidShow, useDidHide, useShareAppMessage, usePageScroll, useRouter} from '@tarojs/taro';
import './list.scss'
import {
  ScrollView,
  View,
} from '@tarojs/components'
import {queryStore} from '@bike/services/api';
import StoreItem from "@bike/components/storeItem/StoreItem";
import {Button, SearchBar} from "@nutui/nutui-react-taro";

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
            if (defaultStoreId && defaultStoreId !== '') {
              response.map(item => {
                if (item.storeId === defaultStoreId) {
                  item.checked = true;
                }
              })
            }
            setList(response);
            setSelectedStoreId(defaultStoreId)
          },
          fail: function () {
            setList(response);
            setSelectedStoreId('')
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

  const onClearAction = () => {
    storeVo.searchVal = '';
    setStoreVo(storeVo);
    loadData().then(r => console.log(r));
  };


  const onActionClick = () => {
    console.log('开始搜索');
    loadData().then(r => console.log(r));
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
    } else if (storeId === selectedStoreId) {
      setSelectedStoreId(null);
      Taro.setStorage({
        key: 'defaultStoreId',
        data: ''
      }).then(() => {
        Taro.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 2000
        })
      });
    }

  };

  return (
    <View className='container'>
      <View className={'head'}>
        <View className={'head-order'} onClick={selectCity}>
          <View className={'head-order-txt'}>{storeVo.cityName}</View>
          <View
            className={'head-order-icon at-icon at-icon-chevron-down'}></View>
        </View>
        <SearchBar
          shape="round"
          className={'head-searchBar'}
          clearable={true}
          onChange={onChange}
          value={storeVo.searchVal!}
          onSearch={onActionClick}
          placeholder={'搜索, 更多产品'}
          onClear={onClearAction}
          right={
            <>
              <Button shape="round" type="primary"
                      className={'searchBarBtn'}
                      onClick={onActionClick}>
                搜索
              </Button>
            </>
          }
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

