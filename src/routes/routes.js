import DashboardLayout from "../components/Dashboard/Layout/DashboardLayout.vue";
// GeneralViews
import NotFound from "../components/GeneralViews/NotFoundPage.vue";
// Dashboard pages
const Overview = () =>
  import("src/components/Dashboard/Views/Dashboard/Overview.vue");
const Widgets = () =>
  import("src/components/Dashboard/Views/Dashboard/Widgets.vue");

// Pages
import TimeLine from "src/components/Dashboard/Views/Sample-Pages/TimeLinePage.vue";
import Login from "src/components/Dashboard/Views/Sample-Pages/Login.vue";
import Forgot from "src/components/Dashboard/Views/Sample-Pages/Forgot.vue";
import CreatePassword from "src/components/Dashboard/Views/Sample-Pages/CreatePassword.vue";
import Register from "src/components/Dashboard/Views/Sample-Pages/Register.vue";
import Lock from "src/components/Dashboard/Views/Sample-Pages/Lock.vue";
import { CREATE_SURVEY } from "../store/mutation-types";

// Products pages
const AllProducts = () =>
  import("src/components/Dashboard/Views/Products/All-Products.vue");
const ViewProduct = () =>
  import("src/components/Dashboard/Views/Products/View-Product.vue");
const CreateProduct = () =>
  import("src/components/Dashboard/Views/Products/Create-Product.vue");

// Attribute
const AllAttributes = () =>
  import("src/components/Dashboard/Views/Attributes/All-Attributes.vue");
const CreateAttributes = () =>
  import("src/components/Dashboard/Views/Attributes/Create-Attribute.vue");
const ViewAttributes = () =>
  import("src/components/Dashboard/Views/Attributes/Edit-Attribute.vue");

// Collections pages
const AllCollections = () =>
  import("src/components/Dashboard/Views/Products/All-Collections.vue");
const CreateCollection = () =>
  import("src/components/Dashboard/Views/Products/Create-Collection.vue");
const ViewCollection = () =>
  import("src/components/Dashboard/Views/Products/View-Collection.vue");

// const AllAttributes = () => import('src/components/Dashboard/Views/Products/All-Attributes.vue');

// Reviews pages
const AllReviews = () =>
  import("src/components/Dashboard/Views/Reviews/All-Reviews.vue");
const EditReview = () =>
  import("src/components/Dashboard/Views/Reviews/Edit-Review.vue");

// Notification pages
const AllNotifications = () =>
  import("src/components/Dashboard/Views/Notifications/All-Notifications.vue");
const EditNotification = () =>
  import("src/components/Dashboard/Views/Notifications/Edit-Notification.vue");
const CreateNotification = () =>
  import(
    "src/components/Dashboard/Views/Notifications/Create-Notification.vue"
  );

// Pages pages
const AllPages = () =>
  import("src/components/Dashboard/Views/Articles/All-Pages.vue");
const CreatePage = () =>
  import("src/components/Dashboard/Views/Articles/Create-Page.vue");
const EditPage = () =>
  import("src/components/Dashboard/Views/Articles/Edit-Page.vue");

// Article pages
const AllArticles = () =>
  import("src/components/Dashboard/Views/Articles/All-Articles.vue");
const CreateArticle = () =>
  import("src/components/Dashboard/Views/Articles/Create-Articles.vue");
const EditArticle = () =>
  import("src/components/Dashboard/Views/Articles/Edit-Articles.vue");

// Coupons pages
const AllCoupons = () =>
  import("src/components/Dashboard/Views/Coupons/All-Coupons.vue");
const CreateCoupon = () =>
  import("src/components/Dashboard/Views/Coupons/Create-Coupon.vue");
const EditCoupon = () =>
  import("src/components/Dashboard/Views/Coupons/Edit-Coupon.vue");

// Campaigns pages
const AllCampaigns = () =>
  import("src/components/Dashboard/Views/Campaign/All-Campaigns.vue");
const CreateCampaign = () =>
  import("src/components/Dashboard/Views/Campaign/Create-Campaign.vue");
const EditCampaign = () =>
  import("src/components/Dashboard/Views/Campaign/Edit-Campaign.vue");
