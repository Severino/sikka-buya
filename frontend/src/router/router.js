import Vue from "vue"
import VueRouter from 'vue-router'

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

import CommonMain from "@/components/main/CommonMain"
import RouterContainer from "@/components/page/RouterContainer.vue"


//** AUTH */
import LoginPage from "@/components/page/auth/LoginPage"
import AcceptInvitePage from "@/components/page/auth/AcceptInvitePage"

/**
 * Analytics
 */
import AnalyticsDashboard from "@/components/page/analytics/AnalyticsDashboard"
import YearMintTablePage from "@/components/page/analytics/YearMintTablePage"


/**
 * Catalog
 */
import CatalogEntry from "@/components/page/catalog/CatalogEntry.vue"
import CatalogLanding from "@/components/page/catalog/CatalogLanding.vue"

/**
 * Editor Page
 */
import EditorPage from "@/components/page/editor/EditorPage.vue"
import LandingPage from "@/components/page/LandingPage.vue"
import MapPage from "@/components/page/MapPage.vue"
import CreateTypePage from "@/components/page/CreateTypePage.vue"
import CoinMarkOverview from "@/components/page/CoinMarkOverview.vue"
import InitialSetup from "@/components/page/InitialSetup.vue"
import UserManagementPage from "@/components/page/UserManagementPage.vue"
import PageNotFoundPage from "@/components/page/system/PageNotFoundPage"

import EditorPanel from "@/components/page/EditorPanel.vue"
import Overview from "@/components/page/Overview.vue"

import TypeOverview from "@/components/page/TypeOverview.vue"

import CoinMarkForm from "@/components/page/property/CoinMarkForm"
import HonorificForm from "@/components/page/property/HonorificForm"
import DynastyForm from "@/components/page/property/DynastyForm"
import MaterialForm from "@/components/page/property/MaterialForm"
import MintForm from "@/components/page/property/MintForm"
import NominalForm from "@/components/page/property/NominalForm"
import PersonForm from "@/components/page/property/PersonForm"
import ProvinceForm from "@/components/page/property/ProvinceForm"
import RoleForm from "@/components/page/property/RoleForm"
import TitleForm from "@/components/page/property/TitleForm"
import Auth from "../utils/Auth.js"


Vue.use(VueRouter)

const analyticsRoutes = {
  path: "/analytics/",
  component: RouterContainer,
  children: [
    {
      path: "",
      name: "Analytics",
      component: AnalyticsDashboard
    },
    {
      path: "/table/",
      name: "AnalyticsTable",
      component: YearMintTablePage
    },
  ]
}


const routes = [

  // {
  //   path: '/explorer',
  //   name: 'Explorer',
  //   component: TreeExplorer
  // }, {
  //   path: '/explorer2',
  //   name: 'Explorer2',
  //   component: SideTree
  // }, 

  {
    path: "*",
    component: CommonMain,
    children: [
      {
        path: "/home",
        name: "Home",
        component: LandingPage
      },
      analyticsRoutes,
      {
        path: '/catalog/',
        component: RouterContainer,
        meta: { auth: true },
        children: [{
          path: '',
          name: 'Catalog',
          component: CatalogLanding
        },
        {
          path: '/catalog/:id',
          name: 'CatalogEntry',
          component: CatalogEntry
        }]
      }, {
        path: "/map",
        name: "MapPage",
        component: MapPage
      },
      {
        path: '/setup',
        name: 'InitialSetup',
        component: InitialSetup
      },
      {
        path: '/login',
        name: 'Login',
        component: LoginPage
      },
      {
        path: '/invite/:mail',
        name: "InviteSignUp",
        component: AcceptInvitePage
      },
      {

        path: "/editor/",
        component: EditorPage,
        meta: { auth: true },
        children: [
          {
            path: "",
            name: "Editor",
            component: EditorPanel,
            meta: { auth: true },
          },
          {
            path: 'user',
            name: 'UserManagement',
            component: UserManagementPage,
            meta: { auth: true, super: true }
          },
          {

            path: "type",
            name: "TypeOverview",
            component: TypeOverview
          },
          {
            path: "coin_mark",
            name: "CoinMarkOverview",
            component: CoinMarkOverview
          },
          {
            path: ":property",
            name: "Property",
            component: Overview
          }, {
            path: 'type/create',
            name: 'TypeCreationPage',
            component: CreateTypePage
          }, {
            path: 'type/edit/:id',
            name: 'EditType',
            component: CreateTypePage
          },
          {
            path: "coin_mark/create",
            name: "CreateCoinMark",
            component: CoinMarkForm
          }, {
            path: "coin_mark/:id",
            name: "EditCoinMark",
            component: CoinMarkForm
          }, {
            path: "material/create",
            name: "CreateMaterial",
            component: MaterialForm
          }, {
            path: "material/:id",
            name: "EditMaterial",
            component: MaterialForm
          }, {
            path: "person/create",
            name: "CreatePerson",
            component: PersonForm
          }, {
            path: "person/:id",
            name: "EditPerson",
            component: PersonForm
          }, {
            path: "title/create",
            name: "CreateTitle",
            component: TitleForm
          }, {
            path: "title/:id",
            name: "EditTitle",
            component: TitleForm
          }, {
            path: "honorific/create",
            name: "CreateHonorific",
            component: HonorificForm
          }, {
            path: "honorific/:id",
            name: "EditHonorific",
            component: HonorificForm
          }, {
            path: "mint/create",
            name: "CreateMint",
            component: MintForm
          }, {
            path: "mint/:id",
            name: "EditMint",
            component: MintForm
          }, {
            path: "nominal/create",
            name: "CreateNominal",
            component: NominalForm
          }, {
            path: "nominal/:id",
            name: "EditNominal",
            component: NominalForm
          }, {
            path: "role/create",
            name: "CreateRole",
            component: RoleForm
          }, {
            path: "role/:id",
            name: "EditRole",
            component: RoleForm
          }, {
            path: "dynasty/create",
            name: "CreateDynasty",
            component: DynastyForm
          }, {
            path: "dynasty/:id",
            name: "EditDynasty",
            component: DynastyForm
          }, {
            path: "province/create",
            name: "CreateProvince",
            component: ProvinceForm
          }, {
            path: "province/:id",
            name: "EditProvince",
            component: ProvinceForm
          },
          {
            path: "*",
            name: "PageNotFound",
            component: PageNotFoundPage
          }
        ]
      },
      {
        path: "*",
        name: "PageNotFound",
        component: PageNotFoundPage
      }
    ]
  },
  {
    path: "*",
    name: "PageNotFound",
    component: PageNotFoundPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {

  if (to.fullPath == "/") next({ name: "Home" })


  if (to.matched.some(record => record.meta.auth)) {

    let auth = await Auth.check()
    if (auth) {
      next()
    } else {
      router.push({ name: "Login" })
    }
  } else {

    let redirect = false
    if (to.name == "Login") {
      let auth = await Auth.check()
      if (auth) {
        redirect = true
        router.push({ name: "Editor" })
      }
    }

    if (!redirect)
      next()
  }
})

export default router
