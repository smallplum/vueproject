import Vue from 'vue';
import Router from 'vue-router';

// login
import login from 'page/login/login.vue';
import register from 'page/login/register.vue';
import review from 'page/login/review.vue';
import active from 'page/login/active.vue';
import resetEmail from 'page/login/resetEmail.vue';
import forgetpassword from 'page/login/forgetPassword.vue';

// home
import home from 'page/home/home.vue';
import ocrHome from 'page/home/ocrHome.vue';

// layout
import Layout from 'page/layout/layout.vue';
import LayoutUser from 'page/layout/layoutUser.vue';
import index from 'page/searching/index.vue';

//searching
import homepage from 'page/searching/homepage.vue';//新建任务
import historypage from 'page/searching/historypage.vue';//历史任务
import projectmanage from 'page/searching/projectmanage.vue';//项目管理
import molecularmanagement from 'page/searching/molecularmanagement.vue';//分子管理

//任务详情页
import taskmoleculedetail from 'page/searching/moleculeDetail/taskmoleculedetail.vue';//分子详情

//骨架跃进
import scaffoldHopping from 'page/searching/scaffoldHopping.vue';

//骨架衍生
import skeletonDerivation from 'page/searching/skeletonDerivation.vue';
import derivationResult from 'page/searching/derivationResult.vue';

//分子优化
import molecularOptimize from 'page/searching/molecularOptimize.vue';


//无权限
import noAuth from 'page/searching/noAuth.vue'
//分子详情页
import moleculeDetail from 'page/searching/moleculeDetail/moleculeDetail.vue';

//dmpk-t预测
import dmpktPredict from 'page/dmpkt/index.vue';


// ocr;
import newOcr from 'page/newocr/index.vue';
import readPDF from 'page/ocr/readPDF.vue';
import ocrRead from 'page/ocr/ocrRead.vue';


import resultItem from 'components/resultItem.vue';
import screentest from 'components/screentest.vue';

Vue.use(Router);

export const baseRouter = [
  {
    path: '/',
    redirect: '/login',
    meta:{
      title:'登录入口-望石智慧'
    }
  },
  // test
  {
    path: '/screentest',
    name: 'screentest',
    component: screentest
  },
  {
    path: '/resultItem',
    name: 'resultItem',
    component: resultItem
  },
  //home
  // {
  //   path: '/home',
  //   name: 'home',
  //   meta: {
  //     requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  //   },
  //   component: home
  // },
  // login
  {
    path: '/login',
    name: 'login',
    component: login,
    meta:{
      title:'登录入口-望石智慧'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: register,
    meta:{
      title:'注册入口-望石智慧'
    }
  },
  {
    path: '/review',
    name: 'review',
    component: review,
    meta:{
      title:'审核入口-望石智慧'
    }
  },
  {
    path: '/active',
    name: 'active',
    component: active,
    meta:{
      title:'激活入口-望石智慧'
    }
  },

  {
    path: '/resetEmail',
    name: 'resetEmail',
    component: resetEmail,
    meta:{
      title:'二次激活-望石智慧'
    }
  },
  {
    path: '/forgetpassword',
    name: 'forgetpassword',
    component: forgetpassword,
    meta:{
      title:'忘记密码-望石智慧'
    }
  },

  //search
  {
    path: '/search',
    component: Layout,
    children: [
      {
        path: '',
        name: 'search',
        component: index,
        children: [
          {
            path: '',
            name: 'searchHome',
            component: scaffoldHopping,
            meta: {
              title:'骨架跃迁-望石智慧',
              requireAuth: true,
            },
          },
          {
            path: 'homepage',
            name: 'homepage',
            component: homepage,
            meta: {
              title:'新建任务-望石智慧',
              requireAuth: true,
            },
          },
          {
            path: 'historypage',
            name: 'historypage',
            component: historypage,
            meta: {
              title:'任务列表-望石智慧',
              requireAuth: true,
            },
          },
        
          {
            path: 'taskmoleculedetail',
            name: 'taskmoleculedetail',
            component: taskmoleculedetail,
            meta: {
              title:'分子详情-望石智慧',
              requireAuth: true,
            },
          },
          {
            path: 'projectmanage',
            name: 'projectmanage',
            component: projectmanage,
            meta: {
              title:'新建项目-望石智慧',
              requireAuth: true,
            },
          },
          {
            path: 'molecularmanagement',
            name: 'molecularmanagement',
            component: molecularmanagement,
            meta: {
              title:'项目管理-望石智慧',
              requireAuth: true,
            },
          },
          {
            path: 'scaffoldHopping',
            name: 'scaffoldHopping',
            component: scaffoldHopping,
            meta: {
              title:'骨架跃迁-望石智慧',
              requireAuth: true,
              vipAuth:true
            },
          },
  
          {
            path: 'noAuth',
            name: 'noAuth',
            component: noAuth,
            meta: {
              title:'药物设计无权限-望石智慧',
              requireAuth: true,
            },         
          },

          {
            path: 'skeletonDerivation',
            name: 'skeletonDerivation',
            component: skeletonDerivation,
            meta: {
              title:'骨架衍生-望石智慧',
              requireAuth: true,
              vipAuth:true
            },
          },
          {
            path: 'molecularOptimize',
            name: 'molecularOptimize',
            component: molecularOptimize,
            meta: {
              title:'分子优化-望石智慧',
              requireAuth: true,
              vipAuth:true
            },
          },
          {
            path: 'derivationResult',
            name: 'derivationResult',
            component: derivationResult,
            meta: {
              title:'骨架衍生-望石智慧',
              requireAuth: true,
              vipAuth:true
            },
          },
    
          {
            path: 'moleculeDetail',
            name: 'moleculeDetail',
            component: moleculeDetail,
            meta: {
              title:'分子详情页-望石智慧',
              requireAuth: true,
              vipAuth:true
            },
          },

        ],
        meta: {
          requireAuth: true,
        },
      },
    ]
  },
  //ocrHome
  {
    path: '/newocr',
    component: Layout,
    children: [
      {
        path: '',
        name: 'newOcr',
        meta: {
          title:'结构式提取-望石智慧',
          requireAuth: true,
        },
        component: newOcr
      },
    ]
  },
  {
    path: '/ocrHome',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ocrHome',
        meta: {
          requireAuth: true,
        },
        component: ocrHome
      },
    ]
  },
  {
    path: '/ocr',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ocr',
        component: index,
        children: [
          {
            path: '',
            name: 'ocrHome',
            component: ocrRead,
            meta: {
              title:'结构式提取-望石智慧',
              requireAuth: true,
            },
          },
          {
            path: 'ocrRead',
            name: 'ocrRead',
            component: ocrRead,
            meta: {
              title:'结构式提取-望石智慧',
              requireAuth: true,
            },
          },
          {
            path: 'readPDF',
            name: 'readPDF',
            component: readPDF,
            meta: {
              title:'结构式提取-望石智慧',
              requireAuth: true,
            },
          },
        ],
        meta: {
          title:'结构式提取-望石智慧',
          requireAuth: true,
        },
      },
    ]
  },
  //dmpktpredict
  {
    path: '/dmpktpredict',
    name: 'dmpktpredict',
    component: Layout,
    children: [
      {
        path: '',
        name: 'dmpktPredict',
        meta: {
          title:'DMPK-T预测-望石智慧',
          requireAuth: true,
        },
        component: dmpktPredict
      },
    ]
  },

];

export default new Router({

  //  mode: 'history', //后端支持可开,取代#
  routes: baseRouter
});
