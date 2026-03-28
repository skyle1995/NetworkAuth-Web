<script setup lang="ts">
import { useRouter } from "vue-router";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { computed } from "vue";
import { storageLocal } from "@pureadmin/utils";
import { type DataInfo, userKey } from "@/utils/auth";
import { getConfig } from "@/config";

defineOptions({
  name: "Index"
});

const router = useRouter();

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
</script>

<template>
  <div class="front-home">
    <!-- 导航栏 -->
    <header class="header">
      <div class="logo">
        <img
          v-if="getConfig()?.Logo"
          :src="getConfig()?.Logo"
          alt="logo"
          class="logo-img"
        />
        <span class="logo-text">{{ getConfig()?.Title || "加载中..." }}</span>
      </div>
      <div class="actions">
        <el-button type="primary" @click="goAdmin">
          {{ isLogged ? "进入控制台" : "管理员登录" }}
        </el-button>
      </div>
    </header>

    <!-- 正常主体内容 -->
    <main class="main-content">
      <div class="hero">
        <h1 class="title">欢迎使用 {{ getConfig()?.Title || "加载中..." }}</h1>
        <p class="subtitle">
          {{
            getConfig()?.Description ||
            "这是一个高性能、响应式的企业级后台管理系统，提供稳定、安全的服务架构。"
          }}
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="goAdmin">
            {{ isLogged ? "进入控制台" : "管理员登录" }}
          </el-button>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p>
        Copyright © {{ new Date().getFullYear() }}
        {{ getConfig()?.Title || "加载中..." }}. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.front-home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  background-color: #f5f7fa;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 40px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);
}

.logo {
  display: flex;
  gap: 10px;
  align-items: center;
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

.main-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.hero {
  max-width: 800px;
  text-align: center;
}

.title {
  margin-bottom: 24px;
  font-size: 48px;
  font-weight: 700;
  color: #303133;
}

.subtitle {
  margin-bottom: 40px;
  font-size: 20px;
  line-height: 1.6;
  color: #606266;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.footer {
  padding: 24px 0;
  font-size: 14px;
  color: #909399;
  text-align: center;
}
</style>
