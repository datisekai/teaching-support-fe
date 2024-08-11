/* eslint-disable*/
window.__CONST = window.__CONST ? window.__CONST : {};
import * as types from "./mutation-types";
import util from "../helpers/util";
const translates = {};

if (window.__CONST.translates) {
  let trans = window.__CONST.translates;
  let keys = Object.keys(window.__CONST.translates);
  for (let key of keys) {
    translates[key.toUpperCase()] = trans[key];
  }
}

function __(label) {
  let handle = (label ? label : "").toUpperCase();
  return translates[handle] ? translates[handle] : label;
}

if (translates["FAVICON"]) {
  util.changeFavicon(process.env.VUE_APP_API_BASE_URL + translates["FAVICON"]);
}

export const mutations = {
  [types.AUTH_REQUEST]: state => {
    state.status = "loading";
  },

  [types.AUTH_SUCCESS]: (state, data) => {
    state.status = "success";
    console.log("AUTH_SUCCESS", data);
    const token = data.token;
    const role = data.user.role;
    util.setCookie("token", token, 30);
    util.setCookie("role", role, 30);
    util.setCookie("user", JSON.stringify(data.user || data), 30);
    state.user = data.user;
    state.role = role;
    state.token = token;
  },

  [types.AUTH_ERROR]: state => {
    state.status = "error";
  },

  [types.LOGOUT]: state => {
    util.eraseCookie("user");
    util.eraseCookie("role");
    util.eraseCookie("token");
    localStorage.clear();
    state.role = "";
    state.user = "";
    state.token = "";
  },

  [types.INIT_LANGUAGES](state, languages) {
    state.languages = languages;
  },

  [types.CHANGE_LANGUAGE](state, language) {
    state.language = language;
    util.setCookie("language", language, 30);
  },

  // order
  [types.FETCH_ORDERS](state, orders) {
    state.orders = orders;
  },

  [types.FETCH_ORDER_DETAIL](state, order) {
    state.orderDetail = order;
  },

  [types.FETCH_ORDER_SHIPPING](state, shippings) {
    state.orderShipping = shippings;
  },

  [types.STORE_ORDER](state, resp) {
    let { name, order_status, total, created_at } = resp.form;
    let { id } = resp.data;
    state.orders.push({
      id,
      name,
      order_status,
      total,
      created_at
    });
  },

  // review
  [types.FETCH_REVIEWS](state, data) {
    state.reviews = data;
  },
  [types.FETCH_REVIEW_DETAIL](state, data) {
    state.reviewDetail = data;
  },
  [types.FETCH_REVIEW_REPLIES](state, data) {
    state.reviewReplies = data;
  },

  // notification
  [types.FETCH_NOTIFICATIONS](state, data) {
    state.notifications = data;
  },
  [types.FETCH_NOTIFICATION_DETAIL](state, data) {
    state.notificationDetail = data;
  },

  // product
  [types.FETCH_PRODUCTS](state, data) {
    state.products = data;
  },
  //My room
  [types.FETCH_MY_ROOMS](state, data) {
    state.myRooms = data;
  },

  [types.FETCH_PRODUCT_DETAIL](state, product) {
    state.productDetail = product;
  },

  [types.STORE_PRODUCT](state, resp) {
    let {
      title,
      content,
      description,
      collections,
      tags,
      status,
      image
    } = resp.form;
    let { id } = resp.data;
    state.products.push({
      id,
      title,
      content,
      description,
      collections,
      tags,
      status,
      image
    });
  },

  [types.UPDATE_PRODUCT](state, resp) {
    state.productDetail = resp;
  },

  [types.REMOVE_PRODUCT](state, resp) {
    state.products = state.products.filter(row => {
      return row.id != resp.id;
    });
  },

  [types.STORE_VARIANT](state, resp) {
    let {
      title,
      list_image,
      price,
      price_compare,
      status,
      stock_quant,
      product_id
    } = resp.form;
    let { id } = resp.data;
    state.productDetail.variants.push({
      id,
      title,
      list_image,
      price,
      price_compare,
      status,
      stock_quant,
      product_id
    });
  },

  //attribute
  [types.FETCH_PRODUCT_ATTRIBUTES](state, data) {
    state.productAttributes = data;
  },

  [types.FETCH_VARIANT_ATTRIBUTES](state, data) {
    state.variantAttributes = data;
  },

  [types.FETCH_COLOR_ATTRIBUTES](state, data) {
    state.colorAttributes = data;
  },

  [types.FETCH_COLLECTIONS](state, collections) {
    state.collections = collections;
  },

  [types.FETCH_COLLECTION_DETAIL](state, collection) {
    state.collectionDetail = collection;
    state.productInCollection = collection.products;
  },

  [types.STORE_COLLECTION](state, resp) {
    let {
      title,
      content,
      description,
      parent_id,
      tags,
      status,
      image
    } = resp.form;
    let { id } = resp.data;
    state.collections.push({
      id,
      title,
      content,
      description,
      parent_id,
      tags,
      status,
      image
    });
  },

  [types.UPDATE_COLLECTION](state, resp) {},

  [types.REMOVE_COLLECTION](state, resp) {
    state.collections = state.collections.filter(row => {
      return row.id != resp.id;
    });
  },

  [types.REMOVE_PRODUCT_COLLECTION](state, arrID) {
    state.productInCollection = state.productInCollection.filter(row => {
      return arrID.indexOf(row.id) == -1;
    });
  },

  // page
  [types.FETCH_PAGES](state, pages) {
    state.pages = pages;
  },

  [types.FETCH_PAGE_DETAIL](state, page) {
    state.pageDetail = page;
  },

  [types.FETCH_ROLE_DETAIL](state, data) {
    state.roleDetail = data;
  },

  [types.STORE_PAGE](state, resp) {
    let { title, content, description, isActive, image } = resp.form;
    let { id } = resp.data;
    state.pages.push({
      id,
      title,
      content,
      description,
      isActive,
      image
    });
  },

  [types.UPDATE_PAGE](state, resp) {},

  [types.REMOVE_PAGE](state, resp) {
    state.pages = state.pages.filter(row => {
      return row.id != resp.id;
    });
  },

  // coupon
  [types.FETCH_COUPONS](state, coupons) {
    state.coupons = coupons;
  },

  [types.FETCH_COUPON_DETAIL](state, coupon) {
    state.couponDetail = coupon;
  },

  [types.STORE_COUPON](state, resp) {
    let { title, code, start_date, end_date, status } = resp.form;
    let { id } = resp.data;
    state.coupons.push({
      id,
      title,
      code,
      start_date,
      end_date,
      status
    });
  },

  [types.REMOVE_COUPON](state, resp) {
    state.coupons = state.coupons.filter(row => {
      return row.id != resp.id;
    });
  },

  // campaign
  [types.FETCH_CAMPAIGNS](state, campaigns) {
    state.campaigns = campaigns.filter(c => c.discountType !== "flashsale");
  },

  [types.FETCH_CAMPAIGN_DETAIL](state, campaign) {
    state.campaignDetail = campaign;
  },

  [types.STORE_CAMPAIGN](state, resp) {
    let { title, startDate, endDate, isActive } = resp.form;
    let { id } = resp.data;
    state.campaigns.push({
      id,
      title,
      startDate,
      endDate,
      isActive
    });
  },

  [types.REMOVE_CAMPAIGN](state, resp) {
    state.campaigns = state.campaigns.filter(row => {
      return row.id != resp.id;
    });
  },

  // flashsale
  [types.FETCH_FLASHSALES](state, flashsales) {
    state.flashsales = flashsales;
  },

  [types.FETCH_FLASHSALE_DETAIL](state, flashsale) {
    state.flashsaleDetail = flashsale;
  },

  [types.STORE_FLASHSALE](state, resp) {
    let { title, startDate, endDate, isActive } = resp.form;
    let { id } = resp.data;
    state.flashsales.push({
      id,
      title,
      startDate,
      endDate,
      isActive
    });
  },

  [types.REMOVE_FLASHSALE](state, resp) {
    state.flashsales = state.flashsales.filter(row => {
      return row.id != resp.id;
    });
  },

  // province
  [types.FETCH_PROVINCES](state, provinces) {
    state.provinces = provinces;
  },
  // district
  [types.FETCH_DISTRICTS](state, districts) {
    state.districts = districts;
  },
  // ward
  [types.FETCH_WARDS](state, wards) {
    state.wards = wards;
  },

  [types.FETCH_CUSTOMER](state, customers) {
    state.customers = customers;
  },

  [types.FETCH_TESTIMONIAL](state, testimonials) {
    state.testimonials = testimonials;
  },

  [types.FETCH_TESTIMONIAL_DETAIL](state, testimonial) {
    state.testimonialDetail = testimonial;
  },

  [types.FETCH_CLIENT](state, clients) {
    state.clients = clients;
  },

  [types.FETCH_CLIENT_DETAIL](state, client) {
    state.clientDetail = client;
  },

  [types.FETCH_SUBSCRIBER](state, subscribers) {
    state.subscribers = subscribers;
  },

  [types.FETCH_CONTACT](state, contact) {
    state.contact = contact;
  },

  [types.FETCH_CONTACT_DETAIL](state, contact) {
    state.contactDetail = contact;
  },

  [types.FETCH_REVIEW](state, review) {
    state.review = review;
  },

  [types.FETCH_COMMENT](state, comment) {
    state.comment = comment;
  },

  [types.FETCH_MENUS](state, menus) {
    state.menus = menus;
  },

  [types.FETCH_MENU_DETAIL](state, menu) {
    state.menuDetail = menu;
  },

  [types.FETCH_MENU_DETAIL_EDIT](state, menu) {
    state.menuDetailEdit = menu;
  },

  [types.REMOVE_MENU](state, resp) {
    state.menus = state.menus.filter(row => {
      return row.id != resp.id;
    });
  },

  [types.FETCH_USERS](state, users) {
    state.users = users;
  },

  [types.FETCH_USER_DETAIL](state, user) {
    state.userDetail = user;
  },

  [types.REMOVE_USER](state, resp) {
    state.users = state.users.filter(row => {
      return row.id != resp.id;
    });
  },

  [types.FETCH_HISTORY](state, histories) {
    state.histories = histories;
  },

  [types.FETCH_SHIPPING](state, shippings) {
    state.shippings = shippings;
  },

  [types.FETCH_SHIPPING_DETAIL](state, shipping) {
    state.shippingDetail = shipping;
  },

  [types.FETCH_SHIPPING_EDIT](state, shipping) {
    state.shippingEdit = shipping;
  },

  [types.FETCH_ROLE](state, roles) {
    state.roles = roles;
  },

  [types.FETCH_DELETED](state, deleted) {
    state.deleted = deleted;
  },

  [types.FETCH_DELETED_DETAIL](state, deleted) {
    state.deletedDetail = deleted;
  },

  [types.MESSAGE](state, payload) {
    if (!payload.code) {
    }
  },

  [types.SET_CURRENT_ACTIONS](state, payload) {
    let items = payload.map(item => {
      if (item.label) {
        item.label = __(item.label);
      }
      if (item.title) {
        item.title = __(item.title);
      }
      return item;
    });
    state.currentActions = items;
  },

  [types.SET_PAGE_TITLE](state, title) {
    state.pageTitle = __(title);
  },

  [types.FETCH_DASHBOARD_STATISTIC](state, data) {
    state.histories = data.history;
    state.statsCards = [
      {
        type: "warning",
        icon: "nc-icon nc-money-coins",
        title: "Tổng doanh thu",
        value: util.formatVndShort(data.orderPriceTotal || 0),
        detail: "/orders/all",
        key: "revenue_total"
      },
      {
        type: "success",
        icon: "ec-cart-5",
        title: "Tổng số đơn hàng",
        value: data.orderCount || 0,
        detail: "/orders/all",
        key: "order_total"
      },
      {
        type: "danger",
        icon: "ec-bag-3",
        title: "Giá trị Đơn hàng TB",
        value: util.formatVndShort(
          Math.floor(data.orderPriceTotal / data.orderCount) || 0
        ),
        detail: "/orders/all",
        key: "order_average"
      },
      {
        type: "info",
        icon: "ec-box-3",
        title: "Tổng số sản phẩm",
        value: data.productCount || 0,
        detail: "/product",
        key: "product_total"
      },
      {
        type: "warning",
        icon: "el-icon-document",
        title: "Tổng số bài viết",
        value: data.articleCount || 0,
        detail: "/articles",
        key: "article_total"
      },
      {
        type: "success",
        icon: "el-icon-message",
        title: "Tổng số liên hệ",
        value: data.contactCount || 0,
        detail: "/contact",
        key: "contact_total"
      }
    ];
    state.dashboardContact = data.contact;

    let visit = util.formatDataChartDashboard(data.visit);
    state.dashboardVisit.data.labels = visit.labels;
    state.dashboardVisit.data.datasets[0].data = visit.result;

    let order = util.formatDataChartDashboard(data.order);
    state.dashboardOrder.data.labels = order.labels;
    state.dashboardOrder.data.datasets[0].data = order.result;
  },

  [types.FETCH_CUSTOMER_DETAIL](state, customerDetail) {
    state.customerDetail = customerDetail;
  },

  [types.FETCH_CUSTOMER_ORDERS](state, customerOrders) {
    state.customerOrders = customerOrders;
  },

  [types.FETCH_TAGS](state, tags) {
    state.tags = tags;
  },

  [types.FETCH_META](state, meta) {
    state.meta = meta;
  },

  [types.FETCH_PALETTE](state, palette) {
    state.palette = palette.metaValue;
  },

  [types.FETCH_COUPON_SETTING_META](state, couponSettingMeta) {
    state.couponSettingMeta = couponSettingMeta;
  },

  [types.STORE_META](state, resp) {
    const { metaKey, metaValue } = resp.form;
    const { createdAt } = resp.data;
    state.meta.unshift({ metaKey, metaValue, createdAt });
  },

  [types.UPDATE_META](state, data) {
    const { metaKey, metaValue, createdAt } = data;
    const m = state.meta.find(m => m.metaKey == metaKey);
    if (m) {
      m.metaKey = metaKey;
      m.metaValue = metaValue;
    } else {
      state.meta.unshift({ metaKey, metaValue, createdAt });
    }
  },

  [types.REMOVE_META](state, resp) {
    state.meta = state.meta.filter(m => m.metaKey != resp.metaKey);
  },

  [types.FETCH_MODEL](state, models) {
    state.models = models.models;
    state.modelMenus = models.menus;
  },

  [types.STORE_MODEL](state, resp) {
    state.models.unshift(resp.data);
  },

  [types.UPDATE_MODEL](state, data) {
    const { parentId, sku, name, expiredIn } = data;
    state.models = state.models.map(m => {
      if (parentId == -1) {
        if (m.id == data.id) {
          m.sku = sku;
          m.name = name;
          m.expiredIn = expiredIn;
        }
      } else {
        if (m.id == parentId) {
          m.children = m.children.map(c => {
            c.sku = sku;
            c.name = name;
            c.expiredIn = expiredIn;
            return c;
          });
        }
      }
      return m;
    });
  },

  [types.REMOVE_MODEL](state, resp) {
    state.models = state.models.filter(m => m.id != resp.id);
    state.models = state.models.map(m => {
      m.children = m.children.filter(c => c.id != resp.id);
      return m;
    });
  },

  [types.FETCH_PRODUCT_ERROR](state, productErrors) {
    state.productErrors = productErrors.productErrors;
    state.productErrorMenus = productErrors.menus;
  },

  [types.STORE_PRODUCT_ERROR](state, resp) {
    state.productErrors.unshift(resp.data);
  },

  [types.UPDATE_PRODUCT_ERROR](state, data) {
    const { parentId, note, name, code } = data;
    state.productErrors = state.productErrors.map(m => {
      if (parentId == -1) {
        if (m.id == data.id) {
          m.name = name;
        }
      } else {
        if (m.id == parentId) {
          m.children = m.children.map(c => {
            c.name = name;
            c.note = note;
            c.code = code;
            return c;
          });
        }
      }
      return m;
    });
  },

  [types.REMOVE_PRODUCT_ACCESSORIES](state, resp) {
    state.productAccessories = state.productAccessories.map(m => {
      m.children = m.children.filter(c => c.id != resp.id);
      return m;
    });
  },

  [types.FETCH_PRODUCT_ACCESSORIES](state, productAccessories) {
    state.productAccessories = productAccessories.productAccessories;
    state.productAccessoryMenus = productAccessories.menus;
  },

  [types.STORE_PRODUCT_ACCESSORIES](state, resp) {
    state.productAccessories.unshift(resp.data);
  },

  [types.UPDATE_PRODUCT_ACCESSORIES](state, data) {
    const { name, price, productLineId } = data;
    state.productAccessories = state.productAccessories.map(m => {
      if (m.id == productLineId) {
        m.children = m.children.map(c => {
          if (c.id == data.id) {
            c.name = name;
            c.price = price;
          }
          return c;
        });
      }
      return m;
    });
  },

  [types.REMOVE_PRODUCT_ACCESSORIES](state, resp) {
    state.productAccessories = state.productAccessories.map(m => {
      m.children = m.children.filter(c => c.id != resp.id);
      return m;
    });
  },

  [types.FETCH_WARRANTY_CODE](state, warrantyCodes) {
    state.warrantyCodes = warrantyCodes;
  },

  [types.STORE_WARRANTY_CODE](state, resp) {
    state.warrantyCodes.unshift(...resp.data);
  },

  [types.REMOVE_WARRANTY_CODE](state, resp) {
    state.warrantyCodes = state.warrantyCodes.filter(m => m.id != resp.id);
  },

  [types.FETCH_WARRANTY_FORMS](state, warrantyForms) {
    state.warrantyForms = warrantyForms;
  },

  [types.FETCH_WARRANTY_FORM_DETAIL](state, data) {
    state.warrantyFormDetail = data;
  },

  [types.STORE_WARRANTY_FORM](state, resp) {
    state.warrantyForms.unshift(resp.data);
  },

  [types.REMOVE_WARRANTY_FORM](state, id) {
    state.warrantyForms = state.warrantyForms.filter(m => m.id != id);
  },
  [types.CONTACT_WARRANTY_FORM](state, id) {
    state.warrantyForms = state.warrantyForms.map(i => {
      if (i.id === id) {
        i.status === "contacted";
      }
      return i;
    });
  },

  [types.FETCH_MAINTENANCE_FORMS](state, maintenanceForms) {
    state.maintenanceForms = maintenanceForms;
  },

  [types.FETCH_MAINTENANCE_FORM_DETAIL](state, data) {
    state.maintenanceFormDetail = data;
  },

  [types.STORE_MAINTENANCE_FORM](state, resp) {
    state.maintenanceForms.unshift(resp.data);
  },

  [types.REMOVE_MAINTENANCE_FORM](state, resp) {
    state.maintenanceForms = state.maintenanceForms.filter(
      m => m.id != resp.id
    );
  },

  [types.FETCH_RECEIPTS](state, receipts) {
    state.receipts = receipts;
  },

  [types.FETCH_RECEIPT_DETAIL](state, data) {
    state.receiptDetail = data;
  },

  [types.STORE_RECEIPT](state, resp) {
    state.receipts.unshift(resp.data);
  },

  [types.REMOVE_RECEIPT](state, resp) {
    state.receipts = state.receipts.filter(m => m.id != resp.id);
  },

  [types.FETCH_QUOTATIONS](state, quotations) {
    state.quotations = quotations;
  },

  [types.FETCH_QUOTATION_DETAIL](state, data) {
    state.quotationDetail = data;
  },

  [types.STORE_QUOTATION](state, resp) {
    state.quotations.unshift(resp.data);
  },

  [types.REMOVE_QUOTATION](state, resp) {
    state.quotations = state.quotations.filter(m => m.id != resp.id);
  },

  [types.FETCH_INVOICES](state, invoices) {
    state.invoices = invoices;
  },

  [types.FETCH_INVOICE_DETAIL](state, data) {
    state.invoiceDetail = data;
  },

  [types.STORE_INVOICE](state, resp) {
    state.invoices.unshift(resp.data);
  },

  [types.REMOVE_INVOICE](state, resp) {
    state.invoices = state.invoices.filter(m => m.id != resp.id);
  },

  [types.FETCH_REIMBURSEMENTS](state, reimbursements) {
    state.reimbursements = reimbursements;
  },

  [types.FETCH_REIMBURSEMENT_DETAIL](state, data) {
    state.reimbursementDetail = data;
  },

  [types.STORE_REIMBURSEMENT](state, resp) {
    state.reimbursements.unshift(resp.data);
  },

  [types.REMOVE_REIMBURSEMENT](state, resp) {
    state.reimbursements = state.reimbursements.filter(m => m.id != resp.id);
  },

  // Warranty Post

  [types.FETCH_WARRANTY_POSTS](state, warrantyPosts) {
    state.warrantyPosts = warrantyPosts;
  },

  [types.FETCH_WARRANTY_POST_DETAIL](state, data) {
    state.warrantyPostDetail = data;
  },

  [types.CREATE_WARRANTY_POST](state, resp) {
    // state.warrantyPosts.unshift(resp.data);
  },

  [types.REMOVE_WARRANTY_POST](state, postId) {
    state.warrantyPosts = state.warrantyPosts.filter(m => m.id != postId);
  },

  [types.UPDATE_WARRANTY_POST](state, data) {
    state.warrantyPostDetail = data;
    state.warrantyPosts = state.warrantyPosts.map(w => {
      if (w.id === data.id) {
        w = data;
      }
      return w;
    });
  },

  // WARRANTY LOCATIONS
  [types.FETCH_WARRANTY_LOCATIONS](state, warrantyLocations) {
    state.warrantyLocations = warrantyLocations;
  },

  [types.FETCH_WARRANTY_LOCATION_DETAIL](state, data) {
    state.warrantyLocationDetail = data;
  },

  [types.CREATE_WARRANTY_LOCATION](state, resp) {
    state.warrantyLocations.unshift(resp.data);
  },

  [types.REMOVE_WARRANTY_LOCATION](state, resp) {
    state.warrantyLocations = state.warrantyLocations.filter(
      m => m.id != resp.id
    );
  },

  [types.UPDATE_WARRANTY_LOCATION](state, data) {
    state.warrantyLocationDetail = data;
    state.warrantyLocations = state.warrantyLocations.map(l => {
      if (l.id === data.id) {
        l = data;
      }
      return l;
    });
  },

  // Volume
  [types.FETCH_VOLUMES](state, data) {
    state.volumes = data;
  },

  [types.FETCH_VOLUME_DETAIL](state, volume) {
    state.volumeDetail = volume;
  },

  [types.STORE_VOLUME](state, resp) {},

  [types.UPDATE_VOLUME](state, resp) {},

  [types.REMOVE_VOLUME](state, resp) {
    state.volumes = state.products.filter(row => {
      return row.id != resp.id;
    });
  },

  //document
  [types.FETCH_DOCUMENTS](state, data) {
    state.documents = data;
  },
  [types.FETCH_DOCUMENT_DETAIL](state, data) {
    state.documentDetail = data;
  },
  [types.UPDATE_DOCUMENT](state, data) {
    state.documentDetail = data;
    state.documents = state.documents.map(d => {
      if (d.id === data.id) {
        d = data;
      }
      return d;
    });
  },
  [types.CREATE_DOCUMENT](state, data) {
    state.documents.unshift(data);
  },
  [types.REMOVE_DOCUMENT](state, id) {
    state.documents = state.documents.filter(d => d.id != id);
  },
  //teacher
  [types.FETCH_TEACHERS](state, data) {
    state.teachers = data;
  },
  [types.FETCH_TEACHER_DETAIL](state, data) {
    state.teacherDetail = data;
  },
  [types.UPDATE_TEACHER](state, data) {
    state.teacherDetail = data;
    state.teachers = state.teachers.map(d => {
      if (d.id === data.id) {
        d = data;
      }
      return d;
    });
  },
  [types.REJECT_TEACHER](state, data) {
    state.teacherDetail = data;
  },
  [types.CONFIRM_TEACHER](state, data) {
    state.teacherDetail = data;
  },
  // survey
  [types.FETCH_SURVEYS](state, data) {
    state.surveys = data;
  },
  [types.FETCH_SURVEY_DETAIL](state, data) {
    state.surveyDetail = data;
  },
  [types.CREATE_SURVEY](state, data) {
    state.surveys.unshift(data);
  },
  [types.UPDATE_SURVEY](state, data) {
    state.surveyDetail = data;
    state.surveys = state.surveys.map(s => {
      if (s.id == data.id) {
        s = data;
      }
      return s;
    });
  },
  [types.REMOVE_SURVEY](state, id) {
    state.surveys = state.surveys.filter(s => s.id != id);
  },

  //post
  [types.CREATE_SURVEY](state, data) {
    state.surveys.unshift(data);
  },
  [types.UPDATE_SURVEY](state, data) {
    state.surveyDetail = data;
    state.surveys = state.surveys.map(s => {
      if (s.id === data.id) {
        s = data;
      }
      return s;
    });
  },
  [types.REMOVE_SURVEY](state, id) {
    state.surveys = state.surveys.filter(s => s.id != id);
  },
  //Education
  [types.FETCH_EDUCATION_POSTS](state, educationPosts) {
    state.educationPosts = educationPosts;
  },

  [types.FETCH_EDUCATION_POST_DETAIL](state, data) {
    state.educationPostDetail = data;
  },
  [types.FETCH_ROOM_DETAIL](state, data) {
    state.roomDetail = data;
  },

  [types.STORE_EDUCATION_POST](state, resp) {
    state.educationPosts.unshift(resp.data);
  },

  [types.REMOVE_EDUCATION_POST](state, postId) {
    state.educationPosts = state.educationPosts.filter(m => m.id != postId);
  },

  [types.CREATE_EDUCATION_POST](state, data) {
    state.educationPosts.unshift(data);
  },
  [types.UPDATE_EDUCATION_POST](state, data) {
    state.educationPostDetail = data;
    state.educationPosts = state.educationPosts.map(e => {
      if (e.id === data.id) {
        e = data;
      }
      return e;
    });
  },

  // education coupon
  [types.FETCH_EDUCATION_COUPONS](state, educationCoupons) {
    state.educationCoupons = educationCoupons;
  },

  [types.FETCH_EDUCATION_COUPON_DETAIL](state, educationCouponDetail) {
    state.educationCouponDetail = educationCouponDetail;
  },
  [types.UPDATE_EDUCATION_COUPON](state, data) {
    state.educationCouponDetail = data;
    state.educationCoupons = state.educationCoupons.map(c => {
      if (c.id === data.id) {
        c = data;
      }
      return c;
    });
  },
  [types.CREATE_EDUCATION_COUPON](state, data) {
    state.educationCoupons.unshift(data);
  },
  [types.REMOVE_EDUCATION_COUPON](state, id) {
    state.educationCoupons = state.educationCoupons.filter(c => {
      return c.id != id;
    });
  },

  //customer service coupon
  [types.FETCH_CS_COUPONS](state, csCoupons) {
    state.csCoupons = csCoupons;
  },

  [types.FETCH_CS_COUPON_DETAIL](state, csCouponDetail) {
    state.csCouponDetail = csCouponDetail;
  },
  [types.UPDATE_CS_COUPON](state, data) {
    state.csCouponDetail = data;
    state.csCoupons = state.csCoupons.map(c => {
      if (c.id === data.id) {
        c = data;
      }
      return c;
    });
  },
  [types.CREATE_CS_COUPON](state, data) {
    state.csCoupons.unshift(data);
  },
  [types.REMOVE_CS_COUPON](state, id) {
    state.csCoupons = state.csCoupons.filter(c => {
      return c.id != id;
    });
  },

  // exam
  [types.FETCH_EXAMS](state, data) {
    state.exams = data;
  },
  [types.FETCH_EXAM_DETAIL](state, data) {
    state.examDetail = data;
  },
  [types.CREATE_EXAM](state, data) {
    state.exams.unshift(data);
  },
  [types.UPDATE_EXAM](state, data) {
    state.examDetail = data;
    state.exams = state.exams.map(e => {
      if (e.id === data.id) {
        e = data;
      }
      return e;
    });
  },
  [types.REMOVE_EXAM](state, id) {
    state.exams = state.exams.filter(e => e.id != id);
  },

  //question
  [types.FETCH_QUESTIONS](state, data) {
    state.questions = data;
  },
  [types.FETCH_QUESTION_DETAIL](state, data) {
    state.questionDetail = data;
  },
  [types.CREATE_QUESTION](state, data) {
    state.questions.unshift(data);
  },
  [types.UPDATE_QUESTION](state, data) {
    state.questionDetail = data;
    state.questions = state.questions.map(q => {
      if (q.id == data.id) {
        q = data;
      }
      return q;
    });
  },
  [types.REMOVE_QUESTION](state, id) {
    state.questions = state.questions.filter(q => q.id != id);
  },

  // ticket
  [types.CLEAR_TICKETS](state, data) {
    state.tickets = [];
  },
  [types.FETCH_TICKETS](state, data) {
    state.tickets.push(...data.data);
    state.ticketTotal = data.total;
  },
  [types.CLOSE_TICKET](state, data) {
    if (data.status === "all") {
      state.tickets.forEach(ticket => {
        if (ticket.id === data.id) {
          ticket.status = "closed";
        }
      });
    } else {
      const index = state.tickets.findIndex(t => t.id === data.id);
      if (index > -1) {
        state.tickets.splice(index, 1);
      }
    }
  },

  //report
  [types.FETCH_REPORT](state, form) {
    switch (form.department) {
      case "education":
        state.report.education.article = form.data.find(
          f => f.type == "education_article"
        );
        state.report.education.exam = form.data.find(
          f => f.type == "education_exam"
        );
        state.report.education.survey = form.data.find(
          f => f.type == "education_survey"
        );
        break;
      case "customer_service":
        state.report.customer_service.ticket = form.data.find(
          f => f.type == "customer_service_ticket"
        );
        state.report.customer_service.survey = form.data.find(
          f => f.type == "customer_service_survey"
        );
        break;
      case "warranty":
        state.report.warranty.article = form.data.find(
          f => f.type == "warranty_article"
        );
        state.report.warranty.code_created = form.data.find(
          f => f.type == "warranty_code_created"
        );
        state.report.warranty.code_activated = form.data.find(
          f => f.type == "warranty_code_activated"
        );
        break;
      default:
        break;
    }
  },

  //activated products
  [types.FETCH_ACTIVATED_PRODUCTS](state, data) {
    state.activatedProducts = data;
  },

  // categories
  [types.FETCH_CATEGORIES](state, data) {
    state.categories = data;
  },
  [types.FETCH_CATEGORY_DETAIL](state, data) {
    state.categoryDetail = data;
  },
  [types.UPDATE_CATEGORY_DETAIL](state, data) {
    state.categoryDetail = data;
  },
  [types.FETCH_ATTRIBUTES](state, data) {
    state.attributes = data;
  },
  [types.CREATE_ATTRIBUTE](state, data) {
    state.attributes.push(data);
  },
  [types.CREATE_ATTRIBUTE_OPTION](state, data) {
    const index = state.attributes.findIndex(a => a.id === data.attributeId);
    const [attribute] = state.attributes.splice(index, 1);
    attribute.options.push(data);
    state.attributes.splice(index, 0, attribute);
  },
  [types.UPDATE_ATTRIBUTE_OPTION](state, data) {
    const index = state.attributes.findIndex(a => a.id === data.attributeId);
    const [attribute] = state.attributes.splice(index, 1);
    const indexOption = attribute.options.findIndex(o => o.id === data.id);
    attribute.options.splice(indexOption, 1, data);
    state.attributes.splice(index, 0, attribute);
  },
  [types.FETCH_ARTICLES](state, data) {
    state.articles = data;
  },
  [types.FETCH_ARTICLE_DETAIL](state, data) {
    state.articleDetail = data;
  },
  [types.FETCH_SETTING_DATA](state, data) {
    state.setting = data;
  },
  [types.REMOVE_ROOM](state, resp) {
    state.myRooms = state.myRooms.filter(row => {
      return row.id != resp.id;
    });
  },
  [types.FETCH_ROOM_STUDENTS](state, data) {
    state.roomStudents = data;
  },
  [types.FETCH_LOG_STUDENTS](state, data) {
    state.logStudents = data;
  },
  [types.RESET_ROOM_STUDENTS](state) {
    state.roomStudents = [];
  },
  [types.FETCH_DEPARTMENTS](state, data) {
    state.departments = data;
  },
  [types.FETCH_DEPARTMENT](state, data) {
    state.department = data;
  },
  [types.REMOVE_DEPARTMENT](state, resp) {
    state.departments = state.departments.filter(row => {
      return row.id != resp.id;
    });
  },
  [types.UPDATE_DEPARTMENT](state, data) {
    state.department = { ...state.department, ...data };
  },
  [types.FETCH_COURSES](state, data) {
    state.courses = data;
  },
  [types.FETCH_COURSE](state, data) {
    state.course = data;
  },
  [types.REMOVE_COURSE](state, resp) {
    state.courses = state.courses.filter(row => {
      return row.id != resp.id;
    });
  },
  [types.UPDATE_COURSE](state, data) {
    state.course = { ...state.course, ...data };
  },
  [types.FETCH_GROUPS](state, data) {
    state.groups = data;
  },
  [types.FETCH_GROUP](state, data) {
    state.group = data;
  },
  [types.REMOVE_GROUP](state, resp) {
    state.groups = state.groups.filter(row => {
      return row.id != resp.id;
    });
  },
  [types.UPDATE_GROUP](state, data) {
    state.group = { ...state.group, ...data.form };
    console.log("state", state.group);
  },
  [types.SET_LOADING](state, loading) {
    state.loading = loading;
  }
};
