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
            <el-table :data="tableInfoList" stripe border v-loading="loading" style="width: 100%"
              highlight-current-row @current-change="selectCurrentRow">
                <el-table-column type="selection" />
                <el-table-column prop="tableSchema" label="模式" />
                <el-table-column prop="tableName" label="表名" />
                <el-table-column prop="tableType" label="表类型" />
                <el-table-column prop="engine" label="引擎" />
                <el-table-column prop="version" label="版本" />
                <el-table-column prop="tableRows" label="数据量" />
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column prop="updateTime" label="更新时间" />
            </el-table>
            <el-pagination background
              @current-change="pageChange"
              layout="prev, pager, next, total"
              :total="total" />
        </div>

        <div>
            <el-dialog :title="title" :visible.sync="showModalVisible" width="50%">
                <el-form :model="tableInfo" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="tableSchema" label="模式">
                                <el-input type="text" v-model="tableInfo.tableSchema" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="tableName" label="表名">
                                <el-input type="text" v-model="tableInfo.tableName" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="tableType" label="表类型">
                                <el-input type="text" v-model="tableInfo.tableType" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="engine" label="引擎">
                                <el-input type="text" v-model="tableInfo.engine" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="version" label="版本">
                                <el-input type="text" v-model="tableInfo.version" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="tableRows" label="数据量">
                                <el-input type="text" v-model="tableInfo.tableRows" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="createTime" label="创建时间">
                                <el-input type="text" v-model="tableInfo.createTime" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="updateTime" label="更新时间">
                                <el-input type="text" v-model="tableInfo.updateTime" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>

        <div>
            <el-dialog :title="title" :visible.sync="generatorModalVisible" width="50%">
                <el-form :model="generatorInfo" ref="generatorInfo" :rules="rules" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="schema" label="模式">
                                <el-input type="text" v-model="generatorInfo.schema" placeholder="请输入模式"
                                  prefix-icon="el-icon-edit" style="width: 80%" readonly />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="table" label="表">
                                <el-input type="text" v-model="generatorInfo.table" placeholder="请输入表"
                                  prefix-icon="el-icon-edit" style="width: 80%" readonly />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="comment" label="表名">
                                <el-input type="text" v-model="generatorInfo.comment" placeholder="请输入表名"
                                  prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="author" label="作者">
                                <el-input type="text" v-model="generatorInfo.author" placeholder="请输入作者"
                                  prefix-icon="el-icon-edit" style="width: 80%" readonly />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="packageName" label="包名">
                                <el-input type="text" v-model="generatorInfo.packageName" placeholder="请输入包名"
                                  prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="entityName" label="实体名">
                                <el-input type="text" v-model="generatorInfo.entityName" placeholder="请输入实体名"
                                  prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="outputType" label="类型">
                                <el-radio-group v-model="generatorInfo.outputType" @change="handleRadioChange">
                                    <el-radio label="java">Java模板</el-radio>
                                    <el-radio label="vue">Vue模板</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="outputPath" label="输出路径">
                                <el-select v-model="generatorInfo.outputPath" placeholder="请选择" style="width: 80%" >
                                    <el-option :value="outputPathValue" style="height: auto">
                                        <el-tree
                                          :data="codePath"
                                          :props="{label: 'code', children: 'children'}"
                                          @node-click="handleNodeClick"
                                        />
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="generatorModalVisible = false">取消</el-button>
                    <el-button type="primary" @click="generatorCode">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TableInfo',
        data() {
            return {
                loading: false,
                page: 0,
                size: 10,
                total: 0,
                btnList: [],
                tableInfoList: [],
                codePath: [],
                javaCodePath: [],
                vueCodePath: [],
                outputPathValue: null,
                title: '',
                showModalVisible: false,
                generatorModalVisible: false,
                tableInfo: {
                    tableSchema: '',
                    tableName: '',
                    tableType: '',
                    engine: '',
                    version: '',
                    tableRows: '',
                    createTime: '',
                    updateTime: ''
                },
                generatorInfo: {
                    schema: '',
                    table: '',
                    comment: '',
                    author: '',
                    packageName: '',
                    entityName: '',
                    outputType: '',
                    outputPath: ''
                },
                rules: {
                    schema: [{required: true, message: '请输入模式', trigger: 'blur'}],
                    table: [{required: true, message: '请输入表', trigger: 'blur'}],
                    comment: [{required: true, message: '请输入表名', trigger: 'blur'}],
                    author: [{required: true, message: '请输入作者', trigger: 'blur'}],
                    packageName: [{required: true, message: '请输入包名', trigger: 'blur'}],
                    entityName: [{required: true, message: '请输入实体名', trigger: 'blur'}],
                    outputType: [{required: true, message: '请输入类型', trigger: 'blur'}],
                    outputPath: [{required: true, message: '请输入输出路径', trigger: 'blur'}]
                }
            }
        },
        mounted() {
            this.initBtn()
            this.initTableInfo()
            this.initCodePath()
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
                this.initTableInfo();
            },
            initBtn() {
                let menuId = this.$store.state.menuId
                this.getRequest('/system/authority/getBtns?menuId=' + menuId).then(resp => {
                    if (resp && resp.success) {
                        this.btnList = resp.data
                    }
                })
            },
            initTableInfo() {
                this.loading = true
                let url = '/generator/tableInfo/getTableInfoPage?page=' + this.page + '&size=' + this.size
                this.getRequest(url).then(resp => {
                    this.loading = false
                    if(resp && resp.success) {
                        this.tableInfoList = resp.data.content
                        this.total = resp.data.total
                    }
                })
            },
            initCodePath() {
                this.getRequest('/system/dictionary/getCodePath').then(resp => {
                    if (resp && resp.success) {
                        this.javaCodePath = resp.data.javaCodePath
                        this.vueCodePath = resp.data.vueCodePath
                        this.codePath = this.javaCodePath
                    }
                })
            },
            handleRadioChange(val) {
                this.generatorInfo.outputPath = null
                this.codePath = []
                switch(val) {
                    case 'java':
                        this.codePath = this.javaCodePath
                        break
                    case 'vue':
                        this.codePath = this.vueCodePath
                        break
                    default:
                        break
                }
            },
            handleNodeClick(data, node) {
                this.outputPathValue = ''
                this.getParentNode(node)
                this.generatorInfo.outputPath = this.outputPathValue
            },
            getParentNode(node) {
                if (node && node.level != 0) {
                    if (node.parent) {
                        this.getParentNode(node.parent)
                    }
                    this.outputPathValue += node.data.code
                }
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
                this.title = '查看表信息'
                this.tableInfo = this.currentRow
                this.showModalVisible = true
            },
            generator() {
                if (this.currentRow == null) {
                    this.$message({
                        message: '请选择一项',
                        type: 'warning'
                    })
                    return
                }
                this.title = '代码生成'
                this.generatorInfo = {
                    schema: this.currentRow.tableSchema,
                    table: this.currentRow.tableName,
                    comment: 'xxxx',
                    author: 'strr',
                    packageName: 'com.strr.mall.xxxx',
                    entityName: '',
                    outputType: 'java',
                    outputPath: ''
                }
                this.generatorModalVisible = true
            },
            generatorCode() {
                this.$refs.generatorInfo.validate(valid => {
                    if (valid) {
                        let form = this.generatorInfo
                        this.postRequest('/generator/generatorInfo/generatorCode', form).then(resp => {
                            if (resp && resp.success) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                                this.generatorModalVisible = false
                            }
                        })
                    }
                })
            }
        }
    }
</script>
