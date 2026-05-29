export interface OptionItem {
  label: string;
  value: string;
  branch?: 'zhejiang' | 'jiangsu' | 'guangdong';
  hiddenSelect?: boolean;
  hiddenSelect2?: boolean;
}

export interface DetailRecord {
  id: string;
  title: string;
  province?: string;
  zhejiangHidden?: string;
  jiangsuHidden1?: string;
  jiangsuHidden2?: string;
  city?: string;
  district?: string;
  street?: string;
}

export const provinceList: OptionItem[] = [
  {
    label: '浙江省',
    value: 'zhejiang',
    branch: 'zhejiang',
    hiddenSelect: true,
  },
  { label: '江苏省', value: 'jiangsu', branch: 'jiangsu', hiddenSelect2: true },
  { label: '广东省', value: 'guangdong', branch: 'guangdong' },
];

export const provinceLabelMap = provinceList.reduce<Record<string, string>>(
  (acc, item) => {
    acc[item.value] = item.label;
    return acc;
  },
  {},
);

export const hiddenSelectLevelOneMap: Record<string, OptionItem[]> = {
  zhejiang: [
    { label: '浙江专属筛选一', value: 'zhejiang-hidden-1-a' },
    { label: '浙江专属筛选二', value: 'zhejiang-hidden-1-b' },
  ],
};

export const hiddenSelectLevelTwoMap: Record<string, OptionItem[]> = {
  jiangsu: [
    { label: '江苏一级筛选一', value: 'jiangsu-hidden-2-a' },
    { label: '江苏一级筛选二', value: 'jiangsu-hidden-2-b' },
  ],
};

export const hiddenSelectLevelThreeMap: Record<string, OptionItem[]> = {
  'jiangsu-hidden-2-a': [
    { label: '江苏二级筛选一', value: 'jiangsu-hidden-3-a' },
    { label: '江苏二级筛选二', value: 'jiangsu-hidden-3-b' },
  ],
  'jiangsu-hidden-2-b': [
    { label: '江苏二级筛选三', value: 'jiangsu-hidden-3-c' },
    { label: '江苏二级筛选四', value: 'jiangsu-hidden-3-d' },
  ],
};

export const cityMap: Record<string, OptionItem[]> = {
  guangdong: [
    { label: '广州市', value: 'guangzhou' },
    { label: '深圳市', value: 'shenzhen' },
  ],
  'zhejiang-hidden-1-a': [
    { label: '杭州市', value: 'hangzhou' },
    { label: '绍兴市', value: 'shaoxing' },
  ],
  'zhejiang-hidden-1-b': [
    { label: '宁波市', value: 'ningbo' },
    { label: '温州市', value: 'wenzhou' },
  ],
  'jiangsu-hidden-3-a': [
    { label: '南京市', value: 'nanjing' },
    { label: '无锡市', value: 'wuxi' },
  ],
  'jiangsu-hidden-3-b': [
    { label: '常州市', value: 'changzhou' },
    { label: '苏州市', value: 'suzhou' },
  ],
  'jiangsu-hidden-3-c': [
    { label: '扬州市', value: 'yangzhou' },
    { label: '镇江市', value: 'zhenjiang' },
  ],
  'jiangsu-hidden-3-d': [
    { label: '南通市', value: 'nantong' },
    { label: '泰州市', value: 'taizhou' },
  ],
};

export const districtMap: Record<string, OptionItem[]> = {
  hangzhou: [
    { label: '西湖区', value: 'xihu' },
    { label: '滨江区', value: 'binjiang' },
  ],
  shaoxing: [
    { label: '越城区', value: 'yuecheng' },
    { label: '柯桥区', value: 'keqiao' },
  ],
  ningbo: [
    { label: '海曙区', value: 'haishu' },
    { label: '鄞州区', value: 'yinzhou' },
  ],
  wenzhou: [
    { label: '鹿城区', value: 'lucheng' },
    { label: '龙湾区', value: 'longwan' },
  ],
  nanjing: [
    { label: '玄武区', value: 'xuanwu' },
    { label: '秦淮区', value: 'qinhuai' },
  ],
  wuxi: [
    { label: '梁溪区', value: 'liangxi' },
    { label: '滨湖区', value: 'binhu' },
  ],
  changzhou: [
    { label: '天宁区', value: 'tianning' },
    { label: '钟楼区', value: 'zhonglou' },
  ],
  suzhou: [
    { label: '姑苏区', value: 'gusu' },
    { label: '吴中区', value: 'wuzhong' },
  ],
  yangzhou: [
    { label: '广陵区', value: 'guangling' },
    { label: '邗江区', value: 'hanjiang' },
  ],
  zhenjiang: [
    { label: '京口区', value: 'jingkou' },
    { label: '润州区', value: 'runzhou' },
  ],
  nantong: [
    { label: '崇川区', value: 'chongchuan' },
    { label: '通州区', value: 'tongzhou' },
  ],
  taizhou: [
    { label: '海陵区', value: 'hailing' },
    { label: '高港区', value: 'gaogang' },
  ],
  guangzhou: [
    { label: '天河区', value: 'tianhe' },
    { label: '越秀区', value: 'yuexiu' },
  ],
  shenzhen: [
    { label: '南山区', value: 'nanshan' },
    { label: '福田区', value: 'futian' },
  ],
};

