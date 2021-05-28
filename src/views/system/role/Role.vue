<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px">
            <div>
                <el-input prefix-icon="el-icon-search" style="width: 350px; margin-right: 10px" />
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <div>
                <el-button v-for="item in btnList" :key="item.id" :type="item.type" :icon="item.icon" @click="handler(item.func)">
                    {{ item.name }}
                </el-button>
            </div>
        </div>
        <!--  角色列表  -->
        <div style="margin-top: 10px">
            <el-collapse v-model="activeName" v-loading="loading" accordion @change="handleCurrentChange">
                <el-collapse-item
                    v-for="(role, index) in roleList"
                    :title="role.name"
                    :name="index"
                    :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                        </div>
                        <div>
                            <el-tree
                                show-checkbox
                                node-key="id"
                                ref="tree"
                                :key="index"
                                :default-checked-keys="newAids"
                                :data="data"
                                :props="{ label: 'name', children: 'children' }" />
                            <div style="display: flex;justify-content: flex-end">
                                <el-button @click="cancelUpdate">取消修改</el-button>
                                <el-button type="primary" @click="updateRel(role.id, index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
        <!--  添加/修改  -->
        <div>
            <el-dialog :title="title" :visible.sync="editModalVisible" width="60%">
                <el-form :model="role" ref="role" :rules="rules" label-position="left">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="name" label="角色名称">
                                <el-input v-model="role.name" placeholder="请输入角色名称"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="remark" label="角色描述">
                                <el-input v-model="role.remark" placeholder="请输入角色描述"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editModalVisible = false">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RoleView',
    data() {
        return {
            //角色列表
            loading: false,
            btnList: [],
            roleList: [],
            authorityList: [],
            activeName: -1,
            //添加修改角色
            title: '',
            editModalVisible: false,
            role: {
                name: '',
                remark: '',
                status: false
            },
            data: [],
            oldAids: [],
            newAids: [],
            rules: {
                name: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                remark: [{required: true, message: '请输入角色描述', trigger: 'blur'}]
            }
        }
    },
    mounted() {
        this.initBtn()
        this.initRole()
        this.initAuthority()
    },
    methods: {
        handler(func) {
            this[func]()
        },
        handleCurrentChange(idx) {
            this.data = []
            if (typeof idx == 'number') {
                this.role = this.roleList[idx]
                this.getRequest('/system/role/listRelByRid?rid=' + this.role.id).then(resp => {
                    if (resp && resp.success) {
                        this.data = this.authorityList
                        this.newAids = resp.data
                        this.oldAids = resp.data
                    }
                })
            }
        },
        initBtn() {
            let menuId = this.$store.state.menuId
            this.getRequest('/system/authority/getBtns?menuId=' + menuId).then(resp => {
                if (resp && resp.success) {
                    this.btnList = resp.data
                }
            })
        },
        initRole() {
            this.loading = true
            let url = '/system/role/list'
            this.getRequest(url).then(resp => {
                this.loading = false
                if(resp && resp.success) {
                    this.roleList = resp.data
                }
            })
        },
        initAuthority() {
            this.getRequest('/system/authority/list')
            .then(resp => {
                if(resp && resp.success) {
                    this.authorityList = resp.data
                }
            })
        },
        empty() {
            this.role = {
                name: '',
                remark: '',
                status: false
            }
            this.newAids = []
            this.oldAids = []
        },
        save() {
            this.$refs.role.validate(valid => {
                if(valid) {
                    this.postRequest('/system/role/save', this.role).then(resp => {
                        if(resp && resp.success) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.editModalVisible = false
                            this.initRole()
                        }
                    })
                }
            })
        },
        //查看
        show() {
            if (this.activeName == -1) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.$message({
                message: '吐泡泡。。。',
                type: 'info'
            })
        },
        //添加
        add() {
            this.title = '添加角色信息'
            this.empty()
            this.editModalVisible = true
        },
        //修改
        edit() {
            if (this.activeName == -1) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.title = '修改角色信息'
            this.editModalVisible = true
        },
        //删除
        del() {
            if (this.activeName == -1) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.$confirm('此操作将永久删除此项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/role/delete?id=' + this.role.id).then((resp) => {
                    if (resp) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.initRole()
                    }
                })
            }).catch(() => {
                this.$message({
                    message: '已取消',
                    type: 'info'
                })
            })
        },
        //修改权限
        updateRel(rid, index) {
            let tree = this.$refs.tree[index]
            let halfChecked = tree.getHalfCheckedKeys()
            let checked = tree.getCheckedKeys()
            let form = {}
            form.rid = rid
            form.oldAids = this.oldAids
            form.newAids = halfChecked.concat(checked)
            this.postRequest('/system/role/updateRel', form).then(resp => {
                if(resp && resp.success) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.activeName = -1
                }
            })
        },
        //取消
        cancelUpdate() {
            this.activeName = -1
        }
    }
}
</script>