<template>
  <div>
    <el-tabs class="full-width" v-model="activeName">
      <el-tab-pane label="Thuộc tính phiên bản" name="variant">
        <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-attribute" v-for="variantAttribute of variantAttributes">
            <div class="card">
              <div class="card-header">
                <h6 class="card-title text-center">{{variantAttribute.name}}</h6>
              </div>
              <hr>
              <div class="card-body card-body-attribute">
                <el-table
                  :data="variantAttribute.options"
                  style="width: 100%">
                  <el-table-column prop="name" label="Tiêu đề">
                  </el-table-column>
                  <el-table-column
                    class-name="td-actions"
                    label="Hành động"
                  >
                    <template slot-scope="props">
                      <p-button type="primary" size="sm" icon @click="showModal(props.row, 'edit')">
                        <i class="nc-icon nc-ruler-pencil"></i>
                      </p-button>
                      <p-button type="danger" size="sm" icon @click="removeOption(props.row.id)">
                        <i class="nc-icon nc-simple-remove"></i>
                      </p-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <hr>
              <div class="card-body">
                <el-button type="primary" size="small" class="full-width" @click="showModal(variantAttribute, 'add')">Thêm mới</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="Thuộc tính sản phẩm"
        name="product"
      >
        <div class="row">
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-attribute" v-for="productAttribute of productAttributes">
            <div class="card">
              <div class="card-header">
                <h6 class="card-title text-center">{{productAttribute.name}}</h6>
              </div>
              <hr>
              <div class="card-body card-body-attribute">
                <el-table
                  :data="productAttribute.options"
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="Tiêu đề"
                  >
                  </el-table-column>
                  <el-table-column
                    class-name="td-actions"
                    label="Hành động"
                  >
                    <template slot-scope="props">
                      <p-button type="primary" size="sm" icon @click="showModal(props.row, 'edit')">
                        <i class="nc-icon nc-ruler-pencil"></i>
                      </p-button>
                      <p-button type="danger" size="sm" icon @click="removeOption(props.row.id)">
                        <i class="nc-icon nc-simple-remove"></i>
                      </p-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <hr>
              <div class="card-body">
                <el-button type="primary" size="small" class="full-width" @click="showModal(productAttribute, 'add')">Thêm mới</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="Màu sắc"
        name="color"
        v-if="colorAttributes.length"
      >
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 card-attribute">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title">Màu sắc</h6>
            </div>
            <hr>
            <div class="card-body card-body-attribute">
              <el-table
                :data="colorAttributes"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="Tiêu đề"
                  minWidth="180">
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="Giá trị"
                  minWidth="120"
                >
                  <template slot-scope="props">
                    <input type="color" :value="props.row['value']" :name="props.row['name']" @change="changeColor">
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="Thuộc tính" :visible.sync="dialogEditAttribute" class="dialogEditAttribute">
      <el-form :model="formModalAttribute">
        <div class="form-item clearfix">
          <span class="">Tên thuộc tính</span>
          <el-input v-model="formModalAttribute.name" placeholder="Tên thuộc tính"></el-input>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditAttribute = false">Hủy</el-button>
        <el-button v-if="formModalAttribute.action == 'add'" type="primary" @click="createOption">Thêm thuộc tính</el-button>
        <el-button v-else type="primary" @click="updateOption">Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Table, TableColumn, Select, Option, Button, Tabs, TabPane, Input, MessageBox, Message, Form, FormItem, Dialog
} from 'element-ui';
import { mapState } from 'vuex';

export default {
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElSelect: Select,
    ElOption: Option,
    ElButton: Button,
    ElTabs: Tabs,
    ElTabPane: TabPane,
    ElInput: Input,
    ElForm: Form,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    Message,
    MessageBox
  },
  data() {
    return {
      activeName: 'variant',
      dialogEditAttribute: false,
      formModalAttribute: {
        id: '',
        attribute_id: '',
        name: '',
        meta: '',
        action: '',
      }
    };
  },
  computed: mapState(['variantAttributes', 'productAttributes', 'colorAttributes']),
  mounted() {
    this.$store.dispatch('fetchAttributes', {
      status: 'active'
    });
    this.$store.dispatch('setPageTitle', 'Danh sách thuộc tính');
  },
  methods: {
    showModal(attribute, action) {
      if (action == 'edit') {
        this.formModalAttribute = {
          id: attribute.id,
          attribute_id: '',
          name: attribute.name,
          meta: '',
          action: action
        }
      } else {
        this.formModalAttribute = {
          id: '',
          attribute_id: attribute.id,
          name: '',
          meta: '',
          action: action
        }
      }

      this.dialogEditAttribute = true;
    },

    createOption() {
      if (!this.formModalAttribute.name) {
        return Message({
          message: 'Chưa nhập tên thuộc tính',
          type: 'error'
        });
      }
      this.$store.dispatch('storeAttributeOptions', this.formModalAttribute).then((res) => {
        if (res.success) {
          Message({
            message: 'Thành công',
            type: 'success'
          });
          this.dialogEditAttribute = false;
          this.$store.dispatch('fetchAttributes', {
            status: 'active'
          });
        } else {
          Message({
            message: res.message,
            type: 'error'
          });  
        }
      }, error => {
        console.error(error);
      });
    },

    updateOption() {
      if (!this.formModalAttribute.name) {
        return Message({
          message: 'Chưa nhập tên thuộc tính',
          type: 'error'
        });
      }
      this.$store.dispatch('updateAttributeOptions', this.formModalAttribute).then((res) => {
        if (res.success) {
          Message({
            message: 'Thành công',
            type: 'success'
          });
          this.dialogEditAttribute = false;
          this.$store.dispatch('fetchAttributes', {
            status: 'active'
          });
        } else {
          Message({
            message: res.message,
            type: 'error'
          });  
        }
      }, error => {
        console.error(error);
      });
    },

    removeOption(id) {
      MessageBox.confirm('Xóa thuộc tính?', 'warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeAttributeOptions', id).then((res) => {
          if (res.success) {
            Message({
              message: 'Đã xóa',
              type: 'success'
            });
            this.dialogEditAttribute = false;
            this.$store.dispatch('fetchAttributes', {
              status: 'active'
            });
          } else {
            Message({
              message: res.message,
              type: 'error'
            });  
          }
        }, error => {
          console.error(error);
        });
      }).catch(() => {
      });
    },
    changeColor(event) {
      const target = event.target;
      const name = target.name;
      const handle = this.$util.createHandle(target.name);
      const value = target.value;
      const data = {
        name,
        handle,
        value,
      };
      this.$store.dispatch('updateColor', data).then((resp) => {
        Message({
          message: 'Chỉnh sửa thành công',
          type: 'success',
        });
      });
    },
  },
};
</script>

<style lang="scss">
  .card-body-attribute {
    height: 300px;
    overflow-y: auto;
  }

  .dialogEditAttribute {
    .el-dialog {
      width: 600px;
      .el-dialog__body {
        padding-bottom: 0;
      }
      .form-item {
        margin-bottom: 20px;
        > span {
          width: 110px;
          display: inline-block;
          float: left;
          padding-top: 10px;
        }
        > .el-input, > .el-select {
          width: calc(100% - 120px);
          display: inline-block;
          float: left;
          margin-left: 10px;
        }
      }
    }
  }

</style>
