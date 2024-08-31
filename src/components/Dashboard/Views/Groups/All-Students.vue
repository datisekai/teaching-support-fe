<template>
    <div class="row">
        <div class="card">
            <div class="card-body">
                <!-- <div class="row">
              <div class="col-lg-9 col-md-6 col-sm-6 col-6">
                <my-filter
                  :rules="rules"
                  v-on:filter-change="updateFilter"
                ></my-filter>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                <column-toggle
                  v-model="columnDefs"
                  @input="cols => this.$refs['table'].updateColumns(cols)"
                ></column-toggle>
              </div>
            </div> -->
                <div class="col-sm-12 p-0">
                    <my-table ref="table" :columnDefs="columnDefs" v-bind:data-rows="students" :actions="actions"
                        :actionsTable="actionsTable" />
                </div>
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
    Divider
} from "element-ui";
import MyMoney from "src/components/UIComponents/Money";
import MySelect from "src/components/UIComponents/Select";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import dtHelper from "src/helpers/datatable";
import studentSchemas from "./student-schemas";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import api from "src/api/index";

export default {
    components: {
        MyTable,
        MyMoney,
        MySelect,
        MyFilter,
        ColumnToggle,
        ElForm: Form,
        ElInput: Input,
        ElDialog: Dialog,
        ElButton: Button,
        ElDivider: Divider,
        ElFormItem: FormItem
    },
    computed: {
        students() {
            const rows = this.$store.state.groupStudents.members.map(c => ({
                ...c,
                phone: c.phone || "Chưa có",
                created_at: c.created_at,
                id: c.id
            }));

            return dtHelper.filterByRules(rows, this.filterOutput);
        },
        models() {
            return this.$store.state.models.map(m => {
                return {
                    value: m.id,
                    title: m.title
                };
            });
        }
    },
    data() {
        const initFiledArrays = ["id", "code", "name", "email", "phone", "created_at"];
        const columnDefs = dtHelper.buildInitFields(studentSchemas, initFiledArrays).filter(column =>
            initFiledArrays.includes(column.prop)
        );
        return {
            filterOutput: [],
            columnDefs,
            actions: [],
            filter: {},
            rules: dtHelper.buildRules(studentSchemas),
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
                code: "",
                result: null
            }
        };
    },
    mounted() {
        this.$store.dispatch("fetchGroupStudents", this.$route.params.id);
        this.$store.dispatch("setPageTitle", "groupStudents");
        this.$store.dispatch("setCurrentActions", [
            {
                label: "exportExcel",
                type: "default",
                icon: "",
                callback: this.exportExcel,
            }, {
                label: "importExcel",
                type: "file",
                icon: "",
                callbackSelected: this.importExcel
            }
        ]);
    },
    methods: {
        async importExcel(file) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file);

            const worksheet = workbook.getWorksheet(1);
            const data = [];

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const rowData = {
                        id: row.getCell(1).value,
                        code: row.getCell(2).value,
                        name: row.getCell(3).value,
                        email: row.getCell(4).value,
                        phone: row.getCell(5).value,
                    };
                    data.push(rowData);
                }

            });

            const payload = { students: data }

            api
                .post("/api.group/import/" + this.$route.params.id, payload)
                .then(resp => {
                    this.$store.dispatch("fetchGroupStudents", this.$route.params.id);
                })
                .catch(e => {
                    console.log(e)
                });
        },
        exportExcel() {
            const data = this.$store.state.groupStudents;
            if (Array.isArray(data.members) && data.members.length > 0) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Sheet1');

                worksheet.columns = [
                    { header: 'ID', key: 'id', width: 10 },
                    { header: 'MSSV', key: 'code', width: 30 },
                    { header: 'Họ tên', key: 'name', width: 30 },
                    { header: 'Email', key: 'email', width: 30 },
                    { header: 'Số điện thoại', key: 'phone', width: 30 },
                ];


                data.members.forEach(item => {
                    worksheet.addRow(item);
                });
                const nameFile = `${data.name}_${data.course.code}_${data.course.name}_${Date.now()}.csv`

                workbook.xlsx.writeBuffer().then(buffer => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameFile);
                });
            } else {
                Message({
                    message: "Danh sách lớp không có",
                    type: "error"
                });
            }

        },
        back() {
            this.$router.push({ name: "AllGroups" });
        },
        updateFilter(filterOutput) {
            this.filterOutput = filterOutput;
        }
    },
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
</style>