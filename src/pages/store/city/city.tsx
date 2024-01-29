import React, {useState, useEffect} from 'react'
import Taro, {useDidShow, useShareAppMessage} from '@tarojs/taro';
import './city.scss'
import {
  View,
} from '@tarojs/components'
import {AtIndexes} from 'taro-ui'
import {Item} from "taro-ui/types/indexes";

const City: React.FC = () => {
  const defaultList: Params.CityItem[] = [{
    "title": "A",
    "items": [{"name": "阿坝", "lnglat": [102.23, 31.88]}, {
      "name": "阿拉善",
      "lnglat": [105.75, 39.77]
    }, {"name": "阿里", "lnglat": [81.17, 32.5]}, {"name": "安康", "lnglat": [109.03, 32.68]}, {
      "name": "安庆",
      "lnglat": [117.07, 30.52]
    }, {"name": "鞍山", "lnglat": [122.95, 41.11]}, {"name": "安顺", "lnglat": [105.93, 26.25]}, {
      "name": "安阳",
      "lnglat": [114.35, 36.1]
    }, {"name": "澳门", "lnglat": [115.11, 22.19]}],
    "key": "A"
  }, {
    "title": "B",
    "items": [{"name": "北京", "lnglat": [116.46, 39.9]}, {"name": "白银", "lnglat": [104.17, 36.58]}, {
      "name": "保定",
      "lnglat": [115.48, 38.85]
    }, {"name": "宝鸡", "lnglat": [107.18, 34.36]}, {"name": "保山", "lnglat": [99.18, 25.49]}, {
      "name": "包头",
      "lnglat": [109.82, 40.65]
    }, {"name": "巴中", "lnglat": [107.15, 31.87]}, {"name": "北海", "lnglat": [109.33, 30.99]}, {
      "name": "蚌埠",
      "lnglat": [117.33, 32.93]
    }, {"name": "本溪", "lnglat": [123.75, 41.3]}, {"name": "毕节", "lnglat": [105.29, 27.3]}, {
      "name": "滨州",
      "lnglat": [117.98, 37.43]
    }, {"name": "百色", "lnglat": [106.38, 23.9]}, {"name": "亳州", "lnglat": [116.79, 33.81]}],
    "key": "B"
  }, {
    "title": "C",
    "items": [{"name": "重庆", "lnglat": [106.54, 29.59]}, {"name": "成都", "lnglat": [104.06, 30.67]}, {
      "name": "长沙",
      "lnglat": [113.01, 28.2]
    }, {"name": "长春", "lnglat": [125.31, 43.88]}, {"name": "沧州", "lnglat": [116.86, 38.23]}, {
      "name": "常德",
      "lnglat": [111.69, 29.03]
    }, {"name": "昌都", "lnglat": [97.18, 31.13]}, {"name": "长治", "lnglat": [113.11, 36.19]}, {
      "name": "常州",
      "lnglat": [119.45, 31.79]
    }, {"name": "巢湖", "lnglat": [117.87, 31.6]}, {"name": "潮州", "lnglat": [116.63, 23.66]}, {
      "name": "承德",
      "lnglat": [117.93, 40.97]
    }, {"name": "郴州", "lnglat": [113.01, 25.77]}, {"name": "赤峰", "lnglat": [118.78, 42.29]}, {
      "name": "池州",
      "lnglat": [117.48, 30.66]
    }, {"name": "崇左", "lnglat": [107.35, 22.93]}, {"name": "楚雄", "lnglat": [101.52, 25.04]}, {
      "name": "滁州",
      "lnglat": [118.31, 32.31]
    }, {"name": "朝阳", "lnglat": [120.45, 41.58]}],
    "key": "C"
  }, {
    "title": "D",
    "items": [{"name": "大连", "lnglat": [121.62, 38.91]}, {"name": "东莞", "lnglat": [113.75, 23.04]}, {
      "name": "大理",
      "lnglat": [100.29, 25.47]
    }, {"name": "丹东", "lnglat": [124.37, 40.07]}, {"name": "大庆", "lnglat": [125.03, 46.58]}, {
      "name": "大同",
      "lnglat": [113.29, 40.09]
    }, {"name": "大兴安岭", "lnglat": [124.46, 52.33]}, {"name": "德宏", "lnglat": [97.68, 24.43]}, {
      "name": "德阳",
      "lnglat": [104.36, 31.12]
    }, {"name": "德州", "lnglat": [116.35, 37.45]}, {"name": "定西", "lnglat": [104.43, 35.57]}, {
      "name": "迪庆",
      "lnglat": [99.7, 28.04]
    }, {"name": "东营", "lnglat": [118.49, 37.46]}],
    "key": "D"
  }, {
    "title": "E",
    "items": [{"name": "鄂尔多斯", "lnglat": [109.78, 39.61]}, {
      "name": "恩施",
      "lnglat": [109.48, 30.28]
    }, {"name": "鄂州", "lnglat": [114.89, 30.39]}],
    "key": "E"
  }, {
    "title": "F",
    "items": [{"name": "福州", "lnglat": [119.3, 26.08]}, {
      "name": "防城港",
      "lnglat": [108.33, 21.62]
    }, {"name": "佛山", "lnglat": [113.11, 23.02]}, {"name": "抚顺", "lnglat": [123.93, 41.33]}, {
      "name": "抚州",
      "lnglat": [116.37, 27.97]
    }, {"name": "阜新", "lnglat": [121.65, 42.02]}, {"name": "阜阳", "lnglat": [115.82, 32.9]}],
    "key": "F"
  }, {
    "title": "G",
    "items": [{"name": "广州", "lnglat": [113.23, 23.16]}, {"name": "赣州", "lnglat": [114.93, 25.84]}, {
      "name": "桂林",
      "lnglat": [110.28, 25.29]
    }, {"name": "贵阳", "lnglat": [106.71, 26.58]}, {"name": "甘南", "lnglat": [102.92, 34.55]}, {
      "name": "甘孜",
      "lnglat": [101.97, 30.44]
    }, {"name": "广安", "lnglat": [106.63, 30.45]}, {"name": "广元", "lnglat": [105.84, 32.45]}, {
      "name": "果洛",
      "lnglat": [100.22, 34.46]
    }, {"name": "贵港", "lnglat": [109.6, 23.33]}],
    "key": "G"
  }, {
    "title": "H",
    "items": [{"name": "杭州", "lnglat": [120.15, 30.26]}, {
      "name": "哈尔滨",
      "lnglat": [126.63, 45.75]
    }, {"name": "合肥", "lnglat": [117.27, 31.86]}, {"name": "海口", "lnglat": [110.35, 20.02]}, {
      "name": "海东",
      "lnglat": [102.12, 36.5]
    }, {"name": "海北", "lnglat": [100.88, 36.96]}, {"name": "海南", "lnglat": [109.5, 19.2]}, {
      "name": "海西",
      "lnglat": [100.48, 36.26]
    }, {"name": "邯郸", "lnglat": [114.48, 36.6]}, {"name": "汉中", "lnglat": [107.03, 33.06]}, {
      "name": "鹤壁",
      "lnglat": [114.1, 35.73]
    }, {"name": "河池", "lnglat": [108.08, 24.69]}, {"name": "鹤岗", "lnglat": [130.1, 47.33]}, {
      "name": "黑河",
      "lnglat": [127.5, 50.23]
    }, {"name": "衡水", "lnglat": [115.7, 37.73]}, {"name": "衡阳", "lnglat": [112.57, 26.89]}, {
      "name": "河源",
      "lnglat": [114.68, 23.73]
    }, {"name": "贺州", "lnglat": [111.13, 24.4]}, {"name": "红河", "lnglat": [103.36, 23.35]}, {
      "name": "淮安",
      "lnglat": [118.33, 33.59]
    }, {"name": "淮北", "lnglat": [116.78, 33.97]}, {"name": "怀化", "lnglat": [110.01, 27.57]}, {
      "name": "淮南",
      "lnglat": [116.77, 32.62]
    }, {"name": "黄冈", "lnglat": [115.03, 30.45]}, {"name": "黄南", "lnglat": [102.02, 35.54]}, {
      "name": "黄山",
      "lnglat": [118.31, 30.1]
    }, {"name": "黄石", "lnglat": [115.03, 30.45]}, {"name": "惠州", "lnglat": [114.41, 23.11]}, {
      "name": "葫芦岛",
      "lnglat": [120.83, 40.73]
    }, {"name": "呼伦贝尔", "lnglat": [119.77, 49.20]}, {"name": "湖州", "lnglat": [120.10, 30.86]}, {
      "name": "菏泽",
      "lnglat": [115.48, 35.23]
    }],
    "key": "H"
  }, {
    "title": "J",
    "items": [{"name": "济南", "lnglat": [117.00, 36.67]}, {
      "name": "佳木斯",
      "lnglat": [130.35, 47.33]
    }, {"name": "吉安", "lnglat": [114.99, 27.11]}, {"name": "江门", "lnglat": [113.07, 22.57]}, {
      "name": "焦作",
      "lnglat": [113.55, 35.22]
    }, {"name": "嘉兴", "lnglat": [120.76, 30.76]}],
    "key": "J"
  }, {
    "title": "L",
    "items": [{"name": "兰州", "lnglat": [103.82, 36.06]}, {"name": "拉萨", "lnglat": [91.11, 29.65]}, {
      "name": "来宾",
      "lnglat": [109.23, 23.73]
    }, {"name": "莱芜", "lnglat": [117.67, 36.19]}, {"name": "廊坊", "lnglat": [116.68, 39.53]}, {
      "name": "乐山",
      "lnglat": [103.76, 29.59]
    }, {"name": "凉山", "lnglat": [102.26, 28.19]}],
    "key": "L"
  }, {
    "title": "M",
    "items": [{"name": "马鞍山", "lnglat": [118.48, 31.68]}, {
      "name": "茂名",
      "lnglat": [110.92, 21.65]
    }, {"name": "眉山", "lnglat": [103.83, 30.66]}, {"name": "梅州", "lnglat": [116.13, 24.29]}, {
      "name": "绵阳",
      "lnglat": [104.23, 31.47]
    }, {"name": "牡丹江", "lnglat": [129.61, 44.59]}],
    "key": "M"
  }, {
    "title": "N",
    "items": [{"name": "南京", "lnglat": [118.78, 32.04]}, {"name": "南昌", "lnglat": [115.89, 28.68]}, {
      "name": "南宁",
      "lnglat": [108.33, 22.81]
    }, {"name": "南充", "lnglat": [106.11, 30.83]}, {"name": "南平", "lnglat": [118.19, 26.63]}, {
      "name": "南通",
      "lnglat": [121.10, 32.06]
    }, {"name": "南阳", "lnglat": [112.54, 33.01]}, {"name": "那曲", "lnglat": [92.05, 31.48]}, {
      "name": "内江",
      "lnglat": [105.04, 29.58]
    }, {"name": "宁德", "lnglat": [119.55, 26.68]}, {"name": "怒江", "lnglat": [98.87, 25.87]}],
    "key": "N"
  }, {
    "title": "P",
    "items": [{"name": "盘锦", "lnglat": [121.95, 41.12]}, {
      "name": "攀枝花",
      "lnglat": [101.71, 26.58]
    }, {"name": "平顶山", "lnglat": [113.28, 33.75]}, {"name": "平凉", "lnglat": [106.68, 35.56]}, {
      "name": "萍乡",
      "lnglat": [113.85, 27.62]
    }, {"name": "莆田", "lnglat": [119.01, 25.43]}, {"name": "濮阳", "lnglat": [115.03, 35.75]}],
    "key": "P"
  }, {
    "title": "Q",
    "items": [{"name": "青岛", "lnglat": [120.38, 36.07]}, {
      "name": "黔东南",
      "lnglat": [107.95, 26.59]
    }, {"name": "黔南", "lnglat": [107.52, 26.25]}, {"name": "黔西南", "lnglat": [104.90, 25.04]}, {
      "name": "庆阳",
      "lnglat": [107.66, 35.57]
    }, {"name": "清远", "lnglat": [113.01, 23.69]}, {"name": "秦皇岛", "lnglat": [119.57, 39.93]}],
    "key": "Q"
  }, {
    "title": "R",
    "items": [{"name": "日喀则", "lnglat": [88.25, 29.27]}, {"name": "日照", "lnglat": [119.46, 35.42]}],
    "key": "R"
  }, {
    "title": "S",
    "items": [{"name": "上海", "lnglat": [121.47, 31.23]}, {"name": "深圳", "lnglat": [114.07, 22.54]}, {
      "name": "苏州",
      "lnglat": [120.62, 31.32]
    }, {"name": "沈阳", "lnglat": [123.43, 41.81]}, {"name": "石家庄", "lnglat": [114.48, 38.05]}, {
      "name": "三门峡",
      "lnglat": [111.17, 34.76]
    }, {"name": "三明", "lnglat": [117.63, 26.22]}, {"name": "三亚", "lnglat": [109.51, 18.25]}, {
      "name": "商洛",
      "lnglat": [109.93, 33.87]
    }, {"name": "商丘", "lnglat": [115.64, 34.44]}, {"name": "上饶", "lnglat": [117.97, 28.45]}, {
      "name": "山南",
      "lnglat": [91.86, 29.24]
    }, {"name": "汕头", "lnglat": [116.69, 23.35]}, {"name": "汕尾", "lnglat": [115.37, 22.78]}, {
      "name": "韶关",
      "lnglat": [113.62, 24.81]
    }, {"name": "绍兴", "lnglat": [120.58, 30.01]}, {"name": "邵阳", "lnglat": [111.44, 27.23]}, {
      "name": "十堰",
      "lnglat": [110.38, 32.64]
    }, {"name": "朔州", "lnglat": [112.46, 39.32]}, {"name": "四平", "lnglat": [124.35, 43.16]}, {
      "name": "绥化",
      "lnglat": [126.59, 46.63]
    }, {"name": "遂宁", "lnglat": [105.26, 30.52]}, {"name": "随州", "lnglat": [113.38, 31.33]}, {
      "name": "娄底",
      "lnglat": [111.99, 27.71]
    }, {"name": "宿迁", "lnglat": [118.31, 33.98]}, {"name": "宿州", "lnglat": [116.39, 34.75]}],
    "key": "S"
  }, {
    "title": "T",
    "items": [{"name": "天津", "lnglat": [117.20, 39.13]}, {"name": "太原", "lnglat": [112.55, 37.87]}, {
      "name": "泰安",
      "lnglat": [117.13, 36.19]
    }, {"name": "泰州", "lnglat": [119.91, 32.49]}, {"name": "唐山", "lnglat": [118.17, 39.63]}, {
      "name": "天水",
      "lnglat": [105.73, 34.58]
    }, {"name": "铁岭", "lnglat": [123.45, 42.29]}, {"name": "铜川", "lnglat": [109.11, 34.90]}, {
      "name": "通化",
      "lnglat": [125.97, 41.72]
    }, {"name": "通辽", "lnglat": [122.25, 43.65]}, {"name": "铜陵", "lnglat": [117.81, 30.96]}, {
      "name": "铜仁",
      "lnglat": [109.51, 27.70]
    }, {"name": "台湾", "lnglat": [121.50, 25.04]}],
    "key": "T"
  }, {
    "title": "W",
    "items": [{"name": "武汉", "lnglat": [114.31, 30.59]}, {
      "name": "乌鲁木齐",
      "lnglat": [87.61, 43.77]
    }, {"name": "无锡", "lnglat": [120.31, 31.56]}, {"name": "威海", "lnglat": [122.12, 37.51]}, {
      "name": "潍坊",
      "lnglat": [119.10, 36.71]
    }, {"name": "文山", "lnglat": [104.09, 23.37]}, {"name": "温州", "lnglat": [120.69, 27.81]}, {
      "name": "乌海",
      "lnglat": [106.82, 39.67]
    }, {"name": "芜湖", "lnglat": [118.37, 31.31]}, {"name": "乌兰察布", "lnglat": [113.11, 41.01]}, {
      "name": "武威",
      "lnglat": [102.63, 37.93]
    }, {"name": "梧州", "lnglat": [111.30, 23.48]}],
    "key": "W"
  }, {
    "title": "X",
    "items": [{"name": "厦门", "lnglat": [118.10, 24.48]}, {"name": "西安", "lnglat": [108.95, 34.27]}, {
      "name": "西宁",
      "lnglat": [101.77, 36.60]
    }, {"name": "襄樊", "lnglat": [112.11, 32.04]}, {"name": "湘潭", "lnglat": [112.93, 27.83]}, {
      "name": "湘西",
      "lnglat": [110.00, 28.30]
    }, {"name": "咸宁", "lnglat": [114.32, 29.82]}, {"name": "咸阳", "lnglat": [108.71, 34.34]}, {
      "name": "孝感",
      "lnglat": [113.92, 30.92]
    }, {"name": "邢台", "lnglat": [114.49, 37.07]}, {"name": "新乡", "lnglat": [113.95, 35.37]}, {
      "name": "信阳",
      "lnglat": [114.07, 32.29]
    }, {"name": "新余", "lnglat": [114.92, 27.81]}, {"name": "忻州", "lnglat": [112.75, 38.43]}, {
      "name": "西双版纳",
      "lnglat": [100.78, 22.00]
    }, {"name": "宣城", "lnglat": [118.74, 30.92]}, {"name": "许昌", "lnglat": [113.83, 34.02]}, {
      "name": "徐州",
      "lnglat": [117.18, 34.26]
    }, {"name": "香港", "lnglat": [114.17, 22.28]}, {"name": "锡林郭勒", "lnglat": [116.00, 43.95]}, {
      "name": "兴安",
      "lnglat": [110.00, 23.00]
    }],
    "key": "X"
  }, {
    "title": "Y",
    "items": [{"name": "银川", "lnglat": [106.27, 38.47]}, {"name": "雅安", "lnglat": [103.00, 30.00]}, {
      "name": "延安",
      "lnglat": [109.48, 36.60]
    }, {"name": "延边", "lnglat": [130.52, 42.88]}, {"name": "盐城", "lnglat": [120.13, 33.38]}, {
      "name": "阳江",
      "lnglat": [112.44, 21.86]
    }, {"name": "阳泉", "lnglat": [113.57, 37.85]}, {"name": "扬州", "lnglat": [119.42, 32.39]}, {
      "name": "烟台",
      "lnglat": [121.44, 37.51]
    }, {"name": "宜宾", "lnglat": [104.56, 28.76]}, {"name": "宜昌", "lnglat": [111.30, 30.71]}, {
      "name": "宜春",
      "lnglat": [114.38, 27.81]
    }, {"name": "营口", "lnglat": [122.23, 40.67]}, {"name": "益阳", "lnglat": [112.38, 28.57]}, {
      "name": "永州",
      "lnglat": [111.60, 26.42]
    }, {"name": "岳阳", "lnglat": [113.13, 29.37]}, {"name": "榆林", "lnglat": [109.67, 38.27]}, {
      "name": "运城",
      "lnglat": [111.00, 35.02]
    }, {"name": "云浮", "lnglat": [112.04, 23.03]}, {"name": "玉树", "lnglat": [97.00, 33.00]}, {
      "name": "玉溪",
      "lnglat": [102.52, 24.45]
    }, {"name": "玉林", "lnglat": [110.14, 22.62]}],
    "key": "Y"
  }, {
    "title": "Z",
    "items": [{"name": "杂多县", "lnglat": [97.30, 33.17]}, {
      "name": "赞皇县",
      "lnglat": [114.52, 37.17]
    }, {"name": "枣强县", "lnglat": [114.73, 37.37]}, {"name": "枣阳市", "lnglat": [112.55, 32.40]}, {
      "name": "枣庄",
      "lnglat": [117.55, 34.83]
    }, {"name": "泽库县", "lnglat": [125.23, 49.07]}, {"name": "增城市", "lnglat": [113.57, 23.37]}, {
      "name": "曾都区",
      "lnglat": [112.23, 30.92]
    }, {"name": "泽普县", "lnglat": [79.47, 38.17]}, {"name": "泽州县", "lnglat": [113.13, 35.52]}, {
      "name": "札达县",
      "lnglat": [81.17, 30.42]
    }, {"name": "扎赉特旗", "lnglat": [118.77, 47.02]}, {
      "name": "扎兰屯市",
      "lnglat": [122.25, 48.07]
    }, {"name": "扎鲁特旗", "lnglat": [118.73, 45.87]}, {"name": "扎囊县", "lnglat": [91.32, 29.27]}, {
      "name": "张北县",
      "lnglat": [114.72, 41.17]
    }, {"name": "张店区", "lnglat": [118.32, 36.82]}, {"name": "章贡区", "lnglat": [114.02, 28.22]}, {
      "name": "张家港",
      "lnglat": [120.55, 31.87]
    }, {"name": "张家界", "lnglat": [110.47, 29.12]}, {"name": "张家口", "lnglat": [114.88, 40.82]}, {
      "name": "漳平市",
      "lnglat": [117.62, 24.67]
    }, {"name": "漳浦县", "lnglat": [117.67, 24.12]}, {"name": "章丘市", "lnglat": [117.52, 36.67]}, {
      "name": "樟树市",
      "lnglat": [115.97, 28.67]
    }, {"name": "张湾区", "lnglat": [111.32, 30.57]}, {"name": "彰武县", "lnglat": [122.87, 41.12]}, {
      "name": "漳县",
      "lnglat": [117.42, 34.82]
    }, {"name": "张掖", "lnglat": [100.45, 38.92]}, {"name": "漳州", "lnglat": [117.67, 24.50]}, {
      "name": "长子县",
      "lnglat": [113.17, 36.22]
    }, {"name": "湛河区", "lnglat": [114.07, 33.62]}, {"name": "湛江", "lnglat": [110.35, 21.27]}, {
      "name": "站前区",
      "lnglat": [125.32, 41.77]
    }, {"name": "沾益县", "lnglat": [104.32, 28.67]}, {"name": "诏安县", "lnglat": [117.02, 23.72]}, {
      "name": "召陵区",
      "lnglat": [113.82, 34.77]
    }, {"name": "昭平县", "lnglat": [110.67, 24.37]}, {"name": "肇庆", "lnglat": [112.47, 23.07]}, {
      "name": "昭通",
      "lnglat": [105.27, 27.32]
    }, {"name": "赵县", "lnglat": [114.72, 37.07]}],
    "key": "Z"
  }];

  const [list] = useState<Params.CityItem[]>(defaultList);


  useEffect(() => {
    //componentDidMount
    return () => {
      //componentWillUnmount
    };
  }, []);

  useDidShow(() => {
    console.log('页面显示');
  });

  useShareAppMessage(() => {
    return {
      title: '电动车产品库',
      desc: '电动车产品库',
      path: '/pages/store/city/city',
    }
  });

  const listClickAction = (item: Item) => {
    Taro.navigateTo({
      url: `/pages/store/list/list?city=${item.name}`
    });
  }

  return (
    <View style='height:100vh'>
      <AtIndexes
        list={list}
        isShowToast={true}
        animation={true}
        onClick={(item) => listClickAction(item)}
      >
      </AtIndexes>
    </View>
  )
}

export default City;

