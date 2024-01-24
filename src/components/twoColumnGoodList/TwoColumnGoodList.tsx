// TwoColumnGoodList.tsx
import React from 'react';
import {View} from '@tarojs/components';
import Taro from '@tarojs/taro';
import './TwoColumnGoodList.scss';
import GoodItem from "@bike/components/goodItem/GoodItem";

export type TwoColumnGoodListProps = {
  goodList: Params.GoodItem[];
  floorName?: string;
  floorId?: string;
  showMore: boolean;
};

const redirectPage = (event: any) => {
  // 假设您想要的 ID 存储在 dataset 中
  const symbolId = event.currentTarget.dataset.symbolId;
  Taro.setStorageSync('catalogSymbolId', symbolId);
  Taro.switchTab({
    url: '/pages/catalog/catalog',
  });
};

const TwoColumnGoodList: React.FC<TwoColumnGoodListProps> = (props) => {
  return (
    <View className="twoColumnGoodList">
      {props.goodList.map((item) => {
        return (
          <GoodItem goodItem={item}/>
        )
      })}
      {props.showMore && (
        <View
          className={('twoColumnGoodList-item')}>
          <View
            onClick={redirectPage}
            className="twoColumnGoodList-item-more"
            data-symbol-id={props.floorId}
            id={props.floorId}
          >
            <View className="twoColumnGoodList-item-more-txt" data-symbol={props.floorId}
                  id={props.floorId}>{'更多' + props.floorName}</View>
            <View className={'twoColumnGoodList-item-more-icon at-icon at-icon-chevron-right'}></View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TwoColumnGoodList;
