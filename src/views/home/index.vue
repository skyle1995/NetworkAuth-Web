<script setup lang="ts">
import { getConfig } from "@/config";

defineOptions({
  name: "Index"
});
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

</style>
