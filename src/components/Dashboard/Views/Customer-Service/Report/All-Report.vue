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
          <img src="static/img/help.png" alt="">
          <div class="report-detail">
            <div>{{reportData.ticket.total}}</div>
            <div>số lượng câu hỏi</div>
            <div>{{Math.round(reportData.ticket.count / (60 * reportData.ticket.total)) || 0}} phút</div>
            <div>thời gian phản hồi trung bình</div>
          </div>
        </div>
        <div class="report-item">
          <img src="static/img/survey.png" alt="">
          <div class="report-detail">
            <div>{{reportData.survey.total}}</div>
            <div>số lượng khảo sát</div>
            <div>{{reportData.survey.count}}</div>
            <div>lượt khảo sát</div>
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
    </div>
  </div>
</template>
<script>
import { MessageBox, Message, Table, TableColumn, DatePicker, Select, Option, Loading} from 'element-ui';
import Vue from 'vue'
Vue.use(Loading.directive)
export default {
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElDatePicker: DatePicker,
    ElSelect: Select,
    ElOption: Option
  },
  computed: {
    reportData() {
      return this.$store.state.report.customer_service
    },
    reportRecords() {
      return this.reportData[this.filterType].reportRecords
    }
  },
  data() {
    return {
      loading: true,
      filterType: 'ticket',
      filterTime: [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date().getTime()],
      typeOptions: [
        {
          label: 'Câu hỏi',
          value: 'ticket'
        },
        {
          label: 'Khảo sát',
          value: 'survey'
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
          department: 'customer_service',
          createdFrom: this.filterTime[0],
          createdTo: this.filterTime[1]
        })
        this.loading = false
      }
    }
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Thống kê chăm sóc khách hàng');
    this.$store.dispatch('setCurrentActions', []);
  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
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
