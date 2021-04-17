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

        <div style="margin-top: 10px">
            <el-table :data="dictionaryList" stripe border v-loading="loading" style="width: 100%"
              row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              highlight-current-row @current-change="selectCurrentRow">
                <el-table-column type="selection" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="code" label="代码" />
                <el-table-column prop="seq" label="排序" />
                <el-table-column prop="parentId" label="父字典" />
                <el-table-column prop="remark" label="备注" />
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" />
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div>
            <el-dialog :title="title" :visible.sync="showModalVisible" width="50%">
                <el-form :model="dictionary" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="name" label="名称">
                                <el-input type="text" v-model="dictionary.name" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="code" label="代码">
                                <el-input type="text" v-model="dictionary.code" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="seq" label="排序">
                                <el-input type="text" v-model="dictionary.seq" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="parentId" label="父字典">
                                <el-input type="text" v-model="dictionary.parentId" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="remark" label="备注">
                                <el-input type="text" v-model="dictionary.remark" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="status" label="状态">
                                <el-input type="text" v-model="dictionary.status" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>

        <div>
            <el-dialog :title="title" :visible.sync="editModalVisible" width="50%">
                <el-form :model="dictionary" ref="dictionary" :rules="rules" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="name" label="名称">
                                <el-input type="text" v-model="dictionary.name" placeholder="请输入名称"
                                  prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="code" label="代码">
                                <el-input type="text" v-model="dictionary.code" placeholder="请输入代码"
                                  prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="seq" label="排序">
                                <el-input type="text" v-model="dictionary.seq" placeholder="请输入排序"
                                  prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="parentId" label="父字典">
                                <el-input type="text" v-model="dictionary.parentId" placeholder="请输入父字典"
                                  prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="remark" label="备注">
                                <el-input type="text" v-model="dictionary.remark" placeholder="请输入备注"
                                  prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="status" label="状态">
                                <el-input type="text" v-model="dictionary.status" placeholder="请输入状态"
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
        name: 'Dictionary',
        data() {
            return {
                loading: false,
                btnList: [],
                dictionaryList: [],
                title: '',
                showModalVisible: false,
                editModalVisible: false,
                dictionary: {
                    id: '',
                    name: '',
                    code: '',
                    seq: '',
                    parentId: '',
                    remark: '',
                    status: '',
                },
                rules: {
                    name: null,
                    code: null,
                    seq: [{required: true, message: '请输入排序', trigger: 'blur'}],
                    parentId: [{required: true, message: '请输入父字典', trigger: 'blur'}],
                    remark: null,
                    status: [{required: true, message: '请输入状态', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.initBtn()
            this.initDictionary()
        },
        methods: {
            handler(func) {
                this[func]()
            },
            selectCurrentRow(val) {
                this.currentRow = val
            },
            pageChange(page) {
                this.page = page - 1
                this.initDictionary();
            },
            initBtn() {
                let menuId = this.$store.state.menuId
                this.getRequest('/system/authority/getBtns?menuId=' + menuId).then(resp => {
                    if (resp && resp.success) {
                        this.btnList = resp.data
                    }
                })
            },
            initDictionary() {
                this.loading = true
                this.getRequest('/system/dictionary/list').then(resp => {
                    this.loading = false
                    if(resp && resp.success) {
                        this.dictionaryList = resp.data
                        this.currentRow = null
                    }
                })
            },
            empty() {
                this.dictionary = {
                    id: '',
                    name: '',
                    code: '',
                    seq: '',
                    parentId: '',
                    remark: '',
                    status: '',
                }
            },
            save() {
                this.$refs.dictionary.validate(valid => {
                    if(valid) {
                        let form = this.dictionary
                        delete form.children
                        this.postRequest('/system/dictionary/save', form).then(resp => {
                            if(resp && resp.success) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            })
                            this.editModalVisible = false
                            this.initDictionary()
                        }
                    })
                    }
                })
            },
            //查看
            show() {
                if (this.currentRow == null) {
                    this.$message({
                        message: '请选择一项',
                        type: 'warning'
                    })
                    return
                }
                this.title = '查看字典信息'
                this.dictionary = this.currentRow
                this.showModalVisible = true
            },
            //添加
            add() {
                this.title = '添加字典信息'
                this.empty()
                this.editModalVisible = true
            },
            //修改
            edit() {
                if (this.currentRow == null) {
                    this.$message({
                        message: '请选择一项',
                        type: 'warning'
                    })
                    return
                }
                this.title = '修改字典信息'
                this.dictionary = this.currentRow
                this.editModalVisible = true
            },
            //删除
            del() {
                if (this.currentRow == null) {
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
                    this.deleteRequest('/system/dictionary/delete?id=' + this.currentRow.id).then((resp) => {
                        if (resp) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.initDictionary()
                        }
                    })
                }).catch(() => {
                        this.$message({
                        message: '已取消',
                        type: 'info'
                    })
                })
            }
        }
    }
</script>
