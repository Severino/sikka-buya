"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _CommonMain = _interopRequireDefault(require("@/components/main/CommonMain"));

var _RouterContainer = _interopRequireDefault(require("@/components/page/RouterContainer.vue"));

var _LoginPage = _interopRequireDefault(require("@/components/page/auth/LoginPage"));

var _AcceptInvitePage = _interopRequireDefault(require("@/components/page/auth/AcceptInvitePage"));

var _AnalyticsDashboard = _interopRequireDefault(require("@/components/page/analytics/AnalyticsDashboard"));

var _YearMintTablePage = _interopRequireDefault(require("@/components/page/analytics/YearMintTablePage"));

var _CatalogEntry = _interopRequireDefault(require("@/components/page/catalog/CatalogEntry.vue"));

var _CatalogLanding = _interopRequireDefault(require("@/components/page/catalog/CatalogLanding.vue"));

var _CatalogFullSearch = _interopRequireDefault(require("@/components/page/catalog/CatalogFullSearch.vue"));

var _PersonExplorer = _interopRequireDefault(require("@/components/page/catalog/PersonExplorer.vue"));

var _EditorPage = _interopRequireDefault(require("@/components/page/editor/EditorPage.vue"));

var _LandingPage = _interopRequireDefault(require("@/components/page/LandingPage.vue"));

var _CreateTypePage = _interopRequireDefault(require("@/components/page/CreateTypePage.vue"));

var _CoinMarkOverview = _interopRequireDefault(require("@/components/page/CoinMarkOverview.vue"));

var _InitialSetup = _interopRequireDefault(require("@/components/page/InitialSetup.vue"));

var _UserManagementPage = _interopRequireDefault(require("@/components/page/UserManagementPage.vue"));

var _FixDiff = _interopRequireDefault(require("@/components/page/FixDiff.vue"));

var _PageNotFoundPage = _interopRequireDefault(require("@/components/page/system/PageNotFoundPage"));

var _EditorPanel = _interopRequireDefault(require("@/components/page/EditorPanel.vue"));

var _Overview = _interopRequireDefault(require("@/components/page/Overview.vue"));

var _PersonOverview = _interopRequireDefault(require("@/components/page/PersonOverview"));

var _MaterialOverview = _interopRequireDefault(require("@/components/page/MaterialOverview"));

var _TypeOverview = _interopRequireDefault(require("@/components/page/TypeOverview.vue"));

var _CoinMarkForm = _interopRequireDefault(require("@/components/page/property/CoinMarkForm"));

var _HonorificForm = _interopRequireDefault(require("@/components/page/property/HonorificForm"));

var _DynastyForm = _interopRequireDefault(require("@/components/page/property/DynastyForm"));

var _MaterialForm = _interopRequireDefault(require("@/components/page/property/MaterialForm"));

var _MintForm = _interopRequireDefault(require("@/components/page/property/MintForm"));

var _NominalForm = _interopRequireDefault(require("@/components/page/property/NominalForm"));

var _PersonForm = _interopRequireDefault(require("@/components/page/property/PersonForm"));

var _ProvinceForm = _interopRequireDefault(require("@/components/page/property/ProvinceForm"));

var _RoleForm = _interopRequireDefault(require("@/components/page/property/RoleForm"));

var _TitleForm = _interopRequireDefault(require("@/components/page/property/TitleForm"));

var _Auth = _interopRequireDefault(require("../utils/Auth.js"));

var _MapPage = _interopRequireDefault(require("@/components/page/MapPage.vue"));

var _PoliticalMap = _interopRequireDefault(require("@/components/map/PoliticalMap"));

var _MaterialMap = _interopRequireDefault(require("@/components/map/MaterialMap"));

var _Playground = _interopRequireDefault(require("@/components/map/Playground"));

var _TemplatePage = _interopRequireDefault(require("@/components/page/TemplatePage"));

var _Setup = require("../utils/Setup.js");

