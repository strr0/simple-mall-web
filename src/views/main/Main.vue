<template>
    <el-container>
        <el-aside>
            <el-menu class="el-menu-vertical-demo" @select="handleSelect" router>
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
            let mainId = this.$store.state.mainId
            let routes = this.$store.state.routes
            if (mainId < routes.length) {
                return routes[mainId].children
            }
            return []
        }
    },
    methods: {
        handleSelect(key) {
            this.$store.commit('selectMenu', key)
        }
    },
    components: {
        TreeMenu
    }
}
</script>