const AllFlashsales = () =>
  import("src/components/Dashboard/Views/Campaign/All-Flashsales.vue");
const CreateFlashsale = () =>
  import("src/components/Dashboard/Views/Campaign/Create-Flashsale.vue");
const EditFlashsale = () =>
  import("src/components/Dashboard/Views/Campaign/Edit-Flashsale.vue");

// Orders pages
const AllOrders = () =>
  import("src/components/Dashboard/Views/Orders/All-Orders.vue");
const DraftOrders = () =>
  import("src/components/Dashboard/Views/Orders/Draft-Orders.vue");
const CreateOrder = () =>
  import("src/components/Dashboard/Views/Orders/Create-Order.vue");
const EditOrder = () =>
  import("src/components/Dashboard/Views/Orders/Edit-Order.vue");

// Customer
const AllCustomers = () =>
  import("src/components/Dashboard/Views/Customers/All-Customers.vue");
const CreateCustomer = () =>
  import("src/components/Dashboard/Views/Customers/Create-Customer.vue");
const EditCustomer = () =>
  import("src/components/Dashboard/Views/Customers/Edit-Customer.vue");

// Menus pages
const AllMenus = () =>
  import("src/components/Dashboard/Views/Theme/All-Menus.vue");
const EditMenu = () =>
  import("src/components/Dashboard/Views/Theme/Edit-Menu.vue");

// User pages
const AllUsers = () =>
  import("src/components/Dashboard/Views/Settings/All-Users.vue");
const CreateUser = () =>
  import("src/components/Dashboard/Views/Settings/Create-User.vue");
const EditUser = () =>
  import("src/components/Dashboard/Views/Settings/Edit-User.vue");

const AllTag = () =>
  import("src/components/Dashboard/Views/Settings/All-Tag.vue");
const AllMeta = () =>
  import("src/components/Dashboard/Views/Settings/All-Meta.vue");
const CouponSettingMeta = () =>
  import("src/components/Dashboard/Views/Settings/Coupon-Setting.vue");
const CollectionSettingMeta = () =>
  import("src/components/Dashboard/Views/Settings/Collection-Setting.vue");

// Warranty pages
const AllModels = () =>
  import("src/components/Dashboard/Views/Models/All-Models.vue");
const AllProductErrors = () =>
  import("src/components/Dashboard/Views/Product-Errors/All-ProductErrors.vue");
const AllWarrantyCodes = () =>
  import("src/components/Dashboard/Views/Warranty-Codes/All-WarrantyCodes.vue");
const AllProductAccessories = () =>
  import(
    "src/components/Dashboard/Views/Product-Accessories/All-ProductAccessories.vue"
  );

const AllWarrantyForms = () =>
  import("src/components/Dashboard/Views/Warranty-Forms/All-WarrantyForms.vue");
const CreateWarrantyForm = () =>
  import(
    "src/components/Dashboard/Views/Warranty-Forms/Create-WarrantyForm.vue"
  );
const EditWarrantyForm = () =>
  import("src/components/Dashboard/Views/Warranty-Forms/Edit-WarrantyForm.vue");

const AllMaintenanceForms = () =>
  import(
    "src/components/Dashboard/Views/Maintenance-Forms/All-MaintenanceForms.vue"
  );
const EditMaintenanceForm = () =>
  import(
    "src/components/Dashboard/Views/Maintenance-Forms/Edit-MaintenanceForm.vue"
  );

const AllReceiptForms = () =>
  import("src/components/Dashboard/Views/Receipt-Forms/All-ReceiptForms.vue");
const EditReceiptForm = () =>
  import("src/components/Dashboard/Views/Receipt-Forms/Edit-ReceiptForm.vue");

const AllQuotations = () =>
  import("src/components/Dashboard/Views/Quotations/All-Quotations.vue");
const EditQuotation = () =>
  import("src/components/Dashboard/Views/Quotations/Edit-Quotation.vue");

const AllInvoices = () =>
  import("src/components/Dashboard/Views/Invoices/All-Invoices.vue");
const EditInvoice = () =>
  import("src/components/Dashboard/Views/Invoices/Edit-Invoice.vue");

