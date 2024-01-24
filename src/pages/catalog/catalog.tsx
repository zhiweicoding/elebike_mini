import React, {useState, useEffect} from 'react'
import Taro, {useDidShow, useDidHide, useShareAppMessage, usePageScroll} from '@tarojs/taro';
import './catalog.scss'
import {
  View,
  Image,
  ScrollView,
} from '@tarojs/components'
import {queryCatalog, querySymbol} from '@bike/services/api';
import noData from '@bike/assets/no-data.png';
import TwoColumnGoodList from "@bike/components/twoColumnGoodList/TwoColumnGoodList";
import {AtTag} from "taro-ui";

const Index: React.FC = () => {

  const placeArray = [{
    id: -1,
    name: '全部',
  }, {
    id: 1,
    name: '天津',
  }, {
    id: 0,
    name: '无锡',
  }];

  const [showSymbol, setShowSymbol] = useState<boolean>(false);
  const [showCatalog, setShowCatalog] = useState<boolean>(false);
  const [isPopular, setIsPopular] = useState<number>(-1);
  const [isNew, setIsNew] = useState<number>(-1);
  const [order, setOrder] = useState<string>('asc');
  const [isChosen, setIsChosen] = useState<number>(-1);
  const [symbolId, setSymbolId] = useState<string>('-1');
  const [place, setPlace] = useState<number>(-1);
  const [symbolArray, setSymbolArray] = useState<Params.SymbolListItem[]>([{
    "symbolId": "-1",
    "symbolName": "全部",
    "checked": true
  }]);

  const [tempSymbolArray, setTempSymbolArray] = useState<Params.SymbolListItem[]>([{
    "symbolId": "-1",
    "symbolName": "全部",
    "checked": true
  }]);
  const [goodArray, setGoodArray] = useState<Params.GoodItem[]>([]);

  useEffect(() => {
    //componentDidMount
    querySymbol(true).then(symbolArray => {
      if (symbolArray.length > 0) {
        setSymbolArray(symbolArray);
        setTempSymbolArray(symbolArray);
      } else {
        console.warn(`querySymbol response is null`)
      }
    });

    //如果存在symbolId，就设置为当前的symbolId
    const catalogSymbolId = Taro.getStorageSync('catalogSymbolId')
    if (catalogSymbolId && catalogSymbolId != '-1') {
      setSymbolId(catalogSymbolId);
    }
    // 返回的函数将在组件卸载时执行
    return () => {
      //componentWillUnmount
    };
  }, []);

  const loadData = async (param: Params.CatalogParam) => {
    try {
      const response: Params.CatalogEntity = await queryCatalog(param);
      if (response) {
        if (response.goodsList && response.goodsList.length > 0) {
          setGoodArray(response.goodsList);
        }
      } else {
        console.warn(`queryHome response is null`)
      }
    } catch (error) {
      console.error(error)
    }
  };

  useDidShow(() => {
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
    }).then(r => console.log(r));
  });

  useDidHide(() => {
    console.log('页面隐藏');
  });

  useShareAppMessage(() => {
    return {
      title: '电动车产品库',
      desc: '电动车产品库',
      path: '/pages/catalog/catalog',
    }
  });

  usePageScroll((res) => {
    console.log(res)
  });

  const selectPlace = async (event: any) => {
    const place = event.currentTarget.dataset.place;
    setPlace(place);
    setTempSymbolArray([])
    const tsa: Params.SymbolListItem[] = [];
    symbolArray.map((item) => {
      if (item.place == place || item.symbolId == '-1') {
        tsa.push(item);
      }
    });
    setTempSymbolArray(tsa);
  };

  //选择品类后重新加载
  const selectCategory = async (event: any) => {
    const symbolId = event.currentTarget.dataset.symbolId;
    setSymbolId(symbolId);
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
    }).then(r => console.log(r));
  };

  const renderSymbol = (sa: Params.SymbolListItem[]) => {
    if (!sa || sa.length === 0) {
      return null;
    }

    return (
      <View className={showSymbol ? 'catalog-box-model ' : 'catalog-box-model catalog-hidden'}>
        <View className={'catalog-box-model-place'}>
          <View className={'catalog-box-model-place-txt'}>生产基地</View>
          <View className={'catalog-box-model-place-grid'}>
            {placeArray.map((item) => {
              if (item.id === place) {
                return (
                  <View data-place={item.id}
                        onClick={selectPlace}
                        className={'catalog-box-model-place-grid-item catalog-active'}>{item.name}</View>
                )
              } else {
                return (
                  <View data-place-id={item.id}
                        onClick={selectPlace}
                        className={'catalog-box-model-place-grid-item'}>{item.name}</View>
                )
              }
            })}
          </View>
        </View>
        <View className={'catalog-box-model-item'}>
          <View className={'catalog-box-model-item-txt'}>品类</View>
          <View className={'catalog-box-model-item-grid'}>
            {sa.map((item) => {
              return (
                <View
                  onClick={selectCategory}
                  className={'catalog-box-model-item-grid-item ' + (item.checked ? 'catalog-active' : '')}
                  data-symbolId={item.symbolId}
                  key={item.symbolId}
                >
                  {item.symbolName}
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }

  const popularAction = async (active: boolean) => {
    if (active) {
      setIsPopular(-1);
    } else {
      setIsPopular(1);
    }
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
    }).then(r => console.log(r));
  };

  const chosenAction = async (active: boolean) => {
    if (active) {
      setIsChosen(-1);
    } else {
      setIsChosen(1);
    }
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
    }).then(r => console.log(r));
  };

  const newAction = async (active: boolean) => {
    if (active) {
      setIsNew(-1);
    } else {
      setIsNew(1);
    }
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
    }).then(r => console.log(r));
  };

  const orderAction = async (event: any) => {
    const order = event.currentTarget.dataset.order;
    if (order == 'asc') {
      setOrder('desc');
    } else {
      setOrder('asc');
    }
    setShowCatalog(false)
    setShowSymbol(false)
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
    }).then(r => console.log(r));
  };

  const catalogAction = async () => {
    if (showCatalog) {
      setShowCatalog(false);
    } else {
      setShowCatalog(true);
      setShowSymbol(false)
    }
  }

  const symbolAction = async () => {
    if (showSymbol) {
      setShowSymbol(false);
    } else {
      setShowSymbol(true);
      setShowCatalog(false)
    }
  }


  return (
    <ScrollView className="container">
      <View className={'catalog-title'}>
        <View className={'catalog-title-model'} onClick={catalogAction}>品类</View>
        <View className={'catalog-title-tag'} onClick={symbolAction}>分类</View>
        <View className={'catalog-title-order'} data-order={order} onClick={orderAction}>
          <View className={'catalog-title-order-txt'}>排序</View>
          <View
            className={order === 'asc' ? 'catalog-title-order-icon at-icon at-icon-chevron-up' : 'catalog-title-order-icon at-icon at-icon-chevron-down'}></View>
        </View>
      </View>
      <View className={showCatalog ? 'catalog-box-tag ' : 'catalog-box-tag catalog-hidden'}>
        <AtTag type='primary' circle active={isPopular == 1} onClick={popularAction.bind(this)}>爆款商品</AtTag>
        <AtTag type='primary' circle active={isNew == 1} onClick={newAction.bind(this)}>新款推荐</AtTag>
        <AtTag type='primary' circle active={isChosen == 1} onClick={chosenAction.bind(this)}>宝岛优选</AtTag>
      </View>
      {renderSymbol(tempSymbolArray)}
      {(goodArray && goodArray.length > 0) && (
        <View className="cate-item">
          <TwoColumnGoodList
            goodList={goodArray}
            showMore={false}
          />
        </View>
      )}
      {(!goodArray || goodArray.length == 0) && (
        <View className="cate-item-empty">
          <Image
            src={noData}
            className={'cate-item-empty-img'}
            mode={'aspectFill'}
          ></Image>
          <View className="cate-item-empty-txt"> 您寻找的商品还未上架</View>
        </View>
      )}
    </ScrollView>
  )
}

export default Index;

