const Layout = () => import("@/layout/index.vue");

export default {
  path: "/admin/system",
  name: "System",
  component: Layout,
  redirect: "/admin/system/profile",
  meta: {
    icon: "ep/setting",
    title: "系统管理",
    rank: 10
  },
  children: [
    {
      path: "/admin/system/profile",
      name: "ProfileIndex",
      component: () => import("@/views/admin/profile/index.vue"),
      meta: {
        icon: "ep/user",
        title: "个人资料"
      }
    },
    {
      path: "/admin/system/settings",
      name: "SettingsIndex",
      component: () => import("@/views/admin/settings/index.vue"),
      meta: {
        icon: "ep/setting",
        title: "系统设置"
      }
    }
  ]
} satisfies RouteConfigsTable;