export const streetMap: Record<string, OptionItem[]> = {
  xihu: [
    { label: '北山街道', value: 'beishan' },
    { label: '翠苑街道', value: 'cuiyuan' },
  ],
  binjiang: [
    { label: '西兴街道', value: 'xixing' },
    { label: '长河街道', value: 'changhe' },
  ],
  yuecheng: [
    { label: '塔山街道', value: 'tashan' },
    { label: '府山街道', value: 'fushan' },
  ],
  keqiao: [
    { label: '柯桥街道', value: 'keqiao-jd' },
    { label: '华舍街道', value: 'huashe' },
  ],
  haishu: [
    { label: '鼓楼街道', value: 'gulou' },
    { label: '南门街道', value: 'nanmen' },
  ],
  yinzhou: [
    { label: '首南街道', value: 'shounan' },
    { label: '中河街道', value: 'zhonghe' },
  ],
  lucheng: [
    { label: '五马街道', value: 'wuma' },
    { label: '松台街道', value: 'songtai' },
  ],
  longwan: [
    { label: '永中街道', value: 'yongzhong' },
    { label: '海滨街道', value: 'haibin' },
  ],
  xuanwu: [
    { label: '梅园新村街道', value: 'meiyuanxincun' },
    { label: '新街口街道', value: 'xinjiekou' },
  ],
  qinhuai: [
    { label: '洪武路街道', value: 'hongwulu' },
    { label: '中华门街道', value: 'zhonghuamen' },
  ],
  liangxi: [
    { label: '崇安寺街道', value: 'chongansi' },
    { label: '清名桥街道', value: 'qingmingqiao' },
  ],
  binhu: [
    { label: '蠡园街道', value: 'liyuan' },
    { label: '河埒街道', value: 'helie' },
  ],
  tianning: [
    { label: '兰陵街道', value: 'lanling' },
    { label: '雕庄街道', value: 'diaozhuang' },
  ],
  zhonglou: [
    { label: '五星街道', value: 'wuxing' },
    { label: '永红街道', value: 'yonghong' },
  ],
  gusu: [
    { label: '平江街道', value: 'pingjiang' },
    { label: '沧浪街道', value: 'canglang' },
  ],
  wuzhong: [
    { label: '长桥街道', value: 'changqiao' },
    { label: '越溪街道', value: 'yuexi' },
  ],
  guangling: [
    { label: '文峰街道', value: 'wenfeng' },
    { label: '曲江街道', value: 'qujiang' },
  ],
  hanjiang: [
    { label: '邗上街道', value: 'hanshang' },
    { label: '蒋王街道', value: 'jiangwang' },
  ],
  jingkou: [
    { label: '正东路街道', value: 'zhengdonglu' },
    { label: '大市口街道', value: 'dashikou' },
  ],
  runzhou: [
    { label: '金山街道', value: 'jinshan' },
    { label: '七里甸街道', value: 'qilidian' },
  ],
  chongchuan: [
    { label: '新城桥街道', value: 'xinchengqiao' },
    { label: '学田街道', value: 'xuetian' },
  ],
  tongzhou: [
    { label: '金沙街道', value: 'jinsha' },
    { label: '兴仁镇', value: 'xingren' },
  ],
  hailing: [
    { label: '城中街道', value: 'chengzhong' },
    { label: '京泰路街道', value: 'jingtailu' },
  ],
  gaogang: [
    { label: '口岸街道', value: 'kouan' },
    { label: '刁铺街道', value: 'diaopu' },
  ],
  tianhe: [
    { label: '天河南街道', value: 'tianhenan' },
    { label: '石牌街道', value: 'shipai' },
  ],
  yuexiu: [
    { label: '北京街道', value: 'beijing' },
    { label: '东山街道', value: 'dongshan' },
  ],
  nanshan: [
    { label: '粤海街道', value: 'yuehai' },
    { label: '招商街道', value: 'zhaoshang' },
  ],
  futian: [
    { label: '莲花街道', value: 'lianhua' },
    { label: '香蜜湖街道', value: 'xiangmihu' },
  ],
};

export const detailRecordMap: Record<string, DetailRecord> = {
  zhejiang: {
    id: 'zhejiang',
    title: '浙江详情：需要动态插入一个隐藏筛选',
    province: 'zhejiang',
    zhejiangHidden: 'zhejiang-hidden-1-a',
    city: 'hangzhou',
    district: 'xihu',
    street: 'beishan',
  },
  jiangsu: {
    id: 'jiangsu',
    title: '江苏详情：需要动态插入两个隐藏筛选',
    province: 'jiangsu',
    jiangsuHidden1: 'jiangsu-hidden-2-a',
    jiangsuHidden2: 'jiangsu-hidden-3-a',
    city: 'nanjing',
    district: 'xuanwu',
    street: 'meiyuanxincun',
  },
  guangdong: {
    id: 'guangdong',
    title: '广东详情：无隐藏筛选，直接城市链路',
    province: 'guangdong',
    city: 'shenzhen',
    district: 'nanshan',
    street: 'yuehai',
  },
  partial: {
    id: 'partial',
    title: '部分详情：只有省份和隐藏筛选，用于观察后续是否误触发',
    province: 'zhejiang',
    zhejiangHidden: 'zhejiang-hidden-1-b',
  },
  conflict: {
    id: 'conflict',
    title: '冲突详情：省份和下游值不匹配，用于观察容错表现',
    province: 'guangdong',
    city: 'hangzhou',
    district: 'xihu',
    street: 'beishan',
  },
};

export const wait = <T>(data: T, delay = 300) => {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => {
      resolve(Array.isArray(data) ? ([...data] as T) : data);
    }, delay);
  });
};

export const getCityParamKey = (params: Record<string, any>) => {
  return params.zhejiangHidden || params.jiangsuHidden2 || params.province;
};
