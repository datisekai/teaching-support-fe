<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="ticket-filter">
            <div class="tab-filter">
              <div @click="filterTickets(status.value)" v-for="(status) in filterStatuses" :key="status.value" class="tab-item" :class="{active: filterStatusValue === status.value}">
                {{status.title}}
              </div>
            </div>
            <!-- <div class="search-filter">
              <el-input size="medium" placeholder="Tìm kiếm" v-model="searchKey">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div> -->
          </div>
          <div class="ticket-wrapper">
            <div class="ticket-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="disabledLoadMore" v-loading="loading.ticketList">
              <div class="text-center" v-if="!tickets.length && !loading.ticketList">Không có câu hỏi nào</div>
              <div>
                <div class="ticket-item" :class="{active: ticket.id === selectedTicketId}" v-for="ticket in tickets" :key="ticket.id" @click="selectTicket(ticket)">
                  <div class='ticket-head'>
                    <div>{{ticket.creator.fullname}}</div>
                    <div>{{$util.formatDateTime(ticket.updatedAt)}}</div>
                  </div>
                  <div class="ticket-content">{{ticket.content}}</div>
                </div>
              </div>
              <div v-if="loading.infiniteScroll" class="text-center mt-3">Đang tải ...</div>
            </div>
            <div class="ticket-detail" v-loading="loading.ticketDetail">
              <div class="head" v-if="selectedTicketDetail && !loading.ticketDetail">
                <div>Câu hỏi #{{selectedTicketDetail.id}}
                  <span v-if="selectedTicketDetail.status === 'closed'">Đã đóng</span>
                </div>
                <div v-if="selectedTicketDetail.status !== 'closed'">
                  <el-button @click="closeTicket" size="medium">Đóng</el-button>
                </div>
              </div>
              <div class="chat-box">
                <div v-if="selectedTicketDetail && !loading.ticketDetail">
                  <div class="ticket-item" v-for="(ticket, index) in ticketMessages" :key="'ticket-message-' + index">
                    <div class='ticket-head'>
                      <div>{{ticket.creator && ticket.creator.fullname || 'Người dùng'}}</div>
                      <div>{{$util.formatDateTime(ticket.createdAt)}}</div>
                    </div>
                    <div class="ticket-content">{{ticket.content}}</div>
                  </div>
                </div>
              </div>
              <div class="reply-box" v-if="selectedTicketDetail && selectedTicketDetail.status !== 'closed'">
                <el-input :disabled="!selectedTicketDetail || loading.ticketDetail" v-model="replyContent" placeholder="Nhập nội dung trả lời" type="textarea" rows="3"></el-input>
                <el-button @click="reply" v-loading="loading.reply" :disabled="!selectedTicketDetail || loading.ticketDetail" class="btn-send" type="primary">GỬI</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message, Input, Button, Notification, Tag, Loading, InfiniteScroll } from 'element-ui';
import Vue from 'vue'
import jQuery from 'jquery';