var _store = _interopRequireDefault(require("../store.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Mains:
 * 
 * Mains are the first layer inside the App.vue.
 * This allows us to change the 'environment' of the
 * app, on differents parts of the application.
 * 
 * E.G. Most of the time we want the usual navigation + 
 * content section. But on the map we want to reduce the
 * navigation or eliminate it completely.
 */
//** AUTH */

/**
 * Analytics
 */

/**
 * Catalog
 */

/**
 * Editor Page
 */

/**
 * Maps
 */
_vue["default"].use(_vueRouter["default"]);

var analyticsRoutes = {
  path: "/analytics/",
  component: _RouterContainer["default"],
  children: [{
    path: "",
    name: "Analytics",
    component: _AnalyticsDashboard["default"]
  }, {
    path: "/table/",
    name: "AnalyticsTable",
    component: _YearMintTablePage["default"]
  }]
};
var routes = [{
  path: "/template",
  component: _TemplatePage["default"]
}, {
  path: "*",
  component: _CommonMain["default"],
  children: [{
    path: "/home",
    name: "Home",
    component: _LandingPage["default"]
  }, analyticsRoutes, {
    path: "/persons/",
    name: "OverlordAccordeon",
    component: _PersonExplorer["default"]
  }, {
    path: '/catalog/',
    component: _RouterContainer["default"],
    meta: {
      auth: true
    },
    children: [{
      path: '',
      name: 'Catalog',
      component: _CatalogLanding["default"]
    }, {
      path: 'full',
      name: 'CatalogFullSearch',
      component: _CatalogFullSearch["default"]
    }, {
      path: '/catalog/:id',
      name: 'CatalogEntry',
      component: _CatalogEntry["default"]
    }]
  }, {
    path: "/map/",
    name: "MapPage",
    component: _MapPage["default"],
    meta: {
      smallNav: true
    },
    redirect: {
      name: "PoliticalMap"
    },
    children: [{
      path: '',
      name: 'PoliticalMap',
      component: _PoliticalMap["default"],
      meta: {
        smallNav: true
      }
    }, {
      path: "material",
      name: "MaterialMap",
      component: _MaterialMap["default"],
      meta: {
        smallNav: true
      }
    }, {
      path: "playground",
      name: "Playground",
      component: _Playground["default"],
      meta: {
        smallNav: true
      }
    }]
  }, {
    path: '/setup',
    name: 'InitialSetup',
    component: _InitialSetup["default"]
  }, {
    path: '/login',
    name: 'Login',
    component: _LoginPage["default"]
  }, {
    path: '/invite/:mail',
    name: "InviteSignUp",
    component: _AcceptInvitePage["default"]
  }, {
    path: "/editor/",
    component: _EditorPage["default"],
    meta: {
      auth: true
    },
    children: [{
      path: "",
      name: "Editor",
      component: _EditorPanel["default"],
      meta: {
        auth: true
      }
    }, {
      path: "fixdiff",
      name: "FixDiff",
      component: _FixDiff["default"],
      meta: {
        auth: true
      }
    }, {
      path: 'user',
      name: 'UserManagement',
      component: _UserManagementPage["default"],
      meta: {
        auth: true,
        "super": true
      }
    }, {
      path: "type",
      name: "TypeOverview",
      component: _TypeOverview["default"],
      props: {
        adminView: true
      }
    }, {
      path: "coin_mark",
      name: "CoinMarkOverview",
      component: _CoinMarkOverview["default"]
    }, {
      path: "person",
      name: "PersonOverview",
      component: _PersonOverview["default"]
    }, {
      path: "material",
      name: "MaterialOverview",
      component: _MaterialOverview["default"]
    }, {
      path: ":property",
      name: "Property",
      component: _Overview["default"],
      props: true
    }, {
      path: 'type/create',
      name: 'TypeCreationPage',
      component: _CreateTypePage["default"]
    }, {
      path: 'type/edit/:id',
      name: 'EditType',
      component: _CreateTypePage["default"]
    }, {
      path: "coin_mark/create",
      name: "CreateCoinMark",
      component: _CoinMarkForm["default"]
    }, {
      path: "coin_mark/:id",
      name: "EditCoinMark",
      component: _CoinMarkForm["default"]
    }, {
      path: "material/create",
      name: "CreateMaterial",
      component: _MaterialForm["default"]
    }, {
      path: "material/:id",
      name: "EditMaterial",
      component: _MaterialForm["default"]
    }, {
      path: "person/create",
      name: "CreatePerson",
      component: _PersonForm["default"]
    }, {
      path: "person/:id",
      name: "EditPerson",
      component: _PersonForm["default"]
    }, {
      path: "title/create",
      name: "CreateTitle",
      component: _TitleForm["default"]
    }, {
      path: "title/:id",
      name: "EditTitle",
      component: _TitleForm["default"]
    }, {
      path: "honorific/create",
      name: "CreateHonorific",
      component: _HonorificForm["default"]
    }, {
      path: "honorific/:id",
      name: "EditHonorific",
      component: _HonorificForm["default"]
    }, {
      path: "mint/create",
      name: "CreateMint",
      component: _MintForm["default"]
    }, {
      path: "mint/:id",
      name: "EditMint",
      component: _MintForm["default"]
    }, {
      path: "nominal/create",
      name: "CreateNominal",
      component: _NominalForm["default"]
    }, {
      path: "nominal/:id",
      name: "EditNominal",
      component: _NominalForm["default"]
    }, {
      path: "role/create",
      name: "CreateRole",
      component: _RoleForm["default"]
    }, {
      path: "role/:id",
      name: "EditRole",
      component: _RoleForm["default"]
    }, {
      path: "dynasty/create",
      name: "CreateDynasty",
      component: _DynastyForm["default"]
    }, {
      path: "dynasty/:id",
      name: "EditDynasty",
      component: _DynastyForm["default"]
    }, {
      path: "province/create",
      name: "CreateProvince",
      component: _ProvinceForm["default"]
    }, {
      path: "province/:id",
      name: "EditProvince",
      component: _ProvinceForm["default"]
    }, {
      path: "*",
      redirect: {
        name: "PageNotFound"
      }
    }]
  }, {
    path: "*",
    redirect: {
      name: "PageNotFound"
    }
  }]
}, {
  path: "*",
  name: "PageNotFound",
  component: _PageNotFoundPage["default"]
}];
var router = new _vueRouter["default"]({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
  scrollBehavior: function scrollBehavior(to, from, savedPosition) {
    /**
     * Dont change scroll if we stay on same site.
     * E.g. reload while reading an article.
     */
    if (to.name == from.name) {
      return false;
    }
    /**
     * You may specify a scrollgroup for sites, that should retain scroll on 
     * reload. E.g. in tab-like routed component.
     */


    if (!to.scrollGroup || !from.scrollGroup) {
      return {
        x: 0,
        y: 0
      };
    }

    if (savedPosition) {
      return savedPosition;
    } else {
      var position = {};

      if (to.hash && document.querySelector(to.hash)) {
        position.selector = to.hash;
        return position;
      }

      return false;
    }
  }
});
router.beforeEach(function _callee(to, from, next) {
  var redirect, auth, error, _auth;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          redirect = false;
          /**
           * As the 'store errors' are shown in the `App.vue`
           * on a global level, we must manually reset them on 
           * navigation.
           */

          _store["default"].commit("resetErrors");

          _context.t0 = to.name == "InitialSetup";

          if (!_context.t0) {
            _context.next = 7;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _Setup.superUserIsSet)());

        case 6:
          _context.t0 = _context.sent;

        case 7:
          if (!_context.t0) {
            _context.next = 9;
            break;
          }

          next({
            name: "Home"
          });

        case 9:
          if (!(to.fullPath == "/")) {
            _context.next = 13;
            break;
          }

          next({
            name: "Home"
          });
          _context.next = 26;
          break;

        case 13:
          if (!to.matched.some(function (record) {
            return record.meta.auth;
          })) {
            _context.next = 20;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(_Auth["default"].check());

        case 16:
          auth = _context.sent;

          if (auth) {
            next();
          } else {
            error = "Bitte loggen Sie sich ein!";
            router.push({
              name: "Login",
              params: {
                error: error
              }
            });

            _store["default"].commit("printError", error);
          }

          _context.next = 25;
          break;

        case 20:
          if (!(to.name == "Login")) {
            _context.next = 25;
            break;
          }

          _context.next = 23;
          return regeneratorRuntime.awrap(_Auth["default"].check());

        case 23:
          _auth = _context.sent;

          if (_auth) {
            redirect = true;
            router.push({
              name: "Editor"
            });
          }

        case 25:
          if (!redirect) next();

        case 26:
        case "end":
          return _context.stop();
      }
    }
  });
});
var _default = router;
exports["default"] = _default;