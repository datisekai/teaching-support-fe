<template>
    <div class="row">
        <div class="card">
            <div class="card-body">
                <el-tabs v-model="rooms[0].id" @tab-click="handleClick">
                    <el-tab-pane v-for="(room, index) in rooms" :key="index" :name="room.id">
                        <template v-slot:label>
                            <div class="tab-label">
                                <div class="tab-title">{{ room.title }}</div>
                                <div class="tab-date">{{ formatDate(room.created_at) }}</div>
                            </div>
                        </template>
                        <div style="padding: 16px 0;">
                            <el-row :gutter="20">
                                <el-col :span="6">
                                    <div>
                                        <el-statistic title="Sinh viên điểm danh">
                                            <template slot="formatter">
                                                {{ statistic.checkedInCount }}
                                            </template>
                                        </el-statistic>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div>
                                        <el-statistic title="Sinh viên chưa điểm danh">
                                            <template slot="formatter">
                                                {{ statistic.notCheckedInCount }}
                                            </template>
                                        </el-statistic>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div>
                                        <el-statistic title="Tỉ lệ sinh viên đi học">
                                            <template slot="formatter">
                                                {{ statistic.attendanceRate }}
                                            </template>
                                        </el-statistic>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div>
                                        <el-statistic title="Tỉ lệ sinh viên nghỉ học">
                                            <template slot="formatter">
                                                {{ statistic.absenceRate }}
                                            </template>
                                        </el-statistic>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="col-sm-12 p-0">
                            <my-table ref="table" :columnDefs="columnDefs" v-bind:data-rows="students"
                                :actions="actions" :actionsTable="actionsTable" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

        <div class="container-fluid">
            <div class="page-action">
                <el-button @click="back">Quay lại</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
    MessageBox,
    Notification,
    Dialog,
    Form,
    FormItem,
    Input,
    Button,
    Divider,
    Tabs,
    TabPane,
    Row,
    Col,
    Statistic,
} from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import dtHelper from 'src/helpers/datatable';
import studentSchemas from './student-schemas';
import util from '../../../../helpers/util'

export default {
    components: {
        MyTable,
        ElForm: Form,
        ElInput: Input,
        ElDialog: Dialog,
        ElButton: Button,
        ElDivider: Divider,
        ElFormItem: FormItem,
        ElTabs: Tabs,
        ElTabPane: TabPane,
        ElRow: Row,
        ElCol: Col,
        ElStatistic: Statistic
    },
    computed: {
        statistic() {
            const data = this.$store.state.groupStatistic
            return data;
        },

        rooms() {
            const data = this.$store.state.roomsGroup.map(room => {
                return {
                    ...room,
                    id: String(room.id)
                };
            });

            return data;
        },
        students() {
            const rows = this.$store.state.groupStatistic.listUser.map(c => ({
                ...c.student,
                phone: c.student.phone || 'Chưa có',
                created_at: c.student.created_at,
                id: c.student.id,
                type: c.success ? "success" : "danger",
                success: c.success ? "Thành công" : "Thất bại",
            }));

            return dtHelper.filterByRules(rows, this.filterOutput);
        }
    },
    data() {
        const initFiledArrays = ['id', 'code', 'name', 'email', 'phone', 'success', 'created_at'];
        const columnDefs = dtHelper.buildInitFields(studentSchemas, initFiledArrays).filter(column =>
            initFiledArrays.includes(column.prop)
        );
        return {
            filterOutput: [],
            columnDefs,
            actions: [],
            actionsTable: [],
            dialog: {
                formCreateVisible: false,
                formValidateVisible: false
            },
            formCreateWarrantyCode: {
                modelId: null,
                amount: 1
            },
            formValidateWarrantyCode: {
                code: '',
                result: null
            },
        };
    },
    mounted() {
        this.$store.dispatch('fetchRoomByGroupId', this.$route.params.id)
        this.$store.dispatch('setPageTitle', 'groupStatistic');
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab._props.name, event);
            this.$store.dispatch('fetchGroupStatistic', +tab._props.name);
        },
        back() {
            this.$router.push({ name: 'AllGroups' });
        },
        formatDate(value) {

            return util.formatDateTime(value);
        }
    }
};
</script>

<style lang="scss">
.el-table .td-actions {
    button.btn {
        margin-right: 5px;
    }
}

.el-dialog__body {
    padding: 10px 20px !important;
}

.el-form {
    .el-form-item {
        margin-bottom: 10px !important;

        .el-form-item__label {
            margin-bottom: 0px !important;
        }

        p {
            margin-bottom: 0px !important;
        }
    }

    .el-divider--horizontal {
        margin-bottom: 12px !important;
    }
}

.tab-label {
    text-align: center;
}

.tab-title {
    line-height: normal;
    font-weight: bold;
    padding-bottom: 4px;
}

.tab-date {
    line-height: normal;
    font-size: small;
}
</style>