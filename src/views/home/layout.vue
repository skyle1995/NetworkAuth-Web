<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storageLocal } from "@pureadmin/utils";
import { type DataInfo, userKey } from "@/utils/auth";
import { getConfig } from "@/config";
import MenuIcon from "~icons/ri/menu-line";

defineOptions({
  name: "HomeLayout"
});

const router = useRouter();
const route = useRoute();

// 当前激活的菜单项
const activeMenu = ref(route.path);

// 监听路由变化更新菜单高亮
watch(
  () => route.path,
  newPath => {
    activeMenu.value = newPath;
  }
);

// 检查是否已登录
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
  if (key === "admin") {
    goAdmin();
  } else {
    router.push(key);
  }
};
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
          <el-dropdown trigger="click" @command="handleSelect">
            <el-button class="mobile-menu-btn" text>
              <el-icon :size="24"><MenuIcon /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  command="/home/index"
                  :style="
                    activeMenu === '/home/index' || activeMenu === '/home'
                      ? 'color: var(--el-color-primary); background-color: var(--el-color-primary-light-9)'
                      : ''
                  "
                  >首页</el-dropdown-item
                >
                <el-dropdown-item divided command="admin">
                  {{ isLogged ? "进入控制台" : "管理员登录" }}
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
            <el-menu-item index="/home/index">首页</el-menu-item>
          </el-menu>
        </div>

        <!-- 右侧操作 -->
        <div class="actions desktop-nav">
          <el-button type="primary" @click="goAdmin">
            {{ isLogged ? "进入控制台" : "管理员登录" }}
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
  background-color: #f5f7fa;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

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
  color: #303133;
}

.mobile-nav {
  display: none;
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
      color: #606266;
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
  color: #909399;
  font-size: 14px;
  text-align: center;

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
      color: #909399;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .divider {
      color: #dcdfe6;
      font-size: 12px;
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
