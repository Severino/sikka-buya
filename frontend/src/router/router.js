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
import CatalogFullSearch from "@/components/page/catalog/CatalogFullSearch.vue"

import PersonExplorer from "@/components/page/catalog/PersonExplorer.vue"

/**
 * Editor Page
 */
import EditorPage from "@/components/page/editor/EditorPage.vue"
import LandingPage from "@/components/page/LandingPage.vue"
import CreateTypePage from "@/components/page/CreateTypePage.vue"
import CoinMarkOverview from "@/components/page/CoinMarkOverview.vue"
import InitialSetup from "@/components/page/InitialSetup.vue"
import UserManagementPage from "@/components/page/UserManagementPage.vue"
import FixDiff from "@/components/page/FixDiff.vue"
import PageNotFoundPage from "@/components/page/system/PageNotFoundPage"

import EditorPanel from "@/components/page/EditorPanel.vue"
import Overview from "@/components/page/Overview.vue"
import PersonOverview from "@/components/page/PersonOverview"
import MaterialOverview from "@/components/page/MaterialOverview"



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


/**
 * Maps
 */

import MapPage from "@/components/page/MapPage.vue"
import PoliticalMap from "@/components/map/PoliticalMap"
import MaterialMap from "@/components/map/MaterialMap"
import PlaygroundPage from "@/components/map/Playground"


import TemplatePage from "@/components/page/TemplatePage"
import { superUserIsSet } from '../utils/Setup.js'
import store from '../store.js'

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
  {
    path: "/template",
    component: TemplatePage
  },
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
        path: "/persons/",
        name: "OverlordAccordeon",
        component: PersonExplorer
      },
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
          path: 'full',
          name: 'CatalogFullSearch',
          component: CatalogFullSearch
        },
        {
          path: '/catalog/:id',
          name: 'CatalogEntry',
          component: CatalogEntry
        }]
      }, {
        path: "/map/",
        name: "MapPage",
        component: MapPage,
        meta: { smallNav: true },
        redirect: {
          name: "PoliticalMap"
        },
        children: [
          {
            path: '',
            name: 'PoliticalMap',
            component: PoliticalMap,
            meta: { smallNav: true },
          },
          {
            path: "material",
            name: "MaterialMap",
            component: MaterialMap,
            meta: { smallNav: true },
          },
          {
            path: "playground",
            name: "Playground",
            component: PlaygroundPage,
            meta: { smallNav: true },
          },
        ]
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
            path: "fixdiff",
            name: "FixDiff",
            component: FixDiff,
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
            component: TypeOverview,
            props: { adminView: true }
          },
          {
            path: "coin_mark",
            name: "CoinMarkOverview",
            component: CoinMarkOverview
          },
          {
            path: "person",
            name: "PersonOverview",
            component: PersonOverview
          },
          {
            path: "material",
            name: "MaterialOverview",
            component: MaterialOverview
          },
          {
            path: ":property",
            name: "Property",
            component: Overview,
            props: true
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
            redirect: { name: "PageNotFound" }
          }
        ]
      },
      {
        path: "*",
        redirect: { name: "PageNotFound" }
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
  routes,
  scrollBehavior(to, from, savedPosition) {

    /**
     * Dont change scroll if we stay on same site.
     * E.g. reload while reading an article.
     */
    if (to.name == from.name) {
      return false
    }

    /**
     * You may specify a scrollgroup for sites, that should retain scroll on 
     * reload. E.g. in tab-like routed component.
     */
    if (!to.scrollGroup || !from.scrollGroup) {
      return { x: 0, y: 0 }
    }

    if (savedPosition) {
      return savedPosition
    } else {
      const position = {}
      if (to.hash && document.querySelector(to.hash)) {
        position.selector = to.hash
        return position
      }
      return false
    }
  }
})

router.beforeEach(async (to, from, next) => {
  let redirect = false

  /**
   * As the 'store errors' are shown in the `App.vue`
   * on a global level, we must manually reset them on 
   * navigation.
   */
  store.commit("resetErrors");

  if (to.name == "InitialSetup" && await superUserIsSet()) {
    next({ name: "Home" })
  }

  if (to.fullPath == "/") next({ name: "Home" })
  else {
    if (to.matched.some(record => record.meta.auth)) {

      let auth = await Auth.check()
      if (auth) {
        next()
      } else {
        const error = "Bitte loggen Sie sich ein!"
        router.push({
          name: "Login", params: {
            error
          }
        })

        store.commit("printError", error)
      }
    } else {
      if (to.name == "Login") {

        let auth = await Auth.check()

        if (auth) {
          redirect = true
          router.push({ name: "Editor" })
        }
      }
    }

    if (!redirect)
      next()
  }
})

export default router
