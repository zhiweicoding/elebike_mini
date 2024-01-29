import React from 'react';
import {Image, View} from '@tarojs/components';
import './staff.scss';
import serviceLight from '@bike/assets/service_light.png';
import Taro from "@tarojs/taro";


const Staff: React.FC = () => {

  const goToStaff = () => {
    // 跳转回到首页
    Taro.navigateTo({
      url: '/pages/store/list/list',
    });
  };

  return (
    <View className={`all_staff_box_cls`} onClick={goToStaff}>
      <Image src={serviceLight} mode={`scaleToFill`} className={`all_staff_img_cls`}/>
    </View>
  );
};

export default Staff;
