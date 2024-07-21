/* eslint-disable */
import _ from "lodash";
import store from "../store/store";
import cookieUtil from "./cookie-util";

let $root = {};

const nameHash = {
  products: "product",
  product: "product",
  collections: "collection",
  collection: "collection",
  articles: "article",
  article: "article",
  blogs: "blog",
  blog: "blog",
  pages: "page",
  page: "page",
  galleries: "gallery",
  gallery: "gallery",
  customers: "customer",
  customer: "customer",
  roles: "role",
  role: "role",
  coupons: "coupon",
  coupon: "coupon",
  provinces: "province",
  province: "province",
  categories: "category",
  category: "category",
  campaigns: "campaign",
  campaign: "campaign",
  flashsales: "flashsale",
  flashsale: "flashsale",
  users: "user",
  user: "user",
  error: "error",
  errors: "errors",
  product_error: "product-error",
  product_accessory: "product-accessory",
  product_model: "product-model",
  group: "group"
};

const modelNameHash = {
  product: "sản phẩm",
  collection: "nhóm sản phẩm",
  article: "bài viết",
  blog: "nhóm bài viết",
  page: "trang nội dung",
  gallery: "gallery",
  customer: "khách hàng",
  role: "quyền",
  coupon: "mã giảm giá",
  province: "tỉnh/ thành phố",
  category: "nhóm sản phẩm",
  campaign: "chiến dịch",
  flashsale: "flashsale",
  user: "khách hàng",
  error: "lỗi",
  errorDescription: "mô tả",
  group: "lớp học"
};

const multipleTypes = ["articles", "blogs", "pages", "customers", "groups"];