const AllReimbursements = () =>
  import(
    "src/components/Dashboard/Views/Reimbursements/All-Reimbursements.vue"
  );
const EditReimbursement = () =>
  import(
    "src/components/Dashboard/Views/Reimbursements/Edit-Reimbursement.vue"
  );

const AllPosts = () =>
  import("src/components/Dashboard/Views/Posts/All-Posts.vue");
const CreatePost = () =>
  import("src/components/Dashboard/Views/Posts/Create-Post.vue");
const EditPost = () =>
  import("src/components/Dashboard/Views/Posts/Edit-Post.vue");

// Room

const AllRooms = () =>
  import("src/components/Dashboard/Views/Rooms/All-Rooms.vue");
const CreateRoom = () =>
  import("src/components/Dashboard/Views/Rooms/Create-Room.vue");
const EditRoom = () =>
  import("src/components/Dashboard/Views/Rooms/Edit-Room.vue");
const AllRoomStudents = () =>
  import("src/components/Dashboard/Views/Rooms/All-Students.vue");
const AllLogStudents = () =>
  import("src/components/Dashboard/Views/Rooms/All-Logs.vue");
// Warranty Location
const AllWarrantyLocations = () =>
  import("src/components/Dashboard/Views/Warranty-Locations/All-Locations.vue");
const CreateWarrantyLocation = () =>
  import(
    "src/components/Dashboard/Views/Warranty-Locations/Create-Location.vue"
  );
const EditWarrantyLocation = () =>
  import("src/components/Dashboard/Views/Warranty-Locations/Edit-Location.vue");

//Warranty Posts
const AllWarrantyPosts = () =>
  import("src/components/Dashboard/Views/Warranty-Posts/All-Posts.vue");
const CreateWarrantyPost = () =>
  import("src/components/Dashboard/Views/Warranty-Posts/Create-Post.vue");
const EditWarrantyPost = () =>
  import("src/components/Dashboard/Views/Warranty-Posts/Edit-Post.vue");

//warranty report
const AllWarrantyReport = () =>
  import("src/components/Dashboard/Views/Warranty/Report/All-Report.vue");

// Education document
const AllDocuments = () =>
  import("src/components/Dashboard/Views/Education/Document/All-Documents.vue");
const EditDocument = () =>
  import("src/components/Dashboard/Views/Education/Document/Edit-Document.vue");
const CreateDocument = () =>
  import(
    "src/components/Dashboard/Views/Education/Document/Create-Document.vue"
  );

// Education teacher
const AllTeachers = () =>
  import("src/components/Dashboard/Views/Education/Teacher/All-Teachers.vue");
const EditTeachers = () =>
  import("src/components/Dashboard/Views/Education/Teacher/Edit-Teacher.vue");

// Education survey
const AllSurveys = () =>
  import("src/components/Dashboard/Views/Education/Survey/All-Surveys.vue");
const EditSurvey = () =>
  import("src/components/Dashboard/Views/Education/Survey/Edit-Survey.vue");
const CreateSurvey = () =>
  import("src/components/Dashboard/Views/Education/Survey/Create-Survey.vue");

// Education posts
const AllEducationPosts = () =>
  import("src/components/Dashboard/Views/Education/Post/All-Posts.vue");
const CreateEducationPost = () =>
  import("src/components/Dashboard/Views/Education/Post/Create-Post.vue");
const EditEducationPost = () =>
  import("src/components/Dashboard/Views/Education/Post/Edit-Post.vue");

//Education report
const AllReport = () =>
  import("src/components/Dashboard/Views/Education/Report/All-Report.vue");

// Education exam
const AllExams = () =>
  import("src/components/Dashboard/Views/Education/Exam/All-Exams.vue");
const CreateExam = () =>
  import("src/components/Dashboard/Views/Education/Exam/Create-Exam.vue");
const EditExam = () =>
  import("src/components/Dashboard/Views/Education/Exam/Edit-Exam.vue");

// Education coupon
const AllEducationCoupons = () =>
  import("src/components/Dashboard/Views/Education/Coupon/All-Coupons.vue");
const CreateEducationCoupon = () =>
  import("src/components/Dashboard/Views/Education/Coupon/Create-Coupon.vue");
