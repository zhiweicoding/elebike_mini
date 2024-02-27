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
import Staff from "@bike/components/staff/staff";
import TwoColumnWholeGoodList from "@bike/components/twoColumnWholeGoodList/TwoColumnWholeGoodList";
import {Button, SearchBar} from "@nutui/nutui-react-taro";

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
  const [searchValue, setSearchValue] = useState<string>('');

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

    // 返回的函数将在组件卸载时执行
    return () => {
      //componentWillUnmount
    };
  }, []);

  const loadData = async (param: Params.CatalogParam) => {
    try {
      Taro.showLoading({
        title: '加载中',
      });
      const response: Params.CatalogEntity = await queryCatalog(param);
      if (response) {
        Taro.hideLoading();
        setGoodArray(response.goodsList);
      }
    } catch (error) {
      console.error(error)
    }
  };

  useDidShow(() => {
    const searchValueRouter = Taro.getStorageSync('searchValueRouter')
    //如果存在symbolId，就设置为当前的symbolId
    const catalogSymbolId = Taro.getStorageSync('catalogSymbolId')
    if (catalogSymbolId && catalogSymbolId != '-1') {
      setSymbolId(catalogSymbolId);
      Taro.setStorage({
        key: "catalogSymbolId",
        data: catalogSymbolId
      }).then(() => {
        tempSymbolArray.map((item) => {
          item.checked = item.symbolId == catalogSymbolId;
        });
      });
    }
    if (searchValueRouter && searchValueRouter.length > 0) {
      setSearchValue(searchValueRouter);
      Taro.setStorage({
        key: "searchValueRouter",
        data: ""
      }).then(r => {
        console.log(r)
        loadData({
          symbolId: symbolId,
          place: place,
          order: order,
          isChosen: isChosen,
          isNew: isNew,
          isPopular: isPopular,
          searchValue: searchValueRouter,
        }).then(r => console.log(r));
      });

    } else {
      loadData({
        symbolId: symbolId,
        place: place,
        order: order,
        isChosen: isChosen,
        isNew: isNew,
        isPopular: isPopular,
        searchValue: searchValue,
      }).then(r => console.log(r));
    }
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
    const p = event.currentTarget.dataset.place;
    setPlace(p);
    setTempSymbolArray([])
    const tsa: Params.SymbolListItem[] = [];
    symbolArray.map((item) => {
      if (
        (p === item.place || item.symbolId === '-1')
        || (p === -1)
      ) {
        tsa.push(item);
      }

    });
    setTempSymbolArray(tsa);
    loadData({
      symbolId: symbolId,
      place: p,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
      searchValue: searchValue,
    }).then(r => console.log(r));
  };

  //选择品类后重新加载
  const selectCategory = async (event: any) => {
    const symbolId = event.currentTarget.dataset.symbolId;
    setSymbolId(symbolId);
    Taro.setStorage({
      key: "catalogSymbolId",
      data: symbolId
    }).then(() => {
      tempSymbolArray.map((item) => {
        item.checked = item.symbolId == symbolId;
      });
    });
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
      searchValue: searchValue,
    }).then(r => console.log(r));
  };

  const changeAction = (value: string) => {
    setSearchValue(value);
  };
  const clearAction = () => {
    setSearchValue('');
    Taro.setStorage({
      key: "searchValueRouter",
      data: ""
    }).then(r => {
      console.log(r)
    });
  };

  const actionClick = () => {
    console.log('开始搜索');
    setShowSymbol(false);
    setShowCatalog(false)
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: isPopular,
      searchValue: searchValue,
    }).then(r => console.log(r));
  };

  const popularAction = async (p: number) => {
    setIsPopular(p);
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: isNew,
      isPopular: p,
      searchValue: searchValue,
    }).then(r => console.log(r));
  };

  const chosenAction = async (c: number) => {
    setIsChosen(c);
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: c,
      isNew: isNew,
      isPopular: isPopular,
      searchValue: searchValue,
    }).then(r => console.log(r));
  };

  const newAction = async (n: number) => {
    setIsNew(n);
    loadData({
      symbolId: symbolId,
      place: place,
      order: order,
      isChosen: isChosen,
      isNew: n,
      isPopular: isPopular,
      searchValue: searchValue,
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
      searchValue: searchValue,
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
                  <View data-place={item.id}
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

  const renderCatalog = () => {
    return (
      <View className={showCatalog ? 'catalog-box-tag ' : 'catalog-box-tag catalog-hidden'}>
        <View className={'catalog-box-tag-one'}>
          <View className={'catalog-box-tag-one-txt'}>爆款商品</View>
          <View className={'catalog-box-tag-one-grid'}>
            <View
              onClick={() => popularAction(-1)}
              className={'catalog-box-tag-one-grid-item ' + (isPopular == -1 ? 'catalog-active' : '')}>全部</View>
            <View
              onClick={() => popularAction(1)}
              className={'catalog-box-tag-one-grid-item ' + (isPopular == 1 ? 'catalog-active' : '')}>是</View>
            <View onClick={() => popularAction(0)}
                  className={'catalog-box-tag-one-grid-item ' + (isPopular == 0 ? 'catalog-active' : '')}>否</View>
          </View>
        </View>
        <View className={'catalog-box-tag-one'}>
          <View className={'catalog-box-tag-one-txt'}>新款推荐</View>
          <View className={'catalog-box-tag-one-grid'}>
            <View
              onClick={() => newAction(-1)}
              className={'catalog-box-tag-one-grid-item ' + (isNew == -1 ? 'catalog-active' : '')}>全部</View>
            <View
              onClick={() => newAction(1)}
              className={'catalog-box-tag-one-grid-item ' + (isNew == 1 ? 'catalog-active' : '')}>是</View>
            <View onClick={() => newAction(0)}
                  className={'catalog-box-tag-one-grid-item ' + (isNew == 0 ? 'catalog-active' : '')}>否</View>
          </View>
        </View>
        <View className={'catalog-box-tag-one'}>
          <View className={'catalog-box-tag-one-txt'}>宝岛优选</View>
          <View className={'catalog-box-tag-one-grid'}>
            <View
              onClick={() => chosenAction(-1)}
              className={'catalog-box-tag-one-grid-item ' + (isChosen == -1 ? 'catalog-active' : '')}>全部</View>
            <View
              onClick={() => chosenAction(1)}
              className={'catalog-box-tag-one-grid-item ' + (isChosen == 1 ? 'catalog-active' : '')}>是</View>
            <View onClick={() => chosenAction(0)}
                  className={'catalog-box-tag-one-grid-item ' + (isChosen == 0 ? 'catalog-active' : '')}>否</View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <ScrollView className="container">
      <Staff/>
      {/*<AtSearchBar*/}
      {/*  showActionButton*/}
      {/*  actionName='搜索'*/}
      {/*  className={'searchBar'}*/}
      {/*  value={searchValue}*/}
      {/*  onChange={changeAction}*/}
      {/*  onConfirm={actionClick}*/}
      {/*  placeholder={'搜索, 更多产品'}*/}
      {/*  onClear={clearAction}*/}
      {/*  onActionClick={actionClick}*/}
      {/*/>*/}
      <SearchBar
        shape="round"
        className={'searchBar'}
        clearable={true}
        onChange={changeAction}
        value={searchValue}
        onSearch={actionClick}
        placeholder={'搜索, 更多产品'}
        onClear={clearAction}
        right={
          <>
            <Button shape="round" type="primary"
                    className={'searchBarBtn'}
                    onClick={actionClick}>
              搜索
            </Button>
          </>
        }
      />
      <View className={'catalog-title'}>
        <View className={'catalog-title-model'} onClick={catalogAction}>品类</View>
        <View className={'catalog-title-tag'} onClick={symbolAction}>分类</View>
        <View className={'catalog-title-order'} data-order={order} onClick={orderAction}>
          <View className={'catalog-title-order-txt'}>排序</View>
          <View
            className={order === 'asc' ? 'catalog-title-order-icon at-icon at-icon-chevron-up' : 'catalog-title-order-icon at-icon at-icon-chevron-down'}></View>
        </View>
      </View>
      {renderCatalog()}
      {renderSymbol(tempSymbolArray)}
      {(goodArray && goodArray.length > 0) && (
        <View className="cate-item">
          <TwoColumnWholeGoodList
            goodList={goodArray}
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
          <View className="cate-item-empty-txt">您寻找的商品还未上架</View>
        </View>
      )}
    </ScrollView>
  )
}

export default Index;