const selectOptions = {
  discountType: [
    {
      title: "percentage",
      value: "percentage",
      type: "primary"
    },
    {
      title: "fixedAmount",
      value: "fixed_amount",
      type: "success"
    },
    {
      title: "freeShipping",
      value: "free_shipping",
      type: "default"
    }
  ],
  notificationTopic: [
    {
      title: "mobile",
      value: "mobile"
    },
    {
      title: "agency",
      value: "admin_agency"
    }
  ],
  typeRelation: [
    {
      title: "allProduct",
      value: "all_product"
    },
    {
      title: "product",
      value: "product"
    },
    {
      title: "category",
      value: "category"
    }
  ],
  menuType: [
    {
      title: "link",
      value: "link"
    },
    {
      title: "category",
      value: "category"
    },
    {
      title: "campaign",
      value: "campaign"
    },
    {
      title: "flashsale",
      value: "flashsale"
    },
    {
      title: "page",
      value: "page"
    }
  ],
  categoryType: [
    {
      title: "special",
      value: "special",
      type: "primary"
    },
    {
      title: "smart",
      value: "smart",
      type: "success"
    },
    {
      title: "default",
      value: "default",
      type: "default"
    }
  ],
  reviewStatus: [
    {
      title: "approved",
      value: "approved",
      type: "success"
    },
    {
      title: "pending",
      value: "pending",
      type: "warning"
    },
    {
      title: "rejected",
      value: "rejected",
      type: "danger"
    }
  ],
  isBroadcast: [
    {
      title: "Yes",
      value: true,
      type: "success"
    },
    {
      title: "No",
      value: false,
      type: "default"
    }
  ],
  isProcessed: [
    {
      title: "Yes",
      value: true,
      type: "success"
    },
    {
      title: "No",
      value: false,
      type: "default"
    }
  ],
  gender: [
    {
      title: "male",
      value: "male",
      type: "success"
    },
    {
      title: "female",
      value: "female",
      type: "warning"
    }
  ],
  statusCusCoupon: [
    {
      title: "available",
      value: "available",
      type: "success"
    },
    {
      title: "unavailable",
      value: "unavailable",
      type: "default"
    }
  ],
  warrantyFormStatus: [
    {
      title: "Mới",
      value: "new",
      type: "info"
    },
    {
      title: "Xác nhận",
      value: "confirmed",
      type: "success"
    },
    {
      title: "Đang sửa chửa",
      value: "responded",
      type: "warning"
    },
    {
      title: "Hoàn trả",
      value: "returned",
      type: "success"
    },
    {
      title: "Đã liên hệ",
      value: "contacted",
      type: "purple"
    }
  ],
  quotationFormStatus: [
    {
      title: "Mới",
      value: "new",
      type: "info"
    },
    {
      title: "Đồng ý",
      value: "completed",
      type: "success"
    },
    {
      title: "Từ chối",
      value: "denied",
      type: "danger"
    },
    {
      title: "Đã thanh toán",
      value: "paid",
      type: "warning"
    }
  ],
  receiptFormStatus: [
    {
      title: "Mới",
      value: "new",
      type: "info"
    },
    {
      title: "Hoàn thành",
      value: "completed",
      type: "success"
    },
    {
      title: "Hoàn trả",
      value: "reimbursed",
      type: "success"
    },
    {
      title: "Đã đánh giá",
      value: "commented",
      type: "info"
    }
  ],
  maintenanceFormStatus: [
    {
      title: "Mới",
      value: "new",
      type: "info"
    },
    {
      title: "Hoàn thành",
      value: "completed",
      type: "success"
    },
    {
      title: "Đã nhận",
      value: "received",
      type: "primary"
    },
    {
      title: "Đã báo giá",
      value: "quoted",
      type: "success"
    }
  ],
  invoiceFormStatus: [
    {
      title: "Mới",
      value: "new",
      type: "info"
    },
    {
      title: "Hoàn thành",
      value: "completed",
      type: "success"
    }
  ],
  reimbursementFormStatus: [
    {
      title: "Mới",
      value: "new",
      type: "info"
    },
    {
      title: "Hoàn thành",
      value: "completed",
      type: "success"
    }
  ],
  status: [
    {
      title: "Mới",
      value: "new",
      type: "info"
    },
    {
      title: "Đang khảo sát",
      value: "in_progress",
      type: "success"
    },
    {
      title: "Đã hoàn trả",
      value: "returned",
      type: "success"
    },
    {
      title: "Đã phản hồi",
      value: "responded",
      type: "warning"
    },
    {
      title: "Hoàn thành",
      value: "completed",
      type: "success"
    },
    {
      title: "Hoàn thành",
      value: "received",
      type: "success"
    },
    {
      title: "Xác nhận",
      value: "confirmed",
      type: "primary"
    },
    {
      title: "Đã biên nhận",
      value: "quoted",
      type: "primary"
    },
    {
      title: "Đã hoàn trả",
      value: "reimbursed"
    },
    {
      title: "Đang xử lý",
      value: "pending"
    },
    {
      title: "success",
      value: "Thành công"
    },
    {
      title: "cancelled",
      value: "Đã hủy"
    },
    {
      value: "rejected",
      title: "Từ chối"
    },
    {
      value: "closed",
      title: "Đã đóng",
      type: "danger"
    },
    {
      value: "in_progress",
      title: "Đang khảo sát"
    },
    {
      value: null,
      title: "Mới",
      type: "info"
    },
    {
      value: "denied",
      title: "Đã từ chối",
      type: "danger"
    }
  ],
  statusReceipt: [
    {
      title: "Mới",
      value: "new",
      type: "warning"
    },
    {
      title: "Hoàn thành",
      value: "completed",
      type: "success"
    },
    {
      title: "Hoàn trả",
      value: "reimbursed",
      type: "primary"
    },
    {
      title: "Đã đánh giá",
      value: "commented",
      type: "info"
    }
  ],
  role: [
    {
      title: "admin",
      value: "admin",
      type: "success"
    },
    {
      title: "manager",
      value: "manager",
      type: "primary"
    },
    {
      title: "supporter",
      value: "supporter",
      type: "info"
    },
    {
      title: "Trưởng phòng bảo hành",
      value: "admin_warranty",
      type: "info"
    },
    {
      title: "Phó phòng bảo hành",
      value: "vice_admin_warranty",
      type: "info"
    },
    {
      title: "Thư ký bảo hành",
      value: "warranty_manager",
      type: "info"
    },
    {
      title: "Trưởng bộ phận",
      value: "technical_leader",
      type: "info"
    },
    {
      title: "Kỹ thuật viên",
      value: "technician",
      type: "info"
    }
  ],
  notificationType: [
    {
      title: "news",
      value: "news",
      type: "success"
    },
    {
      title: "campaign",
      value: "campaign",
      type: "primary"
    },
    {
      title: "flashsale",
      value: "flashsale",
      type: "info"
    }
  ],
  isProgressing: [
    {
      title: "✔",
      value: true,
      type: "success"
    },
    {
      title: "✗",
      value: false,
      type: "default"
    }
  ],
  isExpired: [
    {
      title: "✔",
      value: true,
      type: "success"
    },
    {
      title: "✗",
      value: false,
      type: "default"
    }
  ],
  isActivated: [
    {
      title: "✔",
      value: true,
      type: "success"
    },
    {
      title: "✗",
      value: false,
      type: "default"
    }
  ],
  method: [
    {
      title: "Sửa chữa",
      value: "repair"
    },
    {
      title: "Thay thế",
      value: "replace"
    },
    {
      title: "Đổi mới",
      value: "change"
    }
  ]
};
// type: default, primary, info, success, danger, warning
const util = {
  ...cookieUtil,
  findModel(_name) {
    const name = _name.toLowerCase();
    return nameHash[name];
  },
  findModelName(model) {
    return modelNameHash[model] || modelNameHash[util.findModel(model)];
  },
  getOptions(prop) {
    return selectOptions[prop] || [];
  },
  parseStatus(prop, value) {
    const option = (selectOptions[prop] || []).find(opt => opt.value == value);
    return (option && option.title) || value || "";
  },
  parseType(prop, value) {
    const option = (selectOptions[prop] || []).find(opt => opt.value == value);
    return (option && option.type) || "";
  },
  isMultiple(type) {
    return _.includes(multipleTypes, type);
  },
  formatMoney(value) {
    const val = (value / 1).toFixed(0).replace(".", ",");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  formatNumber(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  formatVndShort(value) {
    let postfix = "đ";
    if (value > 1e9) {
      value = Math.floor(value / 1e7) / 100;
      postfix = "tỷ";
    } else if (value > 1e6) {
      value = Math.floor(value / 1e4) / 100;
      postfix = "triệu";
    } else {
      value = (value / 1).toFixed(0).replace(".", ",");
      value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return `${value} ${postfix}`;
  },
  formatDateTime(value) {
    const _value = new Date(value);
    const date = `${
      _value.getDate() < 10 ? "0" + _value.getDate() : _value.getDate()
    }/${
      _value.getMonth() + 1 < 10
        ? "0" + (_value.getMonth() + 1)
        : _value.getMonth() + 1
    }/${_value.getFullYear()}`;
    const time = `${
      _value.getHours() < 10 ? "0" + _value.getHours() : _value.getHours()
    }:${
      _value.getMinutes() < 10 ? "0" + _value.getMinutes() : _value.getMinutes()
    }`;
    return `${time} ${date}`;
  },
  formatDate(value) {
    const _value = new Date(value);
    const date = `${
      _value.getDate() < 10 ? "0" + _value.getDate() : _value.getDate()
    }/${
      _value.getMonth() + 1 < 10
        ? "0" + (_value.getMonth() + 1)
        : _value.getMonth() + 1
    }/${_value.getFullYear()}`;
    return date;
  },
  timeSince(date) {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `${interval} năm trước`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `${interval} tháng trước`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `${interval} ngày trước`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `${interval} giờ trước`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} phút trước`;
    }
    return `${Math.floor(seconds)} giây trước`;
  },
  filterByHandle(fields, handleArr) {
    if (!handleArr) {
      return fields;
    }
    return fields.filter(f => handleArr.indexOf(f.handle) > -1);
  },
  nestedSet(hash, field, value) {
    const levels = field.split(".");
    let obj = hash;
    const lastLevel = levels.pop();
    for (const level of levels) {
      if (!obj[level]) {
        obj[level] = {};
      }
      obj = obj[level];
    }
    obj[lastLevel] = value;
  },
  nestedGet(hash, field) {
    const levels = field.split(".");
    let obj = hash;
    const lastLevel = levels.pop();
    for (const level of levels) {
      if (!obj[level]) {
        obj[level] = {};
      }
      obj = obj[level];
    }
    return obj[lastLevel];
  },
  hashFlatten(hash) {
    const result = {};
    function setValue(hash, result, parent) {
      for (const key of Object.keys(hash)) {
        if (typeof hash[key] !== "object") {
          result[parent + key] = hash[key];
        } else {
          setValue(hash[key], result, `${parent + key}.`);
        }
      }
      return result;
    }

    return setValue(hash, result, "");
  },
  hashNested(hash) {
    const result = {};
    // seo.meta_title => {seo: {meta_title: ''}}
    for (const key of Object.keys(hash)) {
      util.nestedSet(result, key, hash[key]);
    }
    return result;
  },
  createHandle(str) {
    if (str) {
      str += "";
      str = str.trim();
      str = str.toLowerCase();
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/\,/g, "-");
      str = str.replace(/\./g, "-");
      str = str.replace(/\!/g, "-");
      str = str.replace(/\?/g, "-");
      str = str.replace(/\~/g, "-");
      str = str.replace(/\ /g, "-");
      str = str.replace(/\|/g, "-");
      str = str.replace(/\./g, "-");
      str = str.replace(/\"/g, "-");
      str = str.replace(/\'/g, "-");
      str = str.replace(/\-\-+/g, "-");
      str = str.replace(/\s+/g, "-");
      str = str.replace(/[^\w\-]+/g, "");
      str = str.replace(/\-\-+/g, "-");
      str = str.replace(/^-+/, "");
      str = str.replace(/-+$/, "");
      if (str.slice(-1) == "-") str = str.substring(0, str.length - 1);
    }
    return str;
  },
  formatDataChartDashboard(data) {
    const days = 29;
    const hash = {};
    data.forEach((elem, i) => {
      hash[elem.date] = elem.sum;
    });
    const labels = [];
    const result = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date(new Date() - i * 86400000);
      const dateName = `${
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      }-${
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1
      }`;
      labels.push(dateName);
      if (hash[dateName]) {
        result.push(hash[dateName]);
      } else {
        result.push(0);
      }
    }
    const obj = {};
    obj.labels = labels;
    obj.result = result;
    return obj;
  },
  updateStatusAll(model, rows, status) {
    const arrID = [];
    for (const row of rows) {
      arrID.push(row.id);
    }
    const data = {
      type: model,
      arrId: arrID,
      status
    };
    return store.dispatch("updateStatus", data);
  },
  checkRole(role) {
    let self = this;
    let roles = JSON.parse(self.getCookie("role"));
    let roleID = util.getCookie("role_id");
    if (roleID == -1 || !roleID) return true;
    else if (roles.indexOf(role) != -1) return true;
    return false;
  },
  checkChangePassword(userID) {
    return true;
    const self = this;
    const user = JSON.parse(self.getCookie("user"));
    if (user.user_id == userID) return true;
    return false;
  },
  parseSelect(data) {
    const arr = {};
    arr.options = [];
    for (const item of data) {
      arr.options.push({
        value: item.id,
        title: item.title || item.name
      });
    }
    return arr;
  },
  checkPermissionAction(data, action) {
    const userRole = store.state.role;
    const actions = data.filter(item => {
      return item.action === action;
    });
    const allowAction = actions.length ? actions[0]["roles"] : [];
    if (allowAction.includes(userRole)) {
      return actions[0];
    }
    return;
  },
  parseDataCustomfield(customfield, data, type, typeID) {
    const arr_custom_field = [];
    for (const item of customfield) {
      const obj = {};
      let value = data[item.handle];
      if (
        item.input_type == "maps" ||
        item.input_type == "images" ||
        item.input_type == "select-multiple"
      )
        value = JSON.stringify(data[item.handle]);
      obj.title = item.title || item.name;
      obj.handle = item.handle;
      obj.post_type = type;
      obj.post_id = typeID;
      obj.value = value || "";
      arr_custom_field.push(obj);
    }
    return arr_custom_field;
  },
  getContext() {
    let data = {};
    for (let i = 0; i < arguments.length; i++) {
      data = Object.assign(data, arguments[i]);
    }
    return data;
  },
  getImageSize(attr) {
    const ctx = store.state.ctx;
    if (window.__FUNC.ImageSize) {
      const size = window.__FUNC.ImageSize(attr, ctx);
      return size === undefined ? "" : `(${size})`;
    }

    return "";
  },
  checkVisitDashboard(key) {
    if (window.__FUNC.Dashboard) {
      const arrField = window.__FUNC.Dashboard;
      const check = arrField.indexOf(key) == -1;
      return check;
    }

    return true;
  },
  changeFavicon(src) {
    document.head || (document.head = document.getElementsByTagName("head")[0]);
    let link = document.createElement("link");
    let oldLink = document.getElementById("dynamic-favicon");
    link.id = "dynamic-favicon";
    link.rel = "shortcut icon";
    link.href = src;
    if (oldLink) {
      document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
  },
  downloadURI(uri) {
    let link = document.createElement("a");
    link.href = uri;
    link.target = "_blank";
    link.click();
  },
  exportExcel(type, dataType) {
    const self = this;
    const data = {
      products: dataType,
      name: type
    };
    store.dispatch("exportExcel", data).then(data => {
      self.downloadURI(data.url);
    });
  },
  buildQuery(params) {
    if (!params) {
      return "";
    }
    if (typeof params === "string") {
      return params;
    }
    if (typeof params !== "object") {
      return "";
    }
    const arr = [];
    for (const key of Object.keys(params)) {
      arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
    return `?${arr.join("&")}`;
  },
  parseFormData(form) {
    let formData = new FormData();
    for (const key in form) {
      if (form[key] instanceof FileList) {
        for (const file of form[key]) {
          formData.append(key, file);
        }
        continue;
      }
      if (Array.isArray(form[key])) {
        form[key].forEach(e => {
          formData.append(`${key}[]`, e);
        });
        continue;
      }
      formData.append(key, form[key]);
    }
    return formData;
  },
  buildRoutePermission(sidebarLinks) {
    const routePermission = [];
    for (const sidebar of sidebarLinks) {
      if (sidebar.path) {
        routePermission.push({
          path: sidebar.path,
          roles: sidebar.roles
        });
      }
      if (sidebar.children && sidebar.children.length) {
        routePermission.push(
          ...sidebar.children.map(c => {
            return {
              path: c.path,
              roles: c.roles
            };
          })
        );
      }
    }
    return routePermission;
  },
  isAllowRoute(path, role) {
    const sidebar = store.getters.routePermission.find(
      s => s.path === path || path.startsWith(s.path)
    );
    if (!sidebar) {
      return false;
    }
    return sidebar.roles.includes(role);
  },
  uniqueList(field, list) {
    return _.unionBy(list, [], field);
  },
  buildRuleValidate(array) {
    let rules = {};
    array.forEach(v => {
      rules[v] = [{ required: true, message: "", trigger: "change" }];
    });
    return rules;
  },
  getBase64Image(url) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png")); // Or at whatever offset you like
      };
      img.crossOrigin = "anonymous";
      img.src = url;
    });
  }
};

setTimeout(_ => {
  $root = window.vueApp.$root;
}, 2000);

export default util;