const EditEducationCoupon = () =>
  import("src/components/Dashboard/Views/Education/Coupon/Edit-Coupon.vue");

//ticket
const AllTickets = () =>
  import("src/components/Dashboard/Views/Education/Ticket/All-Tickets.vue");

// agency
const AllAgency = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Agency/All-Agency.vue"
  );
const CreateAgency = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Agency/Create-Agency.vue"
  );
const EditAgency = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Agency/Edit-Agency.vue"
  );

const AllCSSurveys = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Survey/All-Surveys.vue"
  );
const CreateCSSurvey = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Survey/Create-Survey.vue"
  );
const EditCSSurvey = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Survey/Edit-Survey.vue"
  );

//Education report
const AllCSReport = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Report/All-Report.vue"
  );

//Customer service coupon
const AllCSCoupons = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Coupon/All-Coupons.vue"
  );
const CreateCSCoupon = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Coupon/Create-Coupon.vue"
  );
const EditCSCoupon = () =>
  import(
    "src/components/Dashboard/Views/Customer-Service/Coupon/Edit-Coupon.vue"
  );

//Settings
const AllTheme = () =>
  import("src/components/Dashboard/Views/Theme/All-Setting.vue");

//Departments
const AllDepartments = () =>
  import("src/components/Dashboard/Views/Departments/All-Departments.vue");
const CreateDepartment = () =>
  import("src/components/Dashboard/Views/Departments/Create-Department.vue");
const EditDepartment = () =>
  import("src/components/Dashboard/Views/Departments/Edit-Department.vue");

//Courses

const AllCourses = () =>
  import("src/components/Dashboard/Views/Courses/All-Courses.vue");
const CreateCourse = () =>
  import("src/components/Dashboard/Views/Courses/Create-Course.vue");
const EditCourse = () =>
  import("src/components/Dashboard/Views/Courses/Edit-Course.vue");

//Groups

const AllGroups = () =>
  import("src/components/Dashboard/Views/Groups/All-Groups.vue");
const CreateGroup = () =>
  import("src/components/Dashboard/Views/Groups/Create-Group.vue");
const EditGroup = () =>
  import("src/components/Dashboard/Views/Groups/Edit-Group.vue");
const AllGroupStudents = () =>
  import("src/components/Dashboard/Views/Groups/All-Students.vue");
const AllGroupStatistic = () =>
  import("src/components/Dashboard/Views/Groups/All-Statistic.vue");
const customerServiceMenu = {
  path: "/cs",
  component: DashboardLayout,
  children: [
    {
      path: "coupon",
      name: "AllCSCoupons",
      component: AllCSCoupons
    },
    {
      path: "coupon/create",
      name: "CreateEducationCoupon",
      component: CreateCSCoupon
    },
    {
      path: "coupon/:id",
      name: "EditEducationCoupon",
      component: EditCSCoupon
    },
    {
      path: "agency",
      name: "AllAgency",
      component: AllAgency
    },
    {
      path: "agency/create",
      name: "CreateAgency",
      component: CreateAgency
    },
    {
      path: "agency/:id",
      name: "EditAgency",
      component: EditAgency
    },
    {
      path: "survey",
      name: "AllCSSurvey",
      component: AllCSSurveys
    },
    {
      path: "survey/create",
      name: "CreateCSSurvey",
      component: CreateCSSurvey
    },
    {
      path: "survey/:id",
      name: "EditCSSurvey",
      component: EditCSSurvey
    },
    {
      path: "report",
      name: "AllCSReport",
      component: AllCSReport
    }
  ]
};

