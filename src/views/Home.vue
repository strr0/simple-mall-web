<template>
  <el-container class="home_container">
    <el-header class="header_container">
      <div style="color: white">STRR</div>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
        router>
        <el-menu-item v-for="(menu, index) in this.routes" :index="index+''" :key="index" :route="{path: menu.path}">
          {{ menu.name }}
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="main_container">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    user() {
      return this.$store.state.user
    },
    routes() {
      return this.$store.state.routes
    }
  },
  methods: {
    handleSelect(key) {
      this.$store.commit('selectMain', key)
    }
  }
}
</script>

<style>
.header_container {
  background-color: #545c64;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.home_container {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
.main_container {
  background-color: #fff;
  color: #000;
  text-align: center;
  padding: 0;
}
</style>
