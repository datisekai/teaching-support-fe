<template>
  <tr>
    <td class="text-left">
      <router-link :to="userLink">
        {{item.name}}
      </router-link>
      <br>
      <div v-html="item.content"></div>
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
            "name": "Demo User",
            "content": "",
            "created_at": "2018-09-04 11:17:03",
            "updated_at": "2018-09-04 11:17:03"
          }
        }
      },
      index: Number
    },
    computed: {
      userLink() {
        return '/contact';
      },
    }
  }
</script>
<style>
  .icon-wrapper {
    font-size: 24px;
  }
</style>