const educationMenu = {
  path: "/education",
  component: DashboardLayout,
  children: [
    {
      path: "coupon",
      name: "AllEducationCoupons",
      component: AllEducationCoupons
    },
    {
      path: "coupon/create",
      name: "CreateEducationCoupon",
      component: CreateEducationCoupon
    },
    {
      path: "coupon/:id",
      name: "EditEducationCoupon",
      component: EditEducationCoupon
    },
    {
      path: "document",
      name: "AllDocuments",
      component: AllDocuments
    },
    {
      path: "document/create",
      name: "CreateDocument",
      component: CreateDocument
    },
    {
      path: "document/:id",
      name: "EditDocument",
      component: EditDocument
    },
    {
      path: "teacher",
      name: "AllTeacher",
      component: AllTeachers
    },
    {
      path: "teacher/:id",
      name: "EditTeacher",
      component: EditTeachers
    },
    {
      path: "survey",
      name: "AllSurvey",
      component: AllSurveys
    },
    {
      path: "survey/create",
      name: "CreateSurvey",
      component: CreateSurvey
    },
    {
      path: "survey/:id",
      name: "EditSurvey",
      component: EditSurvey
    },
    {
      path: "post",
      name: "AllEducationPost",
      component: AllEducationPosts
    },
    {
      path: "post/create",
      name: "CreateEducationPost",
      component: CreateEducationPost
    },
    {
      path: "post/:id",
      name: "EditEducationPost",
      component: EditEducationPost
    },
    {
      path: "exam",
      name: "AllExam",
      component: AllExams
    },
    {
      path: "exam/create",
      name: "CreateExam",
      component: CreateExam
    },
    {
      path: "exam/:id",
      name: "EditExam",
      component: EditExam
    },
    {
      path: "ticket",
      name: "AllTicket",
      component: AllTickets
    },
    {
      path: "report",
      name: "AllReport",
      component: AllReport
    }
  ]
};

const ordersMenu = {
  path: "/orders",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllOrders",
      component: AllOrders
    },
    {
      path: "draft",
      name: "DraftOrders",
      component: DraftOrders
    },
    {
      path: "create",
      name: "CreateOrder",
      component: CreateOrder
    },
    {
      path: ":id",
      name: "EditOrder",
      component: EditOrder
    }
  ]
};

const productMenu = {
  path: "/product",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllProducts",
      component: AllProducts
    },
    {
      path: "create",
      name: "CreateProduct",
      component: CreateProduct
    },
    {
      path: ":id",
      name: "ViewProduct",
      component: ViewProduct
    }
  ]
};

const articleMenu = {
  path: "/article",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllArticles",
      component: AllArticles
    },
    {
      path: "create",
      name: "CreateArticle",
      component: CreateArticle
    },
    {
      path: ":id",
      name: "EditArticle",
      component: EditArticle
    }
  ]
};

const attributeMenu = {
  path: "/attributes",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllAttributes",
      component: AllAttributes
    },
    {
      path: "create",
      name: "CreateAttributes",
      component: CreateAttributes
    },
    {
      path: ":id",
      name: "ViewAttributes",
      component: ViewAttributes
    }
  ]
};

const collectionsMenu = {
  path: "/collections",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllCollections",
      component: AllCollections
    },
    {
      path: "create",
      name: "CreateCollection",
      component: CreateCollection
    },
    {
      path: ":id",
      name: "ViewCollection",
      component: ViewCollection
    }
  ]
};

const attributesMenu = {
  path: "/attributes",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllAttributes",
      component: AllAttributes
    }
  ]
};

const customerMenu = {
  path: "/customer",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllCustomers",
      component: AllCustomers
    },
    {
      path: "create",
      name: "CreateCustomer",
      component: CreateCustomer
    },
    {
      path: ":id",
      name: "EditCustomer",
      component: EditCustomer
    }
  ]
};

const couponMenu = {
  path: "/coupon",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllCoupons",
      component: AllCoupons
    },
    {
      path: "create",
      name: "CreateCoupon",
      component: CreateCoupon
    },
    {
      path: ":id",
      name: "EditCoupon",
      component: EditCoupon
    }
  ]
};

const campaignMenu = {
  path: "/campaign",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllCampaigns",
      component: AllCampaigns
    },
    {
      path: "create",
      name: "CreateCampaign",
      component: CreateCampaign
    },
    {
      path: ":id",
      name: "EditCampaign",
      component: EditCampaign
    }
  ]
};

const flashsaleMenu = {
  path: "/flashsale",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllFlashsales",
      component: AllFlashsales
    },
    {
      path: "create",
      name: "CreateFlashsale",
      component: CreateFlashsale
    },
    {
      path: ":id",
      name: "EditFlashsale",
      component: EditFlashsale
    }
  ]
};

