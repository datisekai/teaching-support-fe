<template>
  <card class="card-history">
    <template slot="header">
      <h4 class="card-title">Liên hệ gần nhất</h4>
    </template>
    <div class="table-full-width table-tasks">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Chưa trả lời" name="reply">
          <table class="table">
            <tbody>
              <contact-item v-for="(item, index) in dashboardContact.reply"
                            :key="item.id"
                            :item="item"
                            :index="index">
              </contact-item>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="Chưa xem" name="read">
          <table class="table">
            <tbody>
              <contact-item v-for="(item, index) in dashboardContact.read"
                            :key="item.id"
                            :item="item"
                            :index="index">
              </contact-item>
            </tbody>
          </table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template slot="footer">
      <div class="pull-right"><router-link to="/contact"><i class="el-icon-arrow-right"></i> Xem tất cả</router-link></div>
    </template>
  </card>
</template>
<script>
  import { Tabs, TabPane } from 'element-ui';
  import ContactItem from './ContactItem.vue'
  import { Card } from 'src/components/UIComponents'
  import { mapState } from 'vuex'

  export default {
    components: {
      ContactItem,
      Card,
      ElTabs: Tabs,
      ElTabPane: TabPane,
    },
    data(){
      return {
        activeName: 'reply',
        filterType: ''
      }
    },
    computed: mapState(['dashboardContact']),
    methods: {
    }
  }
</script>
<style>
  .card-history .card-title{
    float: left;
  }
  .card-history .el-tabs__header{
    position: absolute !important;
    right: 15px !important;
    top: 15px !important;
  }
</style>
