// HorGoodItem.tsx
import React from 'react';
import {View, Image, Text, ScrollView} from '@tarojs/components';
import Taro from '@tarojs/taro';
import './HorGoodItem.scss';

export type HorGoodItemProps = {
  goodList: Params.GoodItem[];
};

const jumpDetail = async (event: any) => {
  const goodId = event.currentTarget.dataset.goodId;
  Taro.navigateTo({
    url: `/pages/detail/detail?goodId=${goodId}`
  });
};

const HorGoodItem: React.FC<HorGoodItemProps> = (props) => {
  return (
    <ScrollView className="horGoodList" scrollX>
      {props.goodList.map((item) => {
        return (
          <View className="horGoodList-item" key={item.goodId} data-good-id={item.goodId} onClick={jumpDetail}>
            <Image
              mode={'aspectFill'}
              className="horGoodList-item-img"
              src={item.scenePicUrl || ''}
            ></Image>
            <View className="horGoodList-item-grid">
              <Text className="horGoodList-item-grid-title">{item.goodTitle}</Text>
              <Text className="horGoodList-item-grid-brief">{item.goodBrief}</Text>
            </View>
          </View>
        )
      })}
    </ScrollView>
  );
};

export default HorGoodItem;
