import React, {useState, useEffect} from 'react'
import Taro, {useDidShow, useDidHide, useShareAppMessage, useRouter} from '@tarojs/taro';
import './detail.scss'
import {
  View,
  Image, Switch,
} from '@tarojs/components'
import {AtButton, AtDivider, AtIcon, AtRate} from 'taro-ui'
import {queryCatalog, queryStoreDetail} from '@bike/services/api';
import TwoColumnWholeGoodList from "@bike/components/twoColumnWholeGoodList/TwoColumnWholeGoodList";
import map from '@bike/assets/map.png';

const Index: React.FC = () => {
  const [goodArray, setGoodArray] = useState<Params.GoodItem[]>([]);
  const [detail, setDetail] = useState<Params.StoreBean>({
    storeId: ''
  });
  const router = useRouter();
  const {storeId} = router.params; // 获取传递的参数

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

  const loadDetail = async () => {
    try {
      Taro.showLoading({
        title: '加载中',
      });
      console.log(`storeId:${storeId}`)
      const param: Params.StoreBean = {
        storeId: storeId
      };
      const response: Params.StoreBean = await queryStoreDetail(param);
      if (response) {
        Taro.hideLoading();
        Taro.getStorage({
          key: 'defaultStoreId',
          success: function (res) {
            const defaultStoreId = res.data;
            if (defaultStoreId && defaultStoreId !== '') {
              response.checked = response.storeId === defaultStoreId;
            } else {
              response.checked = false;
            }
            setDetail(response);
          },
          fail: function () {
            response.checked = false;
            setDetail(response);
          }
        })

      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    //componentDidMount
    loadData({
      symbolId: '-1',
      place: -1,
      order: 'asc',
      isChosen: -1,
      isNew: -1,
      isPopular: -1,
      searchValue: '',
    }).then(r => console.log(r));
    loadDetail().then(r => console.log(r));
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
      path: '/pages/index/index',
    }
  });

  const callPhone = (event) => {
    const phoneNum = event.currentTarget.dataset.phoneNum;
    Taro.makePhoneCall({
      phoneNumber: phoneNum
    });
  }

  const goToMap = (event) => {
    const lat: number = event.currentTarget.dataset.lat;
    const lng: number = event.currentTarget.dataset.lng;
    Taro.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 18
    })
  }

  const goToStaff = () => {
    const staffWx = detail.staffWx;
    Taro.openCustomerServiceChat({
      extInfo: {url: `${staffWx}`},
      corpId: 'ww115db6fd649631c9',
      success: function (res) {
        console.log(res);
      }
    })
  };

  const handleSwitchChange = () => {
    detail.checked = !detail.checked;
    if (detail.checked) {
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
    } else {
      Taro.setStorage({
        key: 'defaultStoreId',
        data: ''
      }).then(() => {
        Taro.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
      });
    }

  };

  return (
    <View className='container'>
      <View className={'sl'}>
        <View className="sl-head">
          <Image
            mode={'aspectFit'}
            className={'sl-head-img'}
            src={detail.storeLogo || ``}
          />
          <View className="sl-head-left">
            <View className={`sl-head-left-line`}>
              {detail.storeName}
            </View>
            <AtRate value={5}/>
          </View>
        </View>
        <View className="sl-desc" onClick={goToMap} data-lng={detail.lng}
              data-lat={detail.lat}>
          <View className={'sl-desc-item'}>
            <AtIcon value={'map-pin'} size={16} color={'#999'}/>
            {'   ' + detail.address}
          </View>
          <Image src={map} className={`sl-desc-icon`} mode={`aspectFit`}/>
        </View>
        <View className="sl-mid">
          <View className={'sl-mid-item'} onClick={callPhone} data-phone-num={detail.phoneNum}>
            <AtIcon value={'phone'} size={20} color={'#999'}/>
            <View className={'sl-mid-item-desc'}>{detail.phoneNum}</View>
          </View>
          {
            detail.backupPhoneNum && detail.backupPhoneNum != '' && (
              <View className={'sl-mid-item'} data-phone-num={detail.backupPhoneNum} onClick={callPhone}>
                <AtIcon value={'phone'} size={20} color={'#999'}/>
                <View className={'sl-mid-item-desc'}>{detail.backupPhoneNum}</View>
              </View>
            )
          }
        </View>
        <View className="sl-msg">{detail.storeDesc}</View>
        <View className="sl-last">
          <View className={'sl-last-item'}>
            <View className={'sl-last-item-txt'}>默认门店</View>
            <Switch className={'sl-last-item-switch'}
                    checked={detail.checked}
                    onChange={() => handleSwitchChange()}/>
          </View>
          <AtButton className={`sl-last-btn`} type='secondary' size='small'
                    data-good-id={detail.storeId}
                    onClick={goToStaff}>微信沟通</AtButton>
        </View>
      </View>
      <AtDivider className={'store-line'} content='商品推荐'/>
      {(goodArray && goodArray.length > 0) && (
        <View className="cate-item">
          <TwoColumnWholeGoodList
            goodList={goodArray}
          />
        </View>
      )}
    </View>
  )
}

export default Index;

