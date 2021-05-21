import Vue from "vue"
import VueRouter from 'vue-router'

//** AUTH */
import LoginPage from "@/components/page/auth/LoginPage"
import AcceptInvitePage from "@/components/page/auth/AcceptInvitePage"


import EditorPage from "@/components/page/editor/EditorPage.vue"
import LandingPage from "@/components/page/LandingPage.vue"
import CreateTypePage from "@/components/page/CreateTypePage.vue"
import CoinMarkOverview from "@/components/page/CoinMarkOverview.vue"
import InitialSetup from "@/components/page/InitialSetup.vue"
import UserManagementPage from "@/components/page/UserManagementPage.vue"
import PageNotFoundPage from "@/components/page/system/PageNotFoundPage"


import YearMintTablePage from "@/components/page/analytics/YearMintTablePage"


import EditorPanel from "@/components/page/EditorPanel.vue"
import Overview from "@/components/page/Overview.vue"
import SideTree from "@/components/page/SideTree.vue"

import TypeOverview from "@/components/page/TypeOverview.vue"
import TreeExplorer from "@/components/page/TreeExplorer.vue"
import TypePage from "@/components/page/TypePage.vue"
import CatalogEntry from "@/components/page/CatalogEntry"


import CoinMarkForm from "@/components/page/property/CoinMarkForm"
import HonorificForm from "@/components/page/property/HonorificForm"
import DynastyForm from "@/components/page/property/DynastyForm"
import MaterialForm from "@/components/page/property/MaterialForm"
import MintForm from "@/components/page/property/MintForm"
import NominalForm from "@/components/page/property/NominalForm"
import PersonForm from "@/components/page/property/PersonForm"
import RoleForm from "@/components/page/property/RoleForm"
import TitleForm from "@/components/page/property/TitleForm"
import Auth from "../utils/Auth.js"


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
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
    path: '/catalog/:id',
    name: 'CatalogEntry',
    component: CatalogEntry
  },
  {
    path: "/analytics/table/",
    name: "AnalyticsTable",
    component: YearMintTablePage

  },
  {
    path: '/explorer',
    name: 'Explorer',
    component: TreeExplorer
  }, {
    path: '/explorer2',
    name: 'Explorer2',
    component: SideTree
  }, {

    path: "/editor/",
    component: EditorPage,
    meta: { auth: true },
    children: [
      {
        path: "",
        name: "EditorPanel",
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
        path: ":property",
        name: "Property",
        component: Overview
      }, {
        path: 'type/create',
        name: 'TypeCreationPage',
        component: CreateTypePage
      }, {
        path: 'type/edit/:id',
        name: 'EditTypePage',
        component: CreateTypePage
      },
      {
        path: 'type/:id',
        name: 'TypePage',
        component: TypePage
      }, {
        path: "coinmark",
        name: "CoinMarkOverview",
        component: CoinMarkOverview
      },
      {
        path: "coinmark/create",
        name: "CreateCoinMark",
        component: CoinMarkForm
      }, {
        path: "coinmark/:id",
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
      }
    ]
  }
  , {
    path: "*",
    component: PageNotFoundPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta && to.meta.auth) {
    let auth = await Auth.check()
    if (auth) {
      next()
    } else {
      router.push({ name: "Login" })
    }
  } else {
    if (to.name == "Login") {
      let auth = await Auth.check()
      if (auth) router.push({ name: "EditorPanel" })
    }
    next()
  }
})

export default router
