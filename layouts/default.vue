<template>
  <div class="layout-container">
    <el-container>
      <el-header height="60px">
        <nav-header />
      </el-header>
      
      <el-container>
        <el-main>
          <slot />
        </el-main>
      </el-container>

      <el-footer height="60px">
        <nav-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.el-header {
  border-bottom: 1px solid var(--el-border-color-light);
}

.el-footer {
  border-top: 1px solid var(--el-border-color-light);
}
</style>