const reviewMenu = {
  path: "/review",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllReviews",
      component: AllReviews
    },
    {
      path: ":id",
      name: "EditReview",
      component: EditReview
    }
  ]
};

const notificationMenu = {
  path: "/notification",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllNotifications",
      component: AllNotifications
    },
    {
      path: "create",
      name: "CreaateNotification",
      component: CreateNotification
    },
    {
      path: ":id",
      name: "EditNotification",
      component: EditNotification
    }
  ]
};

const modelMenu = {
  path: "/model",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllModels",
      component: AllModels
    }
  ]
};

const warrantyCodeMenu = {
  path: "/warranty-code",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllWarrantyCodes",
      component: AllWarrantyCodes
    }
  ]
};

const warrantyFormMenu = {
  path: "/warranty-form",
  component: DashboardLayout,

  children: [
    {
      path: "/",
      name: "AllWarrantyForms",
      component: AllWarrantyForms
    },
    {
      path: "create",
      name: "CreaateWarrantyForm",
      component: CreateWarrantyForm
    },
    {
      path: ":id",
      name: "EditWarrantyForm",
      component: EditWarrantyForm
    }
  ]
};

const MaintenanceFormMenu = {
  path: "/maintenance-form",
  component: DashboardLayout,

  children: [
    {
      path: "/",
      name: "AllMaintenanceForms",
      component: AllMaintenanceForms
    },
    {
      path: ":id",
      name: "EditMaintenanceForm",
      component: EditMaintenanceForm
    }
  ]
};

const receiptMenu = {
  path: "/receipt-form",
  component: DashboardLayout,

  children: [
    {
      path: "/",
      name: "AllReceiptForms",
      component: AllReceiptForms
    },
    {
      path: ":id",
      name: "EditReceiptForm",
      component: EditReceiptForm
    }
  ]
};

const quotationMenu = {
  path: "/quotation",
  component: DashboardLayout,

  children: [
    {
      path: "/",
      name: "AllQuotations",
      component: AllQuotations
    },
    {
      path: ":id",
      name: "EditQuotation",
      component: EditQuotation
    }
  ]
};

const invoiceMenu = {
  path: "/invoice",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllInvoices",
      component: AllInvoices
    },
    {
      path: ":id",
      name: "EditInvoice",
      component: EditInvoice
    }
  ]
};

const reimbursementMenu = {
  path: "/reimbursement",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllReimbursements",
      component: AllReimbursements
    },
    {
      path: ":id",
      name: "EditReimbursement",
      component: EditReimbursement
    }
  ]
};

const warrantyPostMenu = {
  path: "/warranty-post",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllWarrantyPosts",
      component: AllWarrantyPosts
    },
    {
      path: "create",
      name: "CreateWarrantyPost",
      component: CreateWarrantyPost
    },
    {
      path: ":id",
      name: "EditWarrantyPost",
      component: EditWarrantyPost
    }
  ]
};

const warrantyReportMenu = {
  path: "/warranty-report",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllWarrantyReport",
      component: AllWarrantyReport
    }
  ]
};

const warrantySettingMenu = {
  path: "/setting",
  component: DashboardLayout,
  children: [
    {
      path: "model",
      name: "AllModels",
      component: AllModels
    },
    {
      path: "product-error",
      name: "AllProductErrors",
      component: AllProductErrors
    },
    {
      path: "product-accessories",
      name: "AllProductAccessories",
      component: AllProductAccessories
    }
  ]
};

// Warranty Location Menu
const warrantyLocationMenu = {
  path: "/warranty-location",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllWarrantyLocations",
      component: AllWarrantyLocations
    },
    {
      path: "create",
      name: "CreateWarrantyLocation",
      component: CreateWarrantyLocation
    },
    {
      path: ":id",
      name: "EditWarrantyLocation",
      component: EditWarrantyLocation
    }
  ]
};

