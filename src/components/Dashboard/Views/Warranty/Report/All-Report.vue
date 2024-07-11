<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body">
        <el-date-picker
          v-model="filterTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
    </div>
    <div class="col-md-12 card p-0">
      <div class="card-body d-flex" v-loading="loading">
        <div class="report-item">
          <img src="static/img/article.png" alt="">
          <div class="report-detail">
            <div>{{ reportData.article.total }}</div>
            <div>số lượng bài viết</div>
            <div>{{ reportData.article.count }}</div>
            <div>lượt xem</div>
          </div>
        </div>
        <div class="report-item">
          <img src="static/img/calculator.png" alt="">
          <div class="report-detail">
            <div>{{ reportData.code_created.count }}</div>
            <div>số lượng mã tạo mới</div>
          </div>
        </div>
        <div class="report-item">
          <img src="static/img/calculator.png" alt="">
          <div class="report-detail">
            <div>{{reportData.code_activated.count}}</div>
            <div>số lượng mã kích hoạt</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 card p-0">
      <div class="card-body">
        <el-select v-model="filterType" placeholder="Select" class="mb-3">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <div v-if="filterType == 'code_activated'" class="row">
          <div class="col-lg-9 col-md-6 col-sm-6 col-6">
            <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-6">
            <column-toggle
              v-model="columnDefs"
              @input="cols => this.$refs['table'].updateColumns(cols)"
            ></column-toggle>
          </div>
        </div>
        
        <div v-if="(filterType == 'article') || (filterType == 'code_created')">
          <el-table
            :data="reportRecords"
            border
            style="width: 100%"
          >
            <el-table-column
              width="60px"
              label="STT">
              <template slot-scope="props">
                <span>{{props.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="Tiêu đề">
            </el-table-column>
            <el-table-column
              width="150px"
              label="Ngày tạo">
              <template slot-scope="props">
                <span>{{$util.formatDate(props.row.createdAt)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="count"
              label="Lượt"
              width="100px">
            </el-table-column>
            <el-table-column
              width="100px"
              label="Thao tác">
              <template slot-scope="props">
                <span></span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-else-if="filterType == 'code_activated'">
          <my-table
            ref="table"
            rowKey="id"
            :columnDefs="columnDefs"
            v-bind:data-rows="activatedData"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
        <el-dialog
          title="Xuất báo cáo thống kê bảo hành"
          :visible.sync="centerDialogVisible"
          width="25%"
          center>
          <el-select :disabled="exportLoading" v-model="formExport.reportType" placeholder="Chọn loại thông báo" :style="{width: '100%'}">
            <el-option
              v-for="option in reportTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value">
            </el-option>
          </el-select>
          <el-date-picker
            class="mt-3"
            :disabled="exportLoading"
            v-model="formExport.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            :style="{width: '100%'}">
          </el-date-picker>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="exportReport" :loading="exportLoading">Xuất báo cáo</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, DatePicker, Select, Option, Loading, Dialog, Button } from 'element-ui';
import dtHelper from 'src/helpers/datatable';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import activatedFoldableForm from './activated-foldable-form';
import MyTable from 'src/components/UIComponents/Table.vue';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import permissionSchemas from './permission-schemas';
import Vue from 'vue'
Vue.use(Loading.directive)


export default {
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElDatePicker: DatePicker,
    ElSelect: Select,
    ElOption: Option,
    ElDialog: Dialog,
    ElButton: Button,
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    reportData() {
      return this.$store.state.report.warranty
    },
    reportRecords() {
      const records = this.reportData[this.filterType].reportRecords
      return records;
    },
    activatedData() {
      const data = [];
      if(this.filterType == 'code_activated') {
        this.reportRecords.forEach(r => {
          if (r.meta) {
           r.meta.forEach(m => {
             data.push(m);
           })
          }
        })
        data.forEach(d => {
          const found = this.provinces.find(p => p.code === d.provinceCode);
          if (!found) return;
          d.provinceName = found.name;
        })
      }
      console.log('data', data);
      return dtHelper.filterByRules(data, this.filterOutput);
    },
    provinces() {
      return this.$store.state.provinces;
    },
  },
  data() {
    const initFiledArrays = ['name', 'createdAt', 'count', 'username', 'phone', 'email', 'provinceName', 'code', 'productModel', 'activatedDate', 'expiredDate'];
    const columnDefs = dtHelper.buildInitFields(activatedFoldableForm, initFiledArrays);
    const tableActions = [];
    return {
      reportTypeOptions: [
        {
          label: 'Báo cáo vận chuyển bảo hành',
          value: 'exportRegionalStats',
        },
        {
          label: 'Báo cáo thống kê APP',
          value: 'exportReport',
        },
        {
          label: 'Báo cáo kết quả sửa chữa các ngành',
          value: 'exportResultError',
        },
        {
          label: 'Báo cáo tình trạng hư hỏng theo ngành hàng',
          value: 'exportError',
        },
        {
          label: 'Báo cáo phiếu thu/công nợ',
          value: 'exportInvoice',
        },
        {
          label: 'Báo cáo chi tiết biên nhận',
          value: 'exportReceipt',
        }
      ],
      formExport: {
        reportType: null,
        dateRange: null,
      },
      centerDialogVisible: false,
      filterOutput: [],
      loading: true,
      exportLoading: false,
      actions: tableActions,
      actionsTable: [],
      rules: dtHelper.buildRules(activatedFoldableForm),
      filterType: 'article',
      columnDefs,
      filterTime: [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date().getTime()],
      typeOptions: [
        {
          label: 'Bài viết',
          value: 'article'
        },
        {
          label: 'Mã tạo mới',
          value: 'code_created'
        },
        {
          label: 'Mã kích hoạt',
          value: 'code_activated'
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '30 ngày trước',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  watch: {
    filterTime: {
      immediate: true,
      async handler() {
        this.loading = true
        await this.$store.dispatch('fetchReport', {
          department: 'warranty',
          createdFrom: this.filterTime[0],
          createdTo: this.filterTime[1]
        })
        this.loading = false
      }
    },
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Thống kê bảo hành');
    const currentActions = [];
    if(this.$util.checkPermissionAction(permissionSchemas, 'export')){
        currentActions.push({
          type: 'primary',
          icon: '',
          label: 'export',
          callback: this.openPopupExport,
      });
    };
    this.$store.dispatch('setCurrentActions', currentActions);
  },
  methods: {
    async exportReport() {
      this.exportLoading = true
      try {
        let payload = Object.assign({}, {
          from: this.formExport.dateRange[0].toString(),
          to: this.formExport.dateRange[1].toString(),
        });
        const { data } = await this.$store.dispatch(this.formExport.reportType, payload);
        window.open(data, '_blank');
        this.centerDialogVisible = false;
      } catch (e) {
        Notification ({
          title: 'Error',
          message: e.message,
          position: 'bottom-right',
          type: 'error',
        });
      }
      this.exportLoading = false
    },
    openPopupExport() {
      this.formExport.reportType = null;
      this.formExport.dateRange = null;
      this.centerDialogVisible = true;
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
  },
};
</script>
<style lang="scss" scoped>
  .update-col-def-btn {
    padding: 15px 15px 0px 10px !important;
  }
  .report-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 50px;
      height: 50px;
    }
    .report-detail {
      padding-left: 15px;
      >div {
        &:nth-child(1) {
          font-size: 20px;
          font-weight: 500;
          color: #0465AC
        }
        &:nth-child(2) {
          color: #0465AC;
          font-size: 13px;
        }
        &:nth-child(3) {
          font-size: 20px;
          font-weight: 500;
        }
        &:nth-child(4) {
          color: #666;
          font-size: 13px;
        }
      }
    }
  }
</style>
