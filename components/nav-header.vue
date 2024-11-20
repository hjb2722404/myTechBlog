<template>
  <div class="nav-header">
    <div class="logo">
      <NuxtLink to="/" class="logo-link">
        <h1>Tech Blog</h1>
      </NuxtLink>
    </div>

    <div class="nav-menu">
      <el-menu mode="horizontal" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/articles">技术文章</el-menu-item>
        <el-menu-item index="/demos">在线Demo</el-menu-item>
        <el-menu-item index="/about">关于我</el-menu-item>
      </el-menu>
    </div>

    <div class="nav-actions">
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        @change="toggleDark"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped>
.nav-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
