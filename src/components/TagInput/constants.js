import { I18nManager } from 'react-native';

const Colors = {
  WHITE: '#fff',
  BLACK: '#000',
  ALTO: '#dfdfdf',
  GREY: '#808080',
  EBONY_CLAY: '#292d3e',
  HEATHER: '#bfc7d5',
  LYNCH: '#697098',
  SHARK: '#242526',
  YELLOW1: '#ffc000',
  YELLOW2: '#f2db99',
  YELLOW3: '#FFF2CC',
  SHUTTLE_GREY: '#565E67',
  GREY1: '#c2c2c2',
  GREY2: '#d9d9d9',
  GREY3: '#5e5e5e',
  GREY4: '#f2f2f2', // default screen background
  GREY5: '#ECECEC',
  GREY6: '#8c8c8c',
  GREY7: '#F8F8F8',

};

export const SCHEMA = {
  label: 'label',
  value: 'value',
  icon: 'icon',
  parent: 'parent',
  selectable: 'selectable',
  disabled: 'disabled',
};

export const MODE = {
  DEFAULT: 'BADGE',
  SIMPLE: 'SIMPLE',
  BADGE: 'BADGE',
};

export const LIST_MODE = {
  DEFAULT: 'FLATLIST',
  FLATLIST: 'FLATLIST',
  SCROLLVIEW: 'SCROLLVIEW',
  MODAL: 'MODAL',
};

export const DROPDOWN_DIRECTION = {
  DEFAULT: 'AUTO',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  AUTO: 'AUTO',
};

export const LANGUAGE = {
  DEFAULT: 'EN',
  FALLBACK: 'EN',

  ENGLISH: 'EN',
  ARABIC: 'AR',
  FARSI: 'FA',
  TURKISH: 'TR',
};

export const GET_DROPDOWN_DIRECTION = (direction) => {
  switch (direction) {
    case DROPDOWN_DIRECTION.AUTO:
      return 'top';
    case DROPDOWN_DIRECTION.TOP:
      return 'bottom';
    case DROPDOWN_DIRECTION.BOTTOM:
      return 'top';
    default:
      return 'top';
  }
};

const STYLE_DIRECTION_KEYS = {
  marginStart: 'marginRight',
  marginEnd: 'marginLeft',
  paddingStart: 'paddingRight',
  paddingEnd: 'paddingLeft',
  marginLeft: 'marginRight',
  marginRight: 'marginLeft',
  paddingLeft: 'paddingRight',
  paddingRight: 'paddingLeft',
};

export const RTL_DIRECTION = (rtl, style) => {
  const newStyle = { ...style };

  if (rtl && !I18nManager.isRTL) {
    if (Object.prototype.hasOwnProperty.call(newStyle, 'flexDirection')) {
      newStyle.flexDirection = newStyle.flexDirection === 'row' ? 'row-reverse' : 'row';
    } else {
      newStyle.flexDirection = 'row-reverse';
    }
  }

  return newStyle;
};

export const RTL_STYLE = (rtl, style) => {
  const newStyle = { ...style };

  if (rtl && !I18nManager.isRTL) {
    Object.keys(style).foreach((key) => {
      if (Object.prototype.hasOwnProperty.call(STYLE_DIRECTION_KEYS, key)) {
        newStyle[STYLE_DIRECTION_KEYS[key]] = newStyle[key];
        delete newStyle[key];
      }
    });
  }

  return newStyle;
};

export const BADGE_COLORS = [Colors.ALTO];

export const BADGE_DOT_COLORS = [Colors.GREY];

export const ASCII_CODE = (str) => {
  let chr = 0;

  if (str.length === 0) return chr;

  for (let i = 0; i < str.length; i += 1) chr += str.charCodeAt(i);

  return chr;
};

export const HELPERS = {
  GET_SELECTED_ITEM: (items, value, key = 'value') => items.find((item) => item[key] === value),
  GET_SELECTED_ITEMS: (items, values, key = 'value') => {
    if (values === null) return [];

    return items.filter((item) => values.includes(item[key]));
  },
};
