<script setup lang="ts">
import { useRouter } from "vue-router";
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
</template>

<style scoped lang="scss">
.hero {
  max-width: 800px;
  text-align: center;
}

.title {
  margin-bottom: 24px;
  font-size: 48px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  transition: color 0.3s;
}

.subtitle {
  margin-bottom: 40px;
  font-size: 20px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  transition: color 0.3s;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>