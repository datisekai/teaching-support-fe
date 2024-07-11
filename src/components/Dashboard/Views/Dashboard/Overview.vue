<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-6" v-for="stats in statsCards" v-if="$util.checkVisitDashboard(stats.key)">
        <stats-card :type="stats.type"
                    :icon="stats.icon"
                    :small-title="stats.title"
                    :title="stats.value"
        >
          <div class="stats" slot="footer">
            <router-link :to="stats.detail">
              <i class="el-icon-arrow-right"></i>Xem chi tiết
            </router-link>
          </div>
        </stats-card>
      </div>
    </div>
    <!-- Charts -->
    <div class="row">
      <div class="col-lg-6 col-sm-6" v-if="$util.checkVisitDashboard('revenue_chart')">
        <chart-card :chart-data="dashboardOrder.data"
                    :chart-height="300"
                    :footer="false"
                    chart-type="Line"
                    class="card-hide-footer"
                    key="order"
        >
          <template slot="header">
            <h4 class="card-title">Doanh thu</h4>
          </template>
        </chart-card>
      </div>
      <div class="col-lg-6 col-sm-6" v-if="$util.checkVisitDashboard('visit_chart')">
        <chart-card :chart-data="dashboardVisit.data"
                    :chart-height="300"
                    :footer="false"
                    chart-type="Line"
                    class="card-hide-footer"
                    key="visit"
        >
          <template slot="header">
            <h4 class="card-title">Lượt truy cập</h4>
          </template>
        </chart-card>
      </div>
      <div class="col-md-6" v-if="$util.checkVisitDashboard('history_list')">
        <history-list class="dashboard-card footer-dashboard-card"></history-list>
      </div>
      <div class="col-md-6" v-if="$util.checkVisitDashboard('contact_list')">
        <contact-list class="dashboard-card footer-dashboard-card"></contact-list>
      </div>
    </div>
  </div>
</template>
<script>
import CircleChartCard from 'src/components/UIComponents/Cards/CircleChartCard.vue';
import ChartCard from 'src/components/UIComponents/Cards/ChartCard';
import StatsCard from 'src/components/UIComponents/Cards/StatsCard';
import { Badge } from 'src/components/UIComponents';
import { mapState } from 'vuex';
import HistoryList from './Widgets/HistoryList';
import ContactList from './Widgets/ContactList';

export default {
  components: {
    StatsCard,
    ChartCard,
    CircleChartCard,
    Badge,
    HistoryList,
    ContactList,
  },
  computed: mapState(['statsCards', 'dashboardOrder', 'dashboardVisit']),
  mounted() {
    this.$store.dispatch('setPageTitle', 'Bảng điều khiển');
    // this.$store.dispatch('fetchDashboardStatistic');
  },
};

</script>
<style>
  .dashboard-card .card-body{
    max-height: 500px;
    overflow-y: auto;
  }
</style>
