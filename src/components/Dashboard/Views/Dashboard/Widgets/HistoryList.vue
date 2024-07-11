<template>
  <card>
    <template slot="header">
      <h4 class="card-title">Lịch sử hoạt động</h4>
    </template>
    <div class="table-full-width table-tasks">
      <table class="table">
        <tbody>
        <history-item v-for="(item, index) in histories"
              :key="item.title"
              :item="item"
              :index="index">
        </history-item>
        </tbody>
      </table>
    </div>
    <template slot="footer">
      <div class="pull-right"><router-link to="/history"><i class="el-icon-arrow-right"></i> Xem tất cả</router-link></div>
    </template>
  </card>
</template>
<script>
  import HistoryItem from './HistoryItem.vue'
  import { Card } from 'src/components/UIComponents'
  import { mapState } from 'vuex'

  export default {
    components: {
      HistoryItem,
      Card
    },
    computed: mapState(['histories']),
    methods: {
    }
  }
</script>
<style>
</style>
