<template lang="html">
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="form-card">
          <div class="row">
            <div class="col-sm-12 col-lg-2 col-md-2">
              <b class="required">Tên phân quyền</b>
            </div>
            <div class="col-sm-12 col-lg-10 col-md-10">
              <el-input
                placeholder="Tên phân quyền"
                v-model="title"
                :class="errors.has('title')?'border-danger':''"
                v-validate="'required'"
                data-vv-name="title"
                data-vv-as="Tên phân quyền"
              ></el-input>
              <span class="text-danger" v-if="errors.has('title')">{{ errors.first('title') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body form-card">
          <div class="col-12 wrapper-tree clearfix">
            <el-tree
              :data="permissions"
              show-checkbox
              node-key="id"
              ref="tree"
              :default-expand-all="true"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">Hủy</el-button>
        <el-button type="primary" @click="save">Lưu lại</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Message, Input, Tree, Button } from 'element-ui';

export default {
  components: {
    ElInput: Input,
    ElButton: Button,
    ElTree: Tree
  },
  data() {
    return {
      title: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Tạo phân quyền');
    this.$store.dispatch('fetchPermissions');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Lưu lại',
      type: 'primary',
      callback: this.save
    }]);
  },
  computed: {
    permissions() {
      let data = this.$store.state.permissions;
      for (let item of data) {
        item.label = item.id + '. ' + item.label;
        for (let i of item.children) {
          i.label = i.id + '. ' + i.label;
        }
      }
      return data;
    }
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'AllRole' });
    },
    save() {
      let self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          let permissions = this.$refs.tree.getCheckedNodes();
          let title = this.title;
          let data = {
            title,
            permissions
          };
          this.$store.dispatch('storeRoles', data).then(res => {
            if (res.success) {
              Message({
                message: 'Tạo mới thành công',
                type: 'success'
              });
              setTimeout(() => {
                self.$router.push('/roles/' + res.data.id);
              }, 1500);
            } else {
              Message({
                message: res.message,
                type: 'danger'
              });
            }
          });
        }
      });
    }
  },
  watch: {

  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>

<style lang="scss">
  .wrapper-tree {
    padding: 15px;
  }

  .el-tree {
    display: flex;
    flex-wrap: wrap;
    .el-tree-node {
      width: 33.33%;
      display: block;
      float: left;
      margin-bottom: 20px;
      padding: 0 10px;
      > .el-tree-node__content {
        margin-bottom: 2px;
      }
      .el-tree-node {
        width: 100%;
        display: block;
        margin: 2px 0;
      }
    }
  }

</style>
