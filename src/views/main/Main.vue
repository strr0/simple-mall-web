<template>
    <el-container>
        <el-aside>
            <el-menu class="el-menu-vertical-demo" router>
                <tree-menu v-for="menu in menus" :key="menu.id" :item="menu" />
            </el-menu>
        </el-aside>
        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>

<script>
import TreeMenu from '../../components/TreeMenu'

export default {
    name: 'Main',
    computed: {
        menus() {
            let menuId = this.$store.state.menuId
            let routes = this.$store.state.routes
            if (menuId < routes.length) {
                return routes[menuId].children
            }
            return []
        }
    },
    components: {
        TreeMenu
    }
}
</script>