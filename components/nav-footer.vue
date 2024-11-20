<template>
  <div class="nav-footer">
    <p>&copy; {{ new Date().getFullYear() }} Tech Blog. All rights reserved.</p>
  </div>
</template>

<style scoped>
.nav-footer {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
}
</style>
