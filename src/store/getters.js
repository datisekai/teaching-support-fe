/* eslint-disable */
export const getters = {
  isAuthenticated(state) {
    return !!state.token;
  },
  products(state) {
    return state.products;
  },
  productDetail(state) {
    return state.productDetail;
  },
  coupons(state) {
    return state.coupons;
  },
  campaigns(state) {
    return state.campaigns;
  },
  flashsales(state) {
    return state.flashsales;
  },
  categories(state) {
    return state.collections;
  },
  reviews(state) {
    return state.reviews;
  },
  provinces(state) {
    return state.provinces;
  },
  customers(state) {
    return state.customers;
  },
  staff(state) {
    return state.staff
  },
  pages(state) {
    return state.pages;
  },
  menus(state) {
    return state.menus;
  },
  tags(state) {
    return state.tags;
  },
  meta(state) {
    return state.meta;
  },
  notifications(state) {
    return state.notifications;
  },
  couponSettingMeta(state) {
    return state.couponSettingMeta;
  },
  routePermission(state) {
    return state.routePermission;
  },
  role(state) {
    return state.role;
  }
};

