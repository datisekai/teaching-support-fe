/* eslint-disable*/
import api from "../api";
import util from "../helpers/util";
import * as types from "./mutation-types";
import { resolve } from "core-js/fn/promise";

function buildQuery(params) {
  if (!params) {
    return "";
  }
  if (typeof params === "string") {
    return params;
  }
  if (typeof params !== "object") {
    return "";
  }
  let arr = [];
  for (let key of Object.keys(params)) {
    arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
  }
  return "?" + arr.join("&");
}

export const actions = {
  async login({ commit }, credentials) {
    const resp = await api.post("/api.auth/login", credentials);
    const body = resp.data;
    const data = body.data;
    commit(types.AUTH_SUCCESS, data);
    return data;
  },

  async checkToken({ dispatch }) {
    const resp = await api.post("/api.auth/check-token", {});
    return resp && resp.data.data;
  },

  authLogout(context) {
    let { commit } = context;
    commit(types.LOGOUT);
  },

  changeLanguage(context, lang) {
    let { commit, state } = context;
    commit(types.CHANGE_LANGUAGE, lang);
  },

  setCurrentActions(context, actions) {
    let { commit, state } = context;
    commit(types.SET_CURRENT_ACTIONS, actions);
  },

  setPageTitle(context, title) {
    let { commit, state } = context;
    commit(types.SET_PAGE_TITLE, title);
  },

  uploadImage(context, data) {
    return new Promise((resolve, reject) => {
      api
        .postForm(`/api.upload/image`, data)
        .then(resp => {
          const result = resp.data;
          if (!result.error) {
            resolve(result);
          } else {
            reject(result.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // Product
  fetchProducts(context, params) {
    let { commit, state } = context;
    return api
      .get("/api.product" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_PRODUCTS, body.data);
        return body.data;
      });
  },
  fetchProductDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.product/" + id)
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_PRODUCT_DETAIL, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  // fetchAttributes(context, params) {
  //   let { commit, state } = context;
  //   api.get('api.attribute' + buildQuery(params))
  //     .catch(err => {
  //       console.error(err.stack);
  //     })
  //     .then(resp => {
  //       let body = resp.data;
  //       if (body.data) {
  //         commit(types.FETCH_PRODUCT_ATTRIBUTES, body.data.products);
  //         commit(types.FETCH_VARIANT_ATTRIBUTES, body.data.variants);
  //         commit(types.FETCH_COLOR_ATTRIBUTES, body.data.colors);
  //       }
  //     })
  // },
  fetchCollections(context, params) {
    let { commit, state } = context;
    return api
      .get("/api.category" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_COLLECTIONS, body.data);
        return body.data;
      });
  },
  fetchCollectionDetail(context, id) {
    let { commit, state } = context;
    return api
      .get("/api.category/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_COLLECTION_DETAIL, body.data);
        return body.data;
      });
  },
  async fetchCollectProducts({ commit }, collection_id) {
    const resp = await api.get(
      "/api.category-product/" + collection_id + "/product"
    );
    const body = resp.data;
    commit(types.FETCH_PRODUCTS, body.data);
  },
  async syncProduct({ commit }, id) {
    return api.get("/api.sync/product/" + id);
  },
  addCollectProducts(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api.post("/admin/api/v4/collect-products", data).then(resp => {
        let result = resp.data;
        if (!result.code) {
          resolve("success");
        } else {
          reject("error");
        }
      });
    });
  },
  removeCollectProducts(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete(
          `/admin/api/v4/collect-products/${data.collection_id}/${data.product_id}`
        )
        .then(resp => {
          let result = resp.data;
          if (!result.code) {
            resolve("success");
          } else {
            reject("error");
          }
        });
    });
  },
  deleteCollectProducts(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api.delete(`/admin/api/v4/collect-products/${id}`).then(resp => {
        let result = resp.data;
        if (!result.code) {
          resolve("success");
        } else {
          reject("error");
        }
      });
    });
  },
  updateSpecialList({ commit, state }, { add, remove, name }) {
    return api.post(`/api.product/special/${name}`, { add, remove });
  },

  fetchOrderDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.order/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_ORDER_DETAIL, body.data);
      });
  },
  storeOrder(context, form) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .post("/api.order", form)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_ORDER, {
              form: form,
              data: body
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateOrder(context, form) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put("/admin/api/v4/orders/" + form.order.id, form)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_ORDER, {
              form: form,
              data: body
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  // User
  fetchUsers(context, params) {
    let { commit, state } = context;
    api
      .get("/api.user" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_USERS, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  // Customer
  fetchCustomers(context, params) {
    let { commit, state } = context;
    api
      .get("/api.user" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_CUSTOMER, body.data);
      });
  },
  storeCustomer(context, form) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .post("/admin/api/v4/customers", form)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateCustomer(context, form) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put("/api.user/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  fetchCustomerDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.user/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_CUSTOMER_DETAIL, body.data);
      });
  },
  fetchCustomerOrders(context, userId) {
    let { commit, state } = context;
    api
      .get("/api.order/order" + buildQuery({ userId }))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_CUSTOMER_ORDERS, body.data);
      });
  },

  // Page
  fetchPages(context, params) {
    let { commit, state } = context;
    api
      .get("/api.page" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        const body = resp.data;
        commit(types.FETCH_PAGES, body.data);
      });
  },
  fetchPageDetail(context, id) {
    let { commit, state } = context;
    return api
      .get("/api.page/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        const body = resp.data;
        commit(types.FETCH_PAGE_DETAIL, body.data);
        return body.data;
      });
  },
  storePage(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.page", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          const body = resp.data;
          if (!body.error) {
            commit(types.STORE_PAGE, {
              form: form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updatePage(context, form) {
    let { commit, state } = context;
    let seo = util.hashNested(form).seo;
    return new Promise((resolve, reject) => {
      api
        .put("/api.page/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_PAGE, {
              form: form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removePage(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.page/" + id)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.REMOVE_PAGE, {
            id: id
          });
          resolve(body.data);
        });
    });
  },

  // Coupon
  fetchCoupons(context, params) {
    let { commit, state } = context;
    api
      .get("/api.coupon" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_COUPONS, body.data);
      });
  },
  fetchCouponDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.coupon/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_COUPON_DETAIL, body.data);
      });
  },
  storeCoupon(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.coupon", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_COUPON, {
              form: form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateCoupon(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.coupon/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  generateCodeCoupon(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.coupon/generate")
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeCoupon(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.coupon/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_COUPON, {
              id: id
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },

  // Campaign
  fetchCampaigns(context, params) {
    let { commit, state } = context;
    api
      .get("/api.campaign" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_CAMPAIGNS, body.data);
      });
  },
  async fetchCampaignDetail(context, id) {
    let { commit, state } = context;
    const resp = await api.get("/api.campaign/" + id);
    const body = resp.data;
    commit(types.FETCH_CAMPAIGN_DETAIL, body.data);
    return body.data;
  },
  storeCampaign(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.campaign", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_CAMPAIGN, {
              form: form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  async updateCampaign(context, form) {
    const resp = await api.put("/api.campaign/" + form.id, form);
    const body = resp.data;
    return body.data;
  },
  async disableCampaign(context, id) {
    const resp = await api.put("/api.campaign/" + id + "/deactive");
    const body = resp.data;
    return body.data;
  },
  async enableCampaign(context, id) {
    const resp = await api.put("/api.campaign/" + id + "/active");
    const body = resp.data;
    return body.data;
  },
  removeCampaign(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.campaign/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_CAMPAIGN, {
              id: id
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  fetchProvinces(context, params) {
    let { commit, state } = context;
    api
      .get("/api.province" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_PROVINCES, body.data);
      });
  },
  fetchDistricts(context, provinceId) {
    let { commit, state } = context;
    api
      .get(`/api.province/${provinceId}/district`)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_DISTRICTS, body.data);
      });
  },
  fetchWards(context, { provinceId, districtId }) {
    let { commit, state } = context;
    api
      .get(`/api.province/${provinceId}/district/${districtId}/ward`)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_WARDS, body.data);
      });
  },
  // flashsale
  fetchFlashsales(context, params) {
    let { commit, state } = context;
    api
      .get("/api.flashsale" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_FLASHSALES, body.data);
      });
  },
  async fetchFlashsaleDetail(context, id) {
    let { commit, state } = context;
    const resp = await api.get("/api.flashsale/" + id);
    const body = resp.data;
    commit(types.FETCH_FLASHSALE_DETAIL, body.data);
    return body.data;
  },
  storeFlashsale(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.flashsale", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          const body = resp.data;
          if (!body.error) {
            commit(types.STORE_FLASHSALE, {
              form: form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  async updateFlashsale(context, form) {
    const resp = await api.put("/api.flashsale/" + form.id, form);
    const body = resp.data;
    const data = body.data;
    return data;
  },
  async disableFlashsale(context, id) {
    const resp = await api.put("/api.flashsale/" + id + "/deactive");
    const body = resp.data;
    return body.data;
  },
  async enableFlashsale(context, id) {
    const resp = await api.put("/api.flashsale/" + id + "/active");
    const body = resp.data;
    return body.data;
  },
  removeFlashsale(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.flashsale/" + id)
        .catch(err => {
          console.error(err);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.REMOVE_FLASHSALE, {
            id: id
          });
          resolve(body.data);
        });
    });
  },

  // Review
  async fetchReviews({ commit }) {
    const resp = await api.get(`/api.review`);
    const body = resp.data;
    const reviews = body.data;
    commit(types.FETCH_REVIEWS, reviews);
    return reviews;
  },
  async fetchReviewDetail({ commit }, reviewId) {
    const resp = await api.get(`/api.review/${reviewId}`);
    const body = resp.data;
    const review = body.data;
    commit(types.FETCH_REVIEW_DETAIL, review);
    return review;
  },
  async fetchReviewReplies({ commit }, reviewId) {
    const resp = await api.get(`/api.review/${reviewId}/reply`);
    const body = resp.data;
    const replies = body.data;
    commit(types.FETCH_REVIEW_REPLIES, replies);
    return replies;
  },
  async createReviewReply({ commit }, { reviewId, content }) {
    const resp = await api.post(`/api.review/${reviewId}/reply`, { content });
    const body = resp.data;
    const reply = body.data;
    return reply;
  },
  async approveReview({ commit }, reviewId) {
    const resp = await api.put(`/api.review/${reviewId}/approve`);
    const body = resp.data;
    const review = body.data;
    return review;
  },
  async rejectReview({ commit }, reviewId) {
    const resp = await api.put(`/api.review/${reviewId}/reject`);
    const body = resp.data;
    const review = body.data;
    return review;
  },
  async approveReviewReply({ commit }, { reviewId, replyId }) {
    const resp = await api.put(
      `/api.review/${reviewId}/reply/${replyId}/approve`
    );
    const body = resp.data;
    const review = body.data;
    return review;
  },
  async rejectReviewReply({ commit }, { reviewId, replyId }) {
    const resp = await api.put(
      `/api.review/${reviewId}/reply/${replyId}/reject`
    );
    const body = resp.data;
    const review = body.data;
    return review;
  },

  // notification
  async storeNotification({ commit }, notiData) {
    const resp = await api.post(`/api.notification/notification`, notiData);
    const body = resp.data;
    const noti = body.data;
    return noti;
  },

  async sendNotification({ commit }, id) {
    const resp = await api.put(`/api.notification/notification/${id}/send`);
    const body = resp.data;
    const result = body.data;
    return result;
  },

  async updateNotification({ commit }, notiData) {
    const resp = await api.put(
      `/api.notification/notification/${notiData.id}`,
      notiData
    );
    const body = resp.data;
    const noti = body.data;
    return noti;
  },

  async fetchNotifications({ commit }, query) {
    const resp = await api.get(
      `/api.notification/notification${buildQuery(query)}`
    );
    const body = resp.data;
    const notifications = body.data;
    commit(types.FETCH_NOTIFICATIONS, notifications);
    return notifications;
  },

  async fetchNotificationDetail({ commit }, id) {
    const resp = await api.get(`/api.notification/notification/${id}`);
    const body = resp.data;
    const notification = body.data;
    commit(types.FETCH_NOTIFICATION_DETAIL, notification);
    return notification;
  },

  async fetchCampaignNotification({ commit }, campaignId) {
    const resp = await api.get(
      `/api.notification/notification${buildQuery({
        referenceId: campaignId,
        type: "campaign"
      })}`
    );
    const body = resp.data;
    const notifications = body.data;
    return notifications.length ? notifications[0] : null;
  },
  async fetchFlashsaleNotification({ commit }, flashsaleId) {
    const resp = await api.get(
      `/api.notification/notification${buildQuery({
        referenceId: flashsaleId,
        type: "flashsale"
      })}`
    );
    const body = resp.data;
    const notifications = body.data;
    return notifications.length ? notifications[0] : null;
  },

  async deleteNotification({ commit }, id) {
    const resp = await api.delete(`/api.notification/notification/${id}`);
    const body = resp.data;
    const notification = body.data;
    return notification;
  },

  // Menu
  fetchMenus(context, params) {
    let { commit, state } = context;
    api
      .get("/api.menu" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_MENUS, body.data);
      });
  },
  fetchMenuDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.menu/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_MENU_DETAIL, body.data);
      });
  },
  fetchMenuDetailEdit(context, id) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .get("/api.menu/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  storeMenu(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.menu", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateMenu(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api.put("/api.menu/" + form.id, form).then(resp => {
        let body = resp.data;
        if (!body.error) {
          resolve(body.data);
        } else {
          reject(body.error);
        }
      });
    });
  },
  updateDisplayOrderMenu(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.menu/update-display-order", form)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeMenu(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.menu/" + id)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.REMOVE_MENU, {
            id: id
          });
          resolve(body.data);
        });
    });
  },

  // User
  fetchUsers(context, params) {
    let { commit, state } = context;
    return api
      .get("/api.user" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_USERS, body.data);

        return body.data;
      });
  },
  fetchUserDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.user/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_USER_DETAIL, body.data);
      });
  },
  storeUser(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.user", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateUser(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.user/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeUser(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.user/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_USER, {
              id: id
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  activateUser(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.user/activate", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  fetchDashboardStatistic(context) {
    let { commit, state } = context;
    api
      .get("/admin/api/v4/dashboard")
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_DASHBOARD_STATISTIC, body.data);
      });
  },

  // Menu
  fetchMeta(context, params) {
    let { commit, state } = context;
    api
      .get("/api.meta" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_META, body.data);
      });
  },
  fetchSettingData(context) {
    let { commit, state } = context;
    api
      .get("/api.meta/key/setting_data")
      .catch(err => console.error(err.stack))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_SETTING_DATA, body.meta_value);
      });
  },
  fetchMetaByKey(context, key) {
    let { commit, state } = context;
    return api
      .get("/api.meta/" + key)
      .then(resp => resp.data.data.metaValue)
      .catch(err => []);
  },
  fetchMetaStoreUrl() {
    return api.get("/api.meta/store_url").then(resp => resp.data.data);
  },
  fetchPalette(context, params) {
    let { commit, state } = context;
    api
      .get("/api.meta/__palette")
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_PALETTE, body.data);
      });
  },
  fetchCouponSettingMeta(context) {
    let { commit, state } = context;
    api
      .get("/api.meta/coupon-setting")
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_COUPON_SETTING_META, body.data);
      });
  },
  updateCouponSettingMeta(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.meta/coupon-setting", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_COUPON_SETTING_META, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  async fetchCollectionSettingMeta(context) {
    const resp = await api.get("/api.meta/collection-setting");
    const body = resp.data;
    return body.data;
  },
  async updateCollectionSettingMeta(context, form) {
    const resp = await api.put("/api.meta/collection-setting", form);
    const body = resp.data;
    return body.data;
  },
  storeMeta(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_META, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateMeta(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.meta/" + form.meta_key, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            // commit(types.UPDATE_META, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeMeta(context, metaKey) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.meta/" + metaKey)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_META, { metaKey });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  exportExcel(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .post("/admin/api/v4/exportExcel", data)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          resolve(body.data);
        });
    });
  },

  // Model
  fetchModels(context, params) {
    let { commit, state } = context;
    api
      .get("/api.product-model" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_MODEL, body.data);
      });
  },
  storeModel(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.product-model", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            // commit(types.STORE_MODEL, {
            //   form,
            //   data: body.data,
            // });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateModel(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.product-model/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_MODEL, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeModel(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.product-model/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_MODEL, { id });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  // PRODUCT error
  fetchProductErrors(context, params) {
    let { commit, state } = context;
    api
      .get("/api.product-error" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_PRODUCT_ERROR, body.data);
      });
  },
  storeProductError(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.product-error", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            // commit(types.STORE_PRODUCT_ERROR, {
            //   form,
            //   data: body.data,
            // });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateProductError(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.product-error/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_PRODUCT_ERROR, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeProductError(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.product-error/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_PRODUCT_ERROR, { id });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },

  // PRODUCT accessories
  fetchProductAccessories(context, params) {
    let { commit, state } = context;
    api
      .get("/api.product-accessory" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_PRODUCT_ACCESSORIES, body.data);
      });
  },
  storeProductAccessories(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.product-accessory", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            // commit(types.STORE_PRODUCT_ACCESSORIES, {
            //   form,
            //   data: body.data,
            // });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateProductAccessories(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.product-accessory/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_PRODUCT_ACCESSORIES, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeProductAccessories(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.product-accessory/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_PRODUCT_ACCESSORIES, { id });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },

  // WarrantyCode
  fetchWarrantyCodes(context, params) {
    let { commit, state } = context;
    api
      .get("/api.warranty-code" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_WARRANTY_CODE, body.data);
      });
  },
  storeWarrantyCode(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.warranty-code", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            // commit(types.STORE_WARRANTY_CODE, {
            //   form,
            //   data: body.data.warrantyCodes,
            // });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  validateWarrantyCode(context, code) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.warranty-code/validate/" + code)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          console.error(err.stack);
          reject(err);
        });
    });
  },
  removeWarrantyCode(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.warranty-code/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_WARRANTY_CODE, { id });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },

  // WarrantyForm
  fetchWarrantyForms(context, params) {
    let { commit, state } = context;
    api
      .get("/api.warranty-form" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_WARRANTY_FORMS, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  fetchWarrantyFormDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.warranty-form/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_WARRANTY_FORM_DETAIL, body.data);
      });
  },
  storeWarrantyForm(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.warranty-form", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_WARRANTY_FORM, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateWarrantyForm(context, form) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put("/api.warranty-form/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeWarrantyForm(context, id) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .delete("/api.warranty-form/" + id)
        .catch(err => {
          console.error(err.stack);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_WARRANTY_FORM, id);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  contactWarrantyForm(context, id) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.warranty-form/${id}/contact`)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.CONTACT_WARRANTY_FORM, id);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          console.error(err.stack);
        });
    });
  },

  // Warranty Location
  fetchWarrantyLocations(context, params) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.warranty-location" + buildQuery(params))
        .catch(err => {
          console.log(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_WARRANTY_LOCATIONS, body.data);
          resolve();
        });
    });
  },
  fetchWarrantyLocationDetail(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.warranty-location/" + id)
        .catch(err => {
          console.err(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_WARRANTY_LOCATION_DETAIL, body.data);
          resolve();
        });
    });
  },
  createWarrantyLocation(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post(`/api.warranty-location`, form)
        .then(resp => {
          let body = resp.data;
          commit(types.CREATE_WARRANTY_LOCATION, body);
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateWarrantyLocation(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.warranty-location/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_WARRANTY_LOCATION, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  removeWarrantyLocation(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.warranty-location/" + id)
        .catch(err => {
          console.err(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          console.log(body);
          commit(types.REMOVE_WARRANTY_LOCATION, id);
          resolve(body.data);
        });
    });
  },

  createCSCoupon(context, form) {
    let { commit, state } = context;
    // return new Promise((resolve, reject) => {
    //   api.post('/api.survey', form)
    //     .catch(err => {
    //       consol.error(err.stack)
    //       reject(err)
    //     })
    //     .then(resp => {
    //       let body = resp.data
    //       commit(types.CREATE_SURVEY, body.data)
    //       resolve(body.data)
    //     })
    // })
  },
  updateCSCoupon(context, form) {
    let { commit, state } = context;
    // return new Promise((resolve, reject) => {
    //   api.put(`/api.survey/${form.id}`, form)
    //     .catch(err => {
    //       console.error(err.stack)
    //       reject(err)
    //     })
    //     .then(resp => {
    //       let body = resp.data
    //       resolve()
    //     })
    // })
  },
  removeCSCoupon(context, id) {
    let { commit, state } = context;
    // return new Promise((resolve, reject) => {
    //   api.delete('/api.survey/' + id)
    //     .catch(err => {
    //       console.error(err.stack)
    //       reject(err)
    //     })
    //     .then(resp => {
    //       let body = resp.body
    //       commit(types.REMOVE_SURVEY, id)
    //       resolve()
    //     })
    // })
    return new Promise((resolve, reject) => {
      commit(types.REMOVE_CS_COUPON, id);
      resolve();
    });
  },

  // Test result
  fetchMaintenanceForms(context, params) {
    let { commit, state } = context;
    api
      .get("/api.maintenance-form" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_MAINTENANCE_FORMS, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  fetchMaintenanceFormDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.maintenance-form/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_MAINTENANCE_FORM_DETAIL, body.data);
      });
  },
  updateMaintenanceForm(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.maintenance-form/${data.id}`, data)
        .then(resp => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  completeMaintenanceForm(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.maintenance-form/${data.id}/complete`, data)
        .then(resp => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  addWarrantyItem(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .post(`/api.maintenance-form/${data.id}/add-warranty-item`, {
          warrantyCodeId: data.warrantyCodeId
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateWarrantyItem(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.warranty-item/${data.id}`, data)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  removeWarrantyItem(context, data) {
    let { commit, state } = context;
    api
      .post(`/api.maintenance-form/${data.id}/remove-warranty-item`, {
        warrantyItemId: data.warrantyCodeId
      })
      .then(resp => {
        let body = resp.data;
        return body.data;
      })
      .catch(err => {
        throw err;
      });
  },
  addWarrantyLine(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .post(`/api.maintenance-form/${data.id}/add-warranty-line`, data.data)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateWarrantyLine(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.warranty-line/${data.id}`, data)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  removeWarrantyLine(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .post(`/api.maintenance-form/${data.id}/remove-warranty-line`, data)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  storeMaintenanceForm(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.maintenance-form", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_MAINTENANCE_FORM, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  // Receipt
  fetchReceipts(context, params) {
    let { commit, state } = context;
    api
      .get("/api.receipt-form" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_RECEIPTS, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  fetchReceiptDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.receipt-form/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_RECEIPT_DETAIL, body.data);
      });
  },
  storeReceipt(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.receipt-form", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_RECEIPT, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateReceipt(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.receipt-form/${form.id}`, form)
        .catch(err => {
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(true);
          } else {
            reject(body.error);
          }
        });
    });
  },
  completeReceiptForm(context, id) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.receipt-form/${id}/complete`)
        .then(resp => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // QUOTATION
  fetchQuotations(context, params) {
    let { commit, state } = context;
    api
      .get("/api.quotation-form" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_QUOTATIONS, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  fetchQuotationDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.quotation-form/" + id)
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_QUOTATION_DETAIL, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  storeQuotation(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.quotation-form", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_QUOTATION, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateQuotation(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.quotation-form/" + form.id, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  completeQuotation(context, id) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.quotation-form/${id}/complete`)
        .then(resp => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // INVOICE
  fetchInvoices(context, params) {
    let { commit, state } = context;
    api
      .get("/api.invoice-form" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_INVOICES, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  fetchInvoiceDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.invoice-form/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_INVOICE_DETAIL, body.data);
      });
  },
  storeInvoice(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.invoice-form", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_INVOICE, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateInvoice(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.invoice-form/" + form.id, form)
        .catch(err => {
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  completeInvoice(context, id) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.invoice-form/${id}/complete`)
        .then(resp => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // Reimbursement
  fetchReimbursements(context, params) {
    let { commit, state } = context;
    api
      .get("/api.reimbursement-form" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_REIMBURSEMENTS, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  fetchReimbursementDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.reimbursement-form/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_REIMBURSEMENT_DETAIL, body.data);
      });
  },
  storeReimbursement(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.reimbursement-form", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_REIMBURSEMENT, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateReimbursement(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.reimbursement-form/" + form.id, form)
        .catch(err => {
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  completeReimbursement(context, id) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.reimbursement-form/${id}/complete`)
        .then(resp => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  exportReimbursement(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api.reimbursement-form/${id}/export`)
        .then(resp => {
          resolve(resp.data);
          // resolve(`https://bitex.eyeteam.vn/document/8f3b74e5-8463-46ae-93f0-2a39b0ba65b4-receipt.pdf`);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // warranty post
  fetchWarrantyPosts(context, params) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(
          "/api.article" +
            buildQuery(Object.assign({}, params, { department: "warranty" }))
        )
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_WARRANTY_POSTS, body.data);
          resolve(body.data);
        })
        .catch(err => {
          reject(err.stack);
        });
    });
  },
  fetchWarrantyPostDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.article/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_WARRANTY_POST_DETAIL, body.data);
      });
  },
  updateWarrantyPost(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.article/${form.id}`, form)
        .catch(err => {
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.UPDATE_WARRANTY_POST, body.data);
          resolve();
        });
    });
  },
  removeWarrantyPost(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.article/" + id)
        .then(resp => {
          commit(types.REMOVE_WARRANTY_POST, id);
          resolve(resp.body);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createWarrantyPost(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post(`/api.article`, form)
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  storeWarrantyPost(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.post", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_WARRANTY_POST, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },

  // Volume
  fetchVolumes(context, params) {
    let { commit, state } = context;
    api
      .get("/api.volume" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_VOLUMES, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  fetchVolumeDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.volume/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_VOLUME_DETAIL, body.data);
      });
  },
  storeVolume(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.volume", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_VOLUME, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  updateVolume(context, data) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .put(`/api.volume/${data.id}`, data)
        .then(resp => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  removeVolume(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api.delete(`/api.volume/${data.id}`, data).then(resp => {
        let result = resp.data;
        if (!result.code) {
          resolve("success");
        } else {
          reject("error");
        }
      });
    });
  },

  //Document in Education

  // Education coupon
  fetchEducationCoupons(context, params) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(
          "/api.coupon" +
            buildQuery(Object.assign({}, params, { department: "education" }))
        )
        .catch(err => {
          console.log(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_EDUCATION_COUPONS, body.data);
          resolve();
        });
    });
  },
  fetchEducationCouponDetail(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.coupon/" + id)
        .catch(err => {
          console.log(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_EDUCATION_COUPON_DETAIL, body.data);
          resolve();
        });
    });
  },
  createEducationCoupon(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.coupon", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.CREATE_EDUCATION_COUPON, body.data);
          resolve(body.data);
        });
    });
  },
  updateEducationCoupon(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.coupon/${form.id}`, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          resolve();
        });
    });
  },
  removeEducationCoupon(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.coupon/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.body;
          commit(types.REMOVE_EDUCATION_COUPON, id);
          resolve();
        });
    });
  },

  //
  uploadPDF(context, data) {
    return new Promise((resolve, reject) => {
      api
        .postForm(`/api.document/upload`, data)
        .then(resp => {
          const result = resp.data;
          if (!result.error) {
            resolve(result);
          } else {
            reject(result.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  fetchDocuments(context, params) {
    let { commit, state } = context;
    return api
      .get("/api.document" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_DOCUMENTS, body.data);
        return body.data;
      });
  },
  fetchDocumentDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.document/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_DOCUMENT_DETAIL, body.data);
      });
  },
  updateDocument(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.document/${form.id}`, form)
        .then(resp => {
          let body = resp.data;
          commit(types.UPDATE_DOCUMENT, body.data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createDocument(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post(`/api.document`, form)
        .then(resp => {
          let body = resp.data;
          commit(types.CREATE_DOCUMENT, body.data);
          resolve(body.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  removeDocument(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.document/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_DOCUMENT, id);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  //teacher
  fetchTeachers(context, params) {
    let { commit, state } = context;
    api
      .get("/api.teacher/profile" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_TEACHERS, body.data);
      });
  },
  fetchTeacherDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.teacher/profile/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_TEACHER_DETAIL, body.data);
      });
  },
  updateTeacher(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.teacher/profile/${data.id}`, data)
        .then(resp => {
          let body = resp.data;
          commit(types.UPDATE_TEACHER, data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  rejectTeacher(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.teacher/profile/reject", { id })
        .catch(err => {
          console.err(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.REJECT_TEACHER, body.data);
          resolve();
        });
    });
  },
  confirmTeacher(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.teacher/profile/activate", { id })
        .catch(err => {
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.CONFIRM_TEACHER, body.data);
          resolve();
        });
    });
  },
  //survey
  fetchSurveys(context, params) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.survey" + buildQuery(params))
        .catch(err => {
          console.log(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_SURVEYS, body.data);
          resolve();
        });
    });
  },
  fetchSurveyDetail(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.survey/" + id)
        .catch(err => {
          console.err(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_SURVEY_DETAIL, body.data);
          resolve();
        });
    });
  },
  createSurvey(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.survey", form)
        .then(resp => {
          let body = resp.data;
          commit(types.CREATE_SURVEY, body.data);
          resolve(body.data);
        })
        .catch(err => {
          console.error(err.stack);
          reject(err);
        });
    });
  },
  updateSurvey(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.survey/${form.id}`, form)
        .then(resp => {
          let body = resp.data;
          resolve();
        })
        .catch(err => {
          console.error(err.stack);
          reject(err);
        });
    });
  },
  removeSurvey(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.survey/" + id)
        .then(resp => {
          let body = resp.body;
          commit(types.REMOVE_SURVEY, id);
          resolve();
        })
        .catch(err => {
          console.error(err.stack);
          reject(err);
        });
    });
  },

  // survey question
  fetchSurveyQuestions(context, params) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.question-survey" + buildQuery(params))
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_SURVEY_QUESTIONS, body.data);
          resolve(body.data);
        });
    });
  },
  fetchSurveyQuestionDetail(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.question-survey/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          resolve(body.data);
        });
    });
  },
  createSurveyQuestion(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post(`/api.survey/${data.surveyId}/add-question`, data.form)
        .catch(err => {
          console.log(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          // commit(types.CREATE_SURVEY_QUESTION, body.data)
          resolve(body.data);
        });
    });
  },
  updateSurveyQuestion(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.question-survey/${data.id}`, data)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          resolve(body.data);
        });
    });
  },
  removeSurveyQuestion(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.question-survey/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.data);
          }
        });
    });
  },
  //exam
  fetchExams(context, params) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.exam" + buildQuery(params))
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_EXAMS, body.data);
          resolve();
        });
    });
  },
  fetchExamDetail(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.exam/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_EXAM_DETAIL, body.data);
          resolve();
        });
    });
  },
  createExam(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.exam", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.CREATE_EXAM, body.data);
          resolve(body.data);
        });
    });
  },
  updateExam(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.exam/${form.id}`, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          resolve(body.data);
        });
    });
  },
  removeExam(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.exam/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_EXAM, id);
            resolve(body.data);
          } else {
            reject(body.data);
          }
        });
    });
  },

  //Questions

  fetchQuestions(context, params) {
    let { commit, state } = context;
    api
      .get("/api.question" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
        reject(err);
      })
      .then(resp => {
        let body = resp.body;
        console.log(body);
        commit(types.FETCH_QUESTIONS, body.data);
      });
  },
  fetchQuestionDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.question/" + id)
      .catch(err => {
        console.error(err.stack);
        reject(err);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_QUESTION_DETAIL, body.data);
      });
  },
  createQuestion(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post(`/api.exam/${data.examId}/add-question`, data)
        .catch(err => {
          console.log(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.CREATE_QUESTION, body.data);
          resolve(body.data);
        });
    });
  },
  createQuestionSurvey(context, data) {
    let { commit, state } = context;
    console.log("data: ", data);
    return new Promise((resolve, reject) => {
      api
        .post(`/api.survey/${data.surveyId}/add-question`, data)
        .then(resp => {
          let body = resp.data;
          console.log(body);
          commit(types.CREATE_QUESTION, body.data);
          resolve(body.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateQuestion(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.question/${data.id}`, data)
        .catch(err => {
          console.log(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.UPDATE_QUESTION, body.data);
          resolve(body.data);
        });
    });
  },
  removeQuestion(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.question/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.REMOVE_QUESTION, id);
            resolve(body.data);
          } else {
            reject(body.data);
          }
        });
    });
  },

  // EDUCATION post
  fetchEducationPosts(context, params) {
    let { commit, state } = context;
    api
      .get(
        "/api.article" +
          buildQuery(Object.assign({}, params, { department: "education" }))
      )
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_EDUCATION_POSTS, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  fetchEducationPostDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.article/" + id)
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_EDUCATION_POST_DETAIL, body.data);
      });
  },
  Post(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.post", formstoreEducation)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_EDUCATION_POST, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  createEducationPost(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post(`/api.article`, form)
        .then(resp => {
          let body = resp.data;
          commit(types.CREATE_EDUCATION_POST, body.data);
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateEducationPost(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.article/${form.id}`, form)
        .catch(err => {
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.UPDATE_EDUCATION_POST, body.data);
          resolve();
        });
    });
  },
  removeEducationPost(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete("/api.article/" + id)
        .then(resp => {
          commit(types.REMOVE_EDUCATION_POST, id);
          resolve(resp.body);
        })
        .catch(err => {
          console.error(err.stack);
          reject(err);
        });
    });
  },
  updateStatus(context, payload) {
    const { type, arrId, status } = payload;
    if (status === "delete") {
      return Promise.all(
        arrId.map(id => {
          return api
            .delete(`/api.${type}/${id}`)
            .then(resp => {
              console.log("---- Response: ", resp);
            })
            .catch(err => {
              console.log("---- Error: ", err);
            });
        })
      );
    }
  },
  Post(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.post", formstoreEducation)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.STORE_EDUCATION_POST, {
              form,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },

  // Ticket
  fetchTickets(context, params) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.ticket" + buildQuery(params))
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_TICKETS, { data: body.data, total: body.total });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  fetchTicketDetail(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.ticket/" + id)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  replyTicket(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.ticket/" + data.id + "/reply", {
          content: data.content
        })
        .catch(err => {
          console.log(err);
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  clearTicket(context) {
    let { commit } = context;
    commit(types.CLEAR_TICKETS);
  },
  closeTicket(context, data) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.ticket/" + data.id + "/close")
        .catch(err => {
          console.log(err);
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.CLOSE_TICKET, data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },
  registerDevice(context, token) {
    return new Promise((resolve, reject) => {
      api
        .post("/api.notification/device", {
          token,
          platform: "web"
        })
        .catch(err => {
          console.log(err);
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },

  //report
  fetchReport(context, query) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.report" + buildQuery(query))
        .catch(err => {
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_REPORT, {
              department: query.department,
              data: body.data
            });
            resolve(body.data);
          } else {
            reject(body.error);
          }
        });
    });
  },

  //Customer service coupon

  fetchCSCoupons(context, params) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(
          "/api.coupon" +
            buildQuery(
              Object.assign({}, params, { department: "customer_service" })
            )
        )
        .catch(err => {
          console.log(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_CS_COUPONS, body.data);
          resolve();
        });
    });
  },
  fetchCSCouponDetail(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get("/api.coupon/" + id)
        .catch(err => {
          console.err(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.FETCH_CS_COUPON_DETAIL, body.data);
          resolve();
        });
    });
  },
  createCSCoupon(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.coupon", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          commit(types.CREATE_CS_COUPON, body.data);
          resolve(body.data);
        });
    });
  },
  updateCSCoupon(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.coupon/${form.id}`, form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          resolve();
        });
    });
  },

  getMapCenter(context, query) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api/v1/google/place/findplacefromtext/json${buildQuery(query)}`)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          console.log("resp.data", resp.data);
          resolve(resp.data);
        });
    });
  },

  //fetch activated products
  fetchActivatedProducts(context, params) {
    let { commit, state } = context;
    api
      .get("/api.warranty-code/activated" + buildQuery(params))
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_ACTIVATED_PRODUCTS, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  },
  //add warranty item without code
  addWarrantyProductWithoutCode(context, form) {
    let { commit, state } = context;
    return new Promise(function(resolve, reject) {
      api
        .post(
          `/api.maintenance-form/${form.formId}/add-warranty-item-without-code`,
          form
        )
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportReceiptForm(context, id) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api.receipt-form/${id}/export`)
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportRegionalStats(context, dateObj) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.maintenance-form/export-by-region", dateObj)
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportReport(context, payload) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.report/export", payload)
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportResultError(context, payload) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.quotation-form/export", payload)
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportError(context, payload) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put("/api.maintenance-form/export-by-error", payload)
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportInvoice(context, payload) {
    return new Promise((resolve, reject) => {
      api
        .put("/api.invoice-form/export", payload)
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportReceipt(context, payload) {
    return new Promise((resolve, reject) => {
      api
        .put("/api.maintenance-form/export", payload)
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportExcelReceiptForm(context, time) {
    let { commit, state } = context;
    const [from, to] = time;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.maintenance-form/export-by-error`, {
          createdFrom: from,
          createdTo: to
        })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportExcelQuotationForm(context, time) {
    let { commit, state } = context;
    const [from, to] = time;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.quotation-form/export`, { from, to })
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  exportInvoiceForm(context, payload) {
    return new Promise((resolve, reject) => {
      api
        .get(`/api.invoice-form/${payload}/export`)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetchCategories(context, params) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api.category` + buildQuery(params))
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_CATEGORIES, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetchCategoryDetail(context, params) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api.category/${params.id}`)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_CATEGORY_DETAIL, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createCategory(context, payload) {
    return new Promise((resolve, reject) => {
      api
        .post(`/api.category`, payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateCategory(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.category/${payload.id}`, payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_CATEGORY_DETAIL, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetchAttributes(context, params) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api.attribute` + buildQuery(params))
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_ATTRIBUTES, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createAttribute(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post(`/api.attribute`, payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.CREATE_ATTRIBUTE, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetchAttributeDetail(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api.attribute/${params.id}`)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_ATTRIBUTE_DETAIL, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateAttribute(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.attribute/${payload.id}`, payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_ATTRIBUTE_DETAIL, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createAttributeOption(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post(`/api.attribute/${payload.attribute_id}/option`, payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.CREATE_ATTRIBUTE_OPTION, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateAttributeOption(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(
          `/api.attribute/${payload.attribute_id}/option/${payload.id}`,
          payload
        )
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.UPDATE_ATTRIBUTE_OPTION, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createProduct(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.product", payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateProduct(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.product/${payload.id}`, payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
            commit(types.UPDATE_PRODUCT, body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetchArticles(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api.article`)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_ARTICLES, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createArticle(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.article", payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  fetchArticleDetail(context, id) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .get(`/api.article/${id}`)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_ARTICLE_DETAIL, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  updateArticle(context, payload) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .put(`/api.article/${payload.id}`, payload)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            commit(types.FETCH_ARTICLE_DETAIL, body.data);
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  removeArticle(context, id) {
    const { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .delete(`/api.article/${id}`)
        .then(resp => {
          let body = resp.data;
          if (!body.error) {
            resolve(body.data);
          } else {
            reject(body.error);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  fetchOrder(context, params) {
    const { commit, state } = context;
    api.get("/api.order" + buildQuery(params)).then(resp => {
      let body = resp.data;
      commit(types.FETCH_ORDERS, body.data);
    });
  },
  fetchMyRooms(context, params) {
    let { commit, state } = context;
    return api
      .get("/api.room/my-rooms" + buildQuery(params))
      .catch(err => {
        console.error(err.stack);
      })
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_MY_ROOMS, body.data);
        return body.data;
      });
  },
  createRoom(context, form) {
    let { commit, state } = context;
    return new Promise((resolve, reject) => {
      api
        .post("/api.room", form)
        .catch(err => {
          console.error(err.stack);
          reject(err);
        })
        .then(resp => {
          let body = resp.data;
          // commit(types.CREATE_ROOM, body.data);
          resolve(body.data);
        });
    });
  },
  fetchRoomDetail(context, id) {
    let { commit, state } = context;
    api
      .get("/api.room/" + id)
      .then(resp => {
        let body = resp.data;
        commit(types.FETCH_ROOM_DETAIL, body.data);
      })
      .catch(err => {
        console.error(err.stack);
      });
  }
};
