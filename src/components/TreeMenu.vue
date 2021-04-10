<template>
    <div>
        <el-submenu :key="item.id" :index="item.id+''" v-if="item.children && item.children.length > 0">
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item.name }}</span>
            </template>
            <tree-menu
              v-for="child in item.children"
              :key="child.id"
              :item="child"
              class="nest-menu"
            />
        </el-submenu>
        <el-menu-item :index="item.id+''" :route="{path: item.path}" v-else>
            <i class="el-icon-setting"></i>
            <span>{{ item.name }}</span>
        </el-menu-item>
    </div>
</template>

<script>
export default {
    name: 'TreeMenu',
    props: {
        item: {
            type: Object,
            default: () => {}
        }
    }
}
</script>