// HorGoodList.tsx
import React from 'react';
import {ScrollView} from '@tarojs/components';
import './HorGoodList.scss';
import HorGoodItem from "@bike/components/horGoodItem/HorGoodItem";

export type HorGoodListProps = {
  goodList: Params.GoodItem[];
};

const HorGoodList: React.FC<HorGoodListProps> = (props) => {
  return (
    <ScrollView className="horGoodList" scrollX>
      {props.goodList.map((item) => {
        return (
          <HorGoodItem goodItem={item}/>
        )
      })}
    </ScrollView>
  );
};

export default HorGoodList;
