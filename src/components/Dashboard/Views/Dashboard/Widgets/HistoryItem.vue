<template>
  <tr>
    <td class="img-row">
      <div class="icon-wrapper" :class="`text-${icon}`">
        <i class="el-icon-bell"></i>
      </div>
    </td>
    <td class="text-left">
      <router-link :to="userLink">
        {{item.user_name}}
      </router-link>
      {{parseAction(item.action)}}
      {{parseType(item.type)}}
      <router-link :to="objectLink">
        {{item.type_title}}
      </router-link>
    </td>
    <td class="td-actions text-right">
      {{$util.timeSince(item.created_at)}}
    </td>
  </tr>
</template>
<script>
  import { Tooltip } from 'element-ui'

  export default {
    components: {
      [Tooltip.name]: Tooltip
    },
    props: {
      item: {
        type: Object,
        default: () => {
          return {
            "id": 1,
            "user_id": 0,
            "user_name": "Demo User",
            "user_type": "admin",
            "action": "login",
            "type": "user",
            "type_id": 0,
            "type_title": "",
            "created_at": "2018-09-04 11:17:03",
            "updated_at": "2018-09-04 11:17:03"
          }
        }
      },
      index: Number
    },
    computed: {
      icon() {
        return this.item.user_type == 'admin' ? 'danger' : 'warning';
      },
      userLink() {
        return '/user/' + this.item.user_id;
      },
      objectLink() {
        return '/' + this.item.type + '/' + this.item.type_id
      }
    },
    methods: {
      parseAction(action) {
        switch(action) {
          case 'create': return 'tạo';
          case 'restore': return 'hồi phục';
          case 'update': return 'cập nhật';
          case 'delete': return 'xóa';
          case 'inactive': return 'ẩn';
          case 'active': return 'hiện';
          case 'logout': return 'đăng xuất';
          case 'login': return 'đăng nhập';
          default: return '';
        }
        return '';
      },
      parseType(type) {
        switch(type) {
          case 'menu': return 'menu';
          case 'attribute': return 'thuộc';
          case 'setting': return 'thiết lập chung';
          case 'product': return 'sản phẩm';
          case 'sale': return 'chương trình giảm giá';
          case 'collection': return 'nhóm sản phẩm';
          case 'blog': return 'nhóm bài viết';
          case 'article': return 'bài viết';
          case 'page': return 'trang nội dung';
          case 'coupon': return 'mã giảm giá';
          case 'role': return 'quyền';
          case 'client': return 'khách hàng tiêu biểu';
          case 'testimonial': return 'đối tác nói về chúng tôi';
          case 'order': return 'đơn hàng';
          case 'contact': return 'liên hệ';
          case 'gallery': return 'thư viện ảnh';
          default: return '';
        }
        return '';
      }
    }
  }
</script>
<style>
  .icon-wrapper {
    font-size: 24px;
  }
</style>
