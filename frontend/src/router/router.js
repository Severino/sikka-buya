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
 * CMS
 */


import CMSPage from '@/components/page/cms/CMSPage'


/**
 * Analytics
 */
import YearMintTablePage from "@/components/page/analytics/YearMintTablePage"


/**
 * Catalog
 */
import CatalogEntry from "@/components/page/catalog/CatalogEntry.vue"
import CardLinkPage from "@/components/page/CardLinkPage.vue"
import CatalogFilterSearch from "@/components/page/catalog/CatalogFilterSearch.vue"
import PersonPage from "@/components/page/catalog/PersonPage.vue"

/**
 * Editor Page
 */
import EditorPage from "@/components/page/editor/EditorPage.vue"
import LandingPage from "@/components/page/LandingPage.vue"
import PlaceholderLandingPage from "@/components/page/PlaceholderLandingPage.vue"
import CreateTypePage from "@/components/page/CreateTypePage.vue"
import CoinMarkOverview from "@/components/page/CoinMarkOverview.vue"
import CoinVerseOverview from "@/components/page/CoinVerseOverview.vue"
import InitialSetup from "@/components/page/InitialSetup.vue"
import UserManagementPage from "@/components/page/UserManagementPage.vue"
import FixDiff from "@/components/page/FixDiff.vue"
import PageNotFoundPage from "@/components/page/system/PageNotFoundPage"
import NewsPage from "@/components/page/News.vue"

import EditorPanel from "@/components/page/EditorPanel.vue"
import ExpertSearch from "@/components/page/editor/ExpertSearch.vue"

import Overview from "@/components/page/Overview.vue"
import PersonOverview from "@/components/page/PersonOverview"
import MaterialOverview from "@/components/page/MaterialOverview"



import TypeOverview from "@/components/page/TypeOverview.vue"

import CoinMarkForm from "@/components/page/property/CoinMarkForm"
import CoinVerseForm from "@/components/page/property/CoinVerseForm"
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



const routes = [
  {
    path: "/template",
    component: TemplatePage
  },
  {
    path: "/map/",
    name: "MapPage",
    component: MapPage,
    meta: { smallNav: true },
    redirect: {
      name: "Political Map"
    },
    children: [
      {
        path: '',
        name: 'Political Map',
        component: PoliticalMap,
        meta: { smallNav: true }
      },
      {
        path: "additional",
        name: "Additional Maps",
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
    path: "",
    component: CommonMain,
    redirect: "home",
    children: [
      {

        path: "/landing",
        name: "Landing",
        component: PlaceholderLandingPage
      },
      {
        meta: { auth: true },
        path: "/home",
        name: "Home",
        component: LandingPage
      },
      {
        meta: { auth: true },
        path: "/news",
        name: "NewsOverview",
        component: NewsPage,
      },
      {
        meta: { auth: true },
        path: "/news/:id",
        name: "NewsPage",
        component: CMSPage,
      },
      {
        path: '/catalog/',
        component: RouterContainer,
        name: 'Catalog',
        redirect: { name: "Catalog Overview" },
        meta: { auth: true },
        children: [{
          path: '',
          name: "Catalog Overview",
          component: CardLinkPage,
          props: {
            title: "routes.Catalog",
            links: [
              {
                title: 'routes.Catalog Ruler Explorer',
                image: "/image/button-images/catalog-person-tree-preview.png",
                to: { name: "Catalog Ruler Explorer" }
              },
              {
                title: "routes.Catalog Search",
                image: "/image/button-images/catalog-search-preview.png",
                to: { name: "Catalog Search" }
              },
              {
                title: "routes.Analytics Table",
                to: { name: "Analytics Table" }
              }
            ]
          }
        }, {
          path: 'search',
          name: 'Catalog Search',
          component: CatalogFilterSearch
        }, {
          path: 'ruler',
          name: 'Catalog Ruler Explorer',
          component: PersonPage
        },
        {
          path: ':id',
          name: 'Catalog Entry',
          component: CatalogEntry
        },
        {
          path: "/analytics",
          name: "Analytics Table",
          component: YearMintTablePage
        },
        ]
      }, {
        path: "/map-overview",
        name: "Map Overview",
        component: RouterContainer,
        redirect: { name: "Map Landing" },
        children: [
          {
            path: "",
            name: "Map Landing",
            component: CardLinkPage,
            props: {
              title: "routes.Map",
              links: [{
                title: "routes.Political Map",
                to: { name: 'Political Map' },
                image: "/image/button-images/political-map-preview.jpg",
              },
              {
                title: "routes.Additional Maps",
                to: { name: 'Additional Maps' },
                image: "/image/button-images/material-map-preview.jpg",
              },

              {
                title: "routes.Treasure Map",
                to: { name: "Treasure Map" }
              }
              ]
            },
          }]
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
          }, {
            path: "expert_search",
            name: "ExpertSearch",
            component: ExpertSearch,
            meta: { auth: true }
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
          }, {
            path: "coin_verse",
            name: "CoinVerseOverview",
            component: CoinVerseOverview
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
          },
          {
            path: "coin_verse/create",
            name: "CreateCoinVerse",
            component: CoinVerseForm
          }, {
            path: "coin_verse/:id",
            name: "EditCoinVerse",
            component: CoinVerseForm
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
          }
        ]
      },
      {
        path: "/404",
        name: "PageNotFound",
        component: PageNotFoundPage
      },
      {
        path: "*",
        name: "PageNotFoundFallback",
        component: PageNotFoundPage
      }
    ]
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

  if (to.fullPath === "/") next({ name: "Home" })
  else {
    if (to.matched.some(record => record.meta.auth)) {
      let auth = await Auth.check()
      if (auth) {
        next()
      } else {
        console.log(to.name)
        if (to.name === "Home") {
          router.push({ name: "Landing" })
        } else {
          const error = "Bitte loggen Sie sich ein!"
          router.push({
            name: "Login", params: {
              error
            }
          })

          store.commit("printError", error)
        }
      }
    }

    if (!redirect)
      next()
  }
})

export default router
