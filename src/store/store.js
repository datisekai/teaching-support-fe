/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
import util from "../helpers/util";
import sidebarLangs from "../i18n/sidebar";
import en from "../i18n/en";
import vi from "../i18n/vi";

Vue.use(Vuex);

const state = {
  ctx: {},
  pageTitle: "Portal",
  sidebarTitle: "Portal",
  sidebarLogo: "/static/img/logo.png",
  noImage: "/static/img/no-image.png",
  token: util.getCookie("token") || "",
  role: util.getCookie("role") || "none",
  user: util.getCookie("user") ? JSON.parse(util.getCookie("user")) : {},
  language: util.getCookie("language") || "vi",
  users: [],
  compo_langs: { en, vi },
  languages: ["en", "vi"],
  sidebarLinks: sidebarLangs,
  routePermission: util.buildRoutePermission(sidebarLangs),
  palette: [
    "#EB5757",
    "#F2994A",
    "#F2C94C",
    "#2694A1",
    "#27AE60",
    "#6FCF97",
    "#2F80ED",
    "#2D9CDB",
    "#56CCF2",
    "#9B51E0",
    "#BB6BD9",
    "#828282"
  ],
  products: [],
  categories: [],
  categoryDetail: {},
  attributes: [],
  attributeDetail: {},
  productDetail: {},
  productAttributes: [],
  variantAttributes: [],
  colorAttributes: [],
  articleDetail: [],
  roleDetail: [],
  blogs: [],
  articles: [],
  blogDetail: [],
  pages: [],
  pageDetail: [],
  coupons: [],
  couponDetail: {},
  campaigns: [],
  campaignDetail: [],
  flashsales: [],
  flashsaleDetail: {},
  reviews: [],
  reviewDetail: {},
  reviewReplies: [],
  notifications: [],
  notificationDetail: {},
  collections: [],
  collectionDetail: [],
  productInCollection: [],
  provinces: [],
  districts: [],
  wards: [],
  orders: [],
  orderDetail: [],
  customers: [],
  customerDetail: [],
  customerOrders: [],
  testimonials: [],
  testimonialDetail: [],
  clients: [],
  clientDetail: [],
  subscribers: [],
  contact: [],
  contactDetail: [],
  review: [],
  comment: [],
  galleries: [],
  galleryDetail: [],
  photos: [],
  photoDetail: [],
  settingsView: [],
  settings: [],
  versionSetting: [],
  menus: [],
  menuDetail: [],
  menuDetailEdit: [],
  users: [],
  userDetail: [],
  shippings: [],
  classCustomField: [],
  shippingDetail: [],
  shippingEdit: [],
  roles: [],
  deleted: [],
  deletedDetail: [],
  selectedFile: null,
  currentActions: [],
  loadingAction: {
    edit: true,
    update: false,
    create: false,
    delete: false
  },
  histories: [],
  dashboardContact: [],
  customCSS: [],
  versionCSS: [],
  emailDetail: [],
  region: [],
  subRegion: [],
  orderShipping: [],
  customField: [],
  listThemeView: [],
  tags: [],
  meta: [],
  couponSettingMeta: {},
  models: [],
  modelMenus: [],
  warrantyCodes: [],
  warrantyForms: [],
  warrantyFormDetail: {},
  maintenanceForms: [],
  maintenanceFormDetail: {},
  receipts: [],
  receiptDetail: {},
  quotations: [],
  quotationDetail: {},
  invoices: [],
  invoiceDetail: {},
  reimbursements: [],
  reimbursementDetail: {},

  //Warranty posts
  warrantyPosts: [],
  warrantyPostDetail: {},

  //Warranty location
  warrantyLocations: [],
  warrantyLocationDetail: {},

  //Education coupon
  educationCoupons: [],
  educationCouponDetail: {},

  //Education posts
  educationPosts: [],
  educationPostDetail: {},
  productErrors: [],
  productErrorMenus: [],
  productAccessories: [],
  productAccessoryMenus: [],
  volumeDetail: {},
  volumes: [],
  documents: [],
  documentDetail: {},
  teachers: [],
  teacherDetail: {},
  //survey
  surveys: [],
  surveyDetail: {},
  //survey question
  survey_questions: [],
  surveyQuestionDetail: {},
  //examp
  exams: [],
  examDetail: {},
  //questions
  questions: [],
  questionDetail: {},

  //ticket
  tickets: [],
  ticketTotal: 0,

  //customer service coupon
  csCoupons: [],
  csCouponDetail: {},

  //activated products
  activatedProducts: [],

  // my rooms
  myRooms: [],
  roomDetail: {},
  roomStudents: [],
  logStudents: [],

  //departments
  departments: [],
  department: {},

  //courses
  courses: [],
  course: {},

  //groups
  groups: [],
  groupStudents: {
    course: {},
    members: []
  },
  group: {},
  roomsGroup: [],
  groupStatistic: {
    listUser: [{ student: {} }]
  },

  loading: false,

  report: {
    education: {
      article: {
        total: 0,
        count: 0,
        reportRecords: []
      },
      exam: {
        total: 0,
        count: 0,
        reportRecords: []
      },
      survey: {
        total: 0,
        count: 0,
        reportRecords: []
      }
    },
    customer_service: {
      ticket: {
        total: 0,
        count: 0,
        reportRecords: []
      },
      survey: {
        total: 0,
        count: 0,
        reportRecords: []
      }
    },
    warranty: {
      article: {
        total: 0,
        count: 0,
        reportRecords: []
      },
      code_activated: {
        total: 0,
        count: 0,
        reportRecords: []
      },
      code_created: {
        total: 0,
        count: 0,
        reportRecords: []
      }
    }
  },

  statsCards: [
    {
      type: "warning",
      icon: "nc-icon nc-globe",
      title: "Đang cập nhật",
      value: "...",
      detail: "#"
    },
    {
      type: "success",
      icon: "nc-icon nc-money-coins",
      title: "Đang cập nhật",
      value: "...",
      detail: "#"
    },
    {
      type: "danger",
      icon: "nc-icon nc-vector",
      title: "Đang cập nhật",
      value: "...",
      detail: "#"
    },
    {
      type: "info",
      icon: "nc-icon nc-favourite-28",
      title: "Đang cập nhật",
      value: "...",
      detail: "#"
    }
  ],
  dashboardOrder: {
    data: {
      labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      datasets: [
        {
          label: "Data",
          borderColor: "#fcc468",
          fill: false,
          backgroundColor: "#fcc468",
          hoverBorderColor: "#fcc468",
          borderWidth: 2,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ]
    }
  },
  dashboardVisit: {
    data: {
      labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      datasets: [
        {
          label: "Data",
          borderColor: "#4cbdd7",
          fill: false,
          backgroundColor: "#4cbdd7",
          hoverBorderColor: "#4cbdd7",
          borderWidth: 2,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ]
    }
  },
  requestError: "",
  setting: {}
};

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});

export default store;