Vue.use(Loading.directive)
Vue.use(InfiniteScroll)
export default {
  components: {
    ElInput: Input,
    ElButton: Button,
    ElTag: Tag
  },
  computed: {
    tickets() {
      return this.$store.state.tickets;
    },
    disabledLoadMore() {
      return this.loading.infiniteScroll || this.tickets.length >= this.$store.state.ticketTotal
    }
  },
  data() {
    return {
      searchKey: '',
      filterStatuses: [
        {
          title: 'Tất cả',
          value: 'all'
        },
        {
          title: 'Mới',
          value: 'new'
        },
        {
          title: 'Đã phản hồi',
          value: 'responded'
        },
        {
          title: 'Đóng',
          value: 'closed'
        }
      ],
      filterStatusValue: 'new',
      pagination: {
        page: 0,
        perpage: 20
      },
      replyContent: '',
      selectedTicketId: '',
      selectedTicketDetail: null,
      ticketMessages: [],
      loading: {
        ticketList: false,
        infiniteScroll: false,
        ticketDetail: false,
        reply: false
      }
    }
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Hỏi & đáp');
    this.$store.dispatch('setCurrentActions', [])
    this.filterTickets('new')
  },
  methods: {
    async filterTickets(status) {
      this.loading.ticketList = true
      this.$store.dispatch('clearTicket')
      this.filterStatusValue = status
      this.pagination.page = 0
      try {
        let query = {
          ...this.pagination
        }
        if (this.filterStatusValue !== 'all') {
          query['status'] = this.filterStatusValue
        }
        await this.$store.dispatch('fetchTickets', query)
      } catch(e) {

      }
      this.loading.ticketList = false
    },
    async loadMore() {
      this.loading.infiniteScroll = true
      this.pagination.page = this.pagination.page + 1
      try {
        let query = {
          ...this.pagination
        }
        if (this.filterStatusValue !== 'all') {
          query['status'] = this.filterStatusValue
        }
        await this.$store.dispatch('fetchTickets', query)
      } catch(e) {
        console.log(e)
      }
      this.loading.infiniteScroll = false
    },
    async selectTicket(ticket) {
      this.selectedTicketId = ticket.id
      this.loading.ticketDetail = true
      try {
        this.selectedTicketDetail = await this.$store.dispatch('fetchTicketDetail', this.selectedTicketId)
        this.ticketMessages = this.selectedTicketDetail.messages.sort((a, b) => new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1)
        this.ticketMessages.unshift(Object.assign({}, {
          content: this.selectedTicketDetail.content,
          user: {
            fullname: 'Lê Đình Linh'
          },
          createdAt: this.selectedTicketDetail.createdAt
        }))
        setTimeout(() => {
          jQuery('.chat-box').animate({ scrollTop: jQuery('.chat-box').prop("scrollHeight")}, 300);
        }, 0)
      } catch(e) {
        console.log(e)
      }
      this.loading.ticketDetail = false
    },
    async reply() {
      this.loading.reply = true
      try {
        const data = await this.$store.dispatch('replyTicket', {
          id: this.selectedTicketId,
          content: this.replyContent
        })
        this.replyContent = ''
        this.ticketMessages.push(Object.assign({}, data, {creator: {fullname: this.$store.state.user.fullname}}))
        setTimeout(() => {
          jQuery('.chat-box').animate({ scrollTop: jQuery('.chat-box').prop("scrollHeight")}, 300);
        }, 0)
      } catch(e) {
        Notification ({
          title: 'Error',
          message: e.message,
          position: 'bottom-right',
          type: 'error',
        });
      }
      this.loading.reply = false
    },
    async closeTicket() {
      MessageBox.confirm('Đóng câu hỏi này ?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(async () => {
        try {
          await this.$store.dispatch('closeTicket', {
            status: this.filterStatusValue,
            id: this.selectedTicketId
          })
          this.selectedTicketDetail.status = 'closed'
          Notification ({
            title: 'Success',
            message: 'Đã đóng câu hỏi',
            position: 'bottom-right',
            type: 'sucess',
          });
        } catch(e) {
          Notification ({
            title: 'Error',
            message: e.message,
            position: 'bottom-right',
            type: 'error',
          });
        }
      }).catch(() => {

      })
    }
  },
};
</script>
<style lang="scss" scoped>
  .ticket-filter {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background: #eee;
    border-radius: 3px;
    .tab-filter {
      display: flex;
      align-items: center;
      margin-right: 15px;
      .tab-item {
        padding: 5px 15px;
        cursor: pointer;
        font-weight: 500;
        color: #666;
        &.active, &:hover {
          color: #0EADB8
        }
      }
    }
  }
  .ticket-wrapper {
    display: flex;
    height: calc(100vh - 220px);
    margin-top: 10px;
  }
  .ticket-list {
    background: #eee;
    border-radius: 3px;
    padding: 10px;
    flex: 0 0 400px;
    overflow: auto;
    margin-right: 10px;
    .ticket-item {
      cursor: pointer;
      &.active, &:hover {
        background: rgba(14, 173, 184, 0.15);
      }
    }
  }
  .ticket-item {
    background: #fff;
    padding: 10px;
    border: 1px solid #dedede;
    border-bottom: 0;
    &:last-child {
      border-bottom: 1px solid #dedede;
    }
    .ticket-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 5px;
      div:first-child {
        font-weight: bold;
      }
      div:last-child {
        font-size: 12px;
      }
    }
    .ticket-content {
      font-size: 14px;
    }
    
  }
  .ticket-detail {
    flex: 1;
    border: 1px solid #dedede;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    .head {
      height: 57px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background: rgb(247, 247, 247);
      border-bottom: 1px solid #dedede;
      div:first-child {
        font-weight: bold;
        font-size: 16px;
        display: flex;
        align-items: center;
        span {
          font-size: 12px;
          display: inline-block;
          font-weight: normal;
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 0 5px;
          background: #fff;
          margin-left: 10px;
        }
      }
    }
    .chat-box {
      padding: 20px;
      flex: 1;
      overflow: auto;
      .ticket-item {
        margin-bottom: 10px;
        border: 1px solid #dedede;
        padding: 0;
        border-radius: 3px;
        overflow: hidden;
        .ticket-head {
          background: rgb(247, 247, 247);
          border-bottom: 1px solid #eee;
          padding: 10px;
        }
        .ticket-content {
          padding: 10px;
        }
      }
    }
    .reply-box {
      height: 150px;
      padding: 10px;
      border-top: 1px solid #ddd;
      .btn-send {
        margin-top: 10px;
        float: right;
      }
    }
  }

 
</style>
