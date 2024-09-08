import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
//import HomeView from "../views/HomeView.vue";
import LayoutIndex from "@/layout/index.vue";
import RouteChild from "@/layout/routechild.vue";
import { CustomRouteMeta } from "@/api/interface";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "LoginIndex",
    component: () => import("@/views/login/index.vue"),
    meta: { visible: false } as CustomRouteMeta,
  },
  // {
  //   path: "/",
  //   component: LayoutIndex,
  //   redirect: "/taskscurrent",
  //   name: "TaskM",
  //   meta: {
  //     title: "任务管理",
  //     menuup: true,
  //     icon: "HomeFilled",
  //     purview: { show: true, key: "" },
  //   } as CustomRouteMeta,
  //   children: [
  //     {
  //       path: "taskscurrent",
  //       component: () => import("@/views/tasklist/taskscurrent.vue"),
  //       name: "TasksCurrent",
  //       meta: {
  //         title: "当前任务",
  //         icon: "StarFilled",
  //         cache: false,
  //         affix: true,
  //         purview: { show: true, key: "" },
  //       } as CustomRouteMeta,
  //     },
  //     {
  //       path: "taskcurrent/:value/:label",
  //       component: () => import("@/views/tasklist/taskcurrent.vue"),
  //       name: "TaskCurrent",
  //       meta: {
  //         title: "当前任务",
  //         icon: "HomeFilled",
  //         visible: false,
  //         cache: false,
  //         purview: { show: true, key: "" },
  //       } as CustomRouteMeta,
  //     },
  //     {
  //       path: "tasklist",
  //       component: () => import("@/views/tasklist/tasks.vue"),
  //       name: "TaskList",
  //       meta: {
  //         title: "任务列表",
  //         icon: "Management",
  //         visible: true,
  //         cache: false,
  //         purview: { show: true, key: "" },
  //       } as CustomRouteMeta,
  //     },
  //   ],
  // },
  // {
  //   path: "/device",
  //   component: LayoutIndex,
  //   redirect: "",
  //   name: "DeviceM",
  //   meta: {
  //     title: "设备管理",
  //     purview: { show: true, key: "DeviceM" },
  //   } as CustomRouteMeta,

  //   children: [
  //     {
  //       path: "device",
  //       component: () => import("@/views/device/devices.vue"),
  //       name: "DeviceList",
  //       meta: {
  //         title: "设备信息",
  //         icon: "Platform",
  //         purview: { show: true, key: "" },
  //       } as CustomRouteMeta,
  //     },
  //   ],
  // },
  {
    path: "/",
    component: LayoutIndex,
    redirect: "/devicemonitor",
    name: "Monitor",
    meta: {
      title: "设备监控",
      menuup: true,
      icon: "View",
      purview: { show: true, key: "Monitor" },
    },

    children: [
      {
        path: "devicemonitor",
        component: () => import("@/views/monitor/gasmonitor.vue"),
        name: "DeviceMonitor",
        meta: {
          title: "设备监控",
          icon: "View",
          cache: false,
          purview: { show: true, key: "Monitor_All" },
        },
      },
      {
        path: "devicehlist",
        component: () => import("@/views/monitor/devicelist.vue"),
        name: "DeviceHList",
        meta: {
          title: "历史浓度",
          icon: "View",
          visible: true,
          cache: false,
          purview: { show: true, key: "Device_All" },
        },
      },
    ],
  },

  {
    path: "/report",
    component: LayoutIndex,
    redirect: "",
    name: "Report",
    meta: {
      title: "报表管理",
      icon: "Histogram",
      purview: { show: true, key: "Report" },
    },

    children: [
      {
        path: "laserprod",
        component: () => import("@/views/devproduction/laser.vue"),
        name: "LaserProduction",
        meta: {
          title: "月报表",
          cache: false,
          purview: { show: true, key: "Report_DevProd_Laser" },
        },
      },
      {
        path: "sortprod",
        component: () => import("@/views/devproduction/sort.vue"),
        name: "SortProduction",
        meta: {
          title: "年度报表",
          cache: false,
          purview: { show: true, key: "Report_DevProd_Sort" },
        },
      },
    ],
  },
  {
    path: "/system",
    component: LayoutIndex,
    redirect: "/system/device",
    name: "System",
    meta: {
      title: "系统管理",
      menuup: true,
      icon: "Tools",
      purview: { show: true, key: "Log" },
    },
    children: [
      {
        path: "device",
        component: () => import("@/views/device/devices.vue"),
        name: "DeviceList",
        meta: {
          title: "设备管理",
          icon: "Platform",
          purview: { show: true, key: "" },
        } as CustomRouteMeta,
      },
      {
        path: "user",
        component: () => import("@/views/user/users.vue"),
        name: "UserList",
        meta: {
          title: "用户管理",
          icon: "UserFilled",
          cache: false,
          purview: { show: true, key: "" },
        },
      },
      {
        path: "role",
        component: () => import("@/views/role/roles.vue"),
        name: "RoleList",
        meta: {
          title: "角色管理",
          icon: "UserFilled",
          cache: false,
          purview: { show: true, key: "" },
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
