<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { isUrl, storageLocal } from "@pureadmin/utils";
import { type DataInfo, userKey } from "@/utils/auth";
import { getConfig } from "@/config";
import {
  getPublicPortalNavigationList,
  type PortalNavigationItem
} from "@/api/admin/portalNavigation";
import MenuIcon from "~icons/ri/menu-line";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";

defineOptions({
  name: "HomeLayout"
});

const router = useRouter();
const route = useRoute();
const navMenus = ref<PortalNavigationItem[]>([]);
const adminMenu = ref<PortalNavigationItem | null>(null);

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
// 页面加载时根据本地存储初始化主题
dataThemeChange(overallStyle.value);

// 当前激活的菜单项
const activeMenu = ref(route.path);

// 监听路由变化更新菜单高亮
watch(
  () => route.path,
  newPath => {
    activeMenu.value = newPath;
  }
);

// 检查管理员是否已登录
const isLogged = computed(() => {
  const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
  return !!userInfo;
});

// 跳转逻辑：如果已登录去控制台，未登录去登录页
const goAdmin = () => {
  if (isLogged.value) {
    router.push("/admin/dashboard");
  } else {
    router.push("/admin/login");
  }
};

const handleSelect = (key: string) => {
  const matchedMenu =
    navMenus.value.find(item => item.path === key) ||
    (actionMenus.value.adminMenu?.path === key ? actionMenus.value.adminMenu : null);

  switch (key) {
    case "admin":
      goAdmin();
      break;
    default:
      if (matchedMenu?.is_external || isUrl(key)) {
        window.open(key, "_blank");
        return;
      }
      router.push(key);
      break;
  }
};

/**
 * 获取门户公开导航
 * 从后台读取当前可见导航项并用于顶部菜单展示
 */
const fetchPortalNavigationList = async () => {
  try {
    const res = await getPublicPortalNavigationList();
    switch (res.code) {
      case 0:
        navMenus.value = (res.data || []).filter(item => item.path !== "admin");
        adminMenu.value = (res.data || []).find(item => item.path === "admin") || null;
        break;
      default:
        navMenus.value = [];
        adminMenu.value = null;
        break;
    }
  } catch {
    navMenus.value = [];
    adminMenu.value = null;
  }
};

/**
 * 获取导航显示名称
 * 管理员入口在登录后统一展示为进入控制台
 */
const getMenuName = (menu: PortalNavigationItem) => {
  switch (menu.path) {
    case "admin":
      return isLogged.value ? "进入控制台" : menu.name;
    default:
      return menu.name;
  }
};

/**
 * 判断菜单是否激活
 * 对首页链接额外兼容 /home 与 /home/index 两种路径
 */
const isMenuActive = (menu: PortalNavigationItem) => {
  switch (menu.path) {
    case "/home/index":
      return activeMenu.value === "/home/index" || activeMenu.value === "/home";
    default:
      return activeMenu.value === menu.path;
  }
};

onMounted(() => {
  fetchPortalNavigationList();
});

// 动态动作菜单配置方案 (控制按钮/下拉显隐)
const actionMenus = computed(() => {
  return {
    adminMenu: adminMenu.value
  };
});
</script>

<template>
  <div class="front-home-layout">
    <!-- 导航栏 -->
    <header class="header">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo" style="cursor: pointer" @click="router.push('/home')">
          <img
            v-if="getConfig()?.Logo"
            :src="getConfig()?.Logo"
            alt="logo"
            class="logo-img"
          />
          <span class="logo-text">{{ getConfig()?.Title || "加载中..." }}</span>
        </div>

        <!-- 移动端下拉菜单 -->
        <div class="mobile-nav">
          <el-switch
            v-model="dataTheme"
            inline-prompt
            :active-icon="dayIcon"
            :inactive-icon="darkIcon"
            @change="dataThemeChange"
            class="theme-switch"
          />
          <el-dropdown trigger="click" @command="handleSelect">
            <el-button class="mobile-menu-btn" text>
              <el-icon :size="24"><MenuIcon /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- 动态渲染中间菜单项 -->
                <el-dropdown-item
                  v-for="menu in navMenus"
                  :key="menu.path"
                  :command="menu.path"
                  :style="isMenuActive(menu) ? 'color: var(--el-color-primary); background-color: var(--el-color-primary-light-9)' : ''"
                >
                  {{ getMenuName(menu) }}
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="actionMenus.adminMenu"
                  divided
                  :command="actionMenus.adminMenu.path"
                >
                  {{ getMenuName(actionMenus.adminMenu) }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 桌面端中间导航菜单 -->
        <div class="nav-menu desktop-nav">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-home"
            mode="horizontal"
            :ellipsis="false"
            @select="handleSelect"
          >
            <!-- 动态渲染中间菜单项 -->
            <el-menu-item 
              v-for="menu in navMenus" 
              :key="menu.path" 
              :index="menu.path"
            >
              {{ getMenuName(menu) }}
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 右侧操作 -->
        <div class="actions desktop-nav">
          <el-switch
            v-model="dataTheme"
            inline-prompt
            :active-icon="dayIcon"
            :inactive-icon="darkIcon"
            @change="dataThemeChange"
            class="theme-switch"
          />
          <el-button
            v-if="actionMenus.adminMenu"
            type="primary"
            @click="handleSelect(actionMenus.adminMenu.path)"
          >
            {{ getMenuName(actionMenus.adminMenu) }}
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="el-fade-in" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>Copyright © 2026 NetworkAuth. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.front-home-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  @supports (min-height: 100dvh) {
    min-height: 100dvh;
  }
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  background-color: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  transition: background-color 0.3s, color 0.3s;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--el-bg-color-overlay);
  backdrop-filter: blur(10px);
  box-shadow: var(--el-box-shadow-light);
  transition: background-color 0.3s, box-shadow 0.3s;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}

.logo {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 200px;
}

.logo-img {
  width: auto;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  transition: color 0.3s;
}

.mobile-nav {
  display: none;
}

.theme-switch {
  margin-right: 15px;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  margin-left: 20px;

  :deep(.el-menu-home) {
    background-color: transparent;
    border-bottom: none;

    .el-menu-item {
      height: 64px;
      line-height: 64px;
      font-size: 15px;
      font-weight: 500;
      color: var(--el-text-color-regular);
      border-bottom: 2px solid transparent;

      &:hover {
        color: var(--el-color-primary);
        background-color: transparent;
      }

      &.is-active {
        color: var(--el-color-primary);
        border-bottom-color: var(--el-color-primary);
        background-color: transparent !important;
      }
    }
  }
}

.actions {
  min-width: 200px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  &::before,
  &::after {
    content: "";
    flex: 1;
  }

  > * {
    flex-shrink: 0;
  }
}

.footer {
  padding: 20px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  text-align: center;
  transition: color 0.3s;

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .record-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 4px;
    flex-wrap: wrap;

    .record-link {
      color: var(--el-text-color-secondary);
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .divider {
      color: var(--el-border-color);
      font-size: 12px;
      transition: color 0.3s;
    }
  }
}

@media screen and (max-width: 768px) {
  .header-content {
    padding: 0 10px;
  }

  .logo {
    min-width: auto;
  }

  .logo-text {
    display: inline-block;
    font-size: 18px;
  }

  .desktop-nav {
    display: none !important;
  }

  .mobile-nav {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    margin-left: 10px;

    .mobile-menu-btn {
      padding: 8px;
    }
  }

  .actions {
    min-width: auto;

    .el-button {
      padding: 8px 10px;
      font-size: 13px;
    }
  }
}
</style>