const settingMenu = {
  path: "/setting",
  component: DashboardLayout,
  children: [
    {
      path: "theme",
      name: "AllTheme",
      component: AllTheme
    },
    {
      path: "staff",
      name: "AllUsers",
      component: AllUsers
    },
    {
      path: "staff/create",
      name: "CreateUser",
      component: CreateUser
    },
    {
      path: "staff/:id",
      name: "EditUser",
      component: EditUser
    },
    {
      path: "page",
      name: "AllPages",
      component: AllPages
    },
    {
      path: "page/create",
      name: "CreatePage",
      component: CreatePage
    },
    {
      path: "page/:id",
      name: "EditPage",
      component: EditPage
    },
    {
      path: "menu",
      name: "AllMenus",
      component: AllMenus
    },
    {
      path: "menu/:id",
      name: "EditMenu",
      component: EditMenu
    },
    {
      path: "meta",
      name: "AllMeta",
      component: AllMeta
    },
    {
      path: "coupon",
      name: "CouponSettingMeta",
      component: CouponSettingMeta
    },
    {
      path: "collection",
      name: "CollectionSettingMeta",
      component: CollectionSettingMeta
    }
  ]
};

const tagMenu = {
  path: "/tags",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllTag",
      component: AllTag
    }
  ]
};

const loginPage = {
  path: "/login",
  name: "Login",
  component: Login
};

const forgotPage = {
  path: "/forgot",
  name: "Forgot",
  component: Forgot
};

const createPasswordPage = {
  path: "/create_password/:token",
  name: "CreatePassword",
  component: CreatePassword
};

const registerPage = {
  path: "/register",
  name: "Register",
  component: Register
};

const roomMenu = {
  path: "/rooms",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllRooms",
      component: AllRooms
    },
    {
      path: "create",
      name: "CreateRoom",
      component: CreateRoom
    },
    {
      path: ":id",
      name: "EditRoom",
      component: EditRoom
    },
    {
      path: "students/:id",
      name: "AllRoomStudents",
      component: AllRoomStudents
    },
    {
      path: "logs/:id",
      name: "AllLogStudents",
      component: AllLogStudents
    }
  ]
};

const departmentMenu = {
  path: "/departments",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllDepartments",
      component: AllDepartments
    },
    {
      path: "create",
      name: "CreateDepartment",
      component: CreateDepartment
    },
    {
      path: ":id",
      name: "EditDepartment",
      component: EditDepartment
    }
  ]
};

const courseMenu = {
  path: "/courses",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllCourses",
      component: AllCourses
    },
    {
      path: "create",
      name: "CreateCourse",
      component: CreateCourse
    },
    {
      path: ":id",
      name: "EditCourse",
      component: EditCourse
    }
  ]
};

const groupMenu = {
  path: "/groups",
  component: DashboardLayout,
  children: [
    {
      path: "/",
      name: "AllGroups",
      component: AllGroups
    },
    {
      path: "create",
      name: "CreateGroup",
      component: CreateGroup
    },
    {
      path: ":id",
      name: "EditGroup",
      component: EditGroup
    },
    {
      path: "students/:id",
      name: "AllGroupStudents",
      component: AllGroupStudents
    },
    {
      path: "statistic/:id",
      name: "AllGroupStatistic",
      component: AllGroupStatistic
    }
  ]
};

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    name: "dashboard"
  },
  // reviewMenu,
  // notificationMenu,
  loginPage,
  forgotPage,
  createPasswordPage,
  // registerPage,
  // productMenu,
  // articleMenu,
  // attributeMenu,
  // attributesMenu,
  // collectionsMenu,
  // ordersMenu,
  // couponMenu,
  // campaignMenu,
  // flashsaleMenu,
  // customerMenu,
  // settingMenu,
  // tagMenu,
  // modelMenu,
  // warrantyCodeMenu,
  // warrantyFormMenu,
  // MaintenanceFormMenu,
  // receiptMenu,
  // quotationMenu,
  // invoiceMenu,
  // reimbursementMenu,
  // warrantyPostMenu,
  // warrantySettingMenu,
  // warrantyReportMenu,
  educationMenu,
  roomMenu,
  departmentMenu,
  courseMenu,
  groupMenu,
  // customerServiceMenu,
  // warrantyLocationMenu,
  { path: "*", component: NotFound }
];

export default routes;
