<template>
  <div class="row">
    <div
      class="col-lg-4 col-md-6 col-sm-6 col-xs-12 card-attribute"
      v-for="(attribute, index) of attributes"
      :key="`${attribute.name}_${index}`"
    >
      <div class="card">
        <div class="card-header">
          <h6 class="card-title text-center">{{ attribute.name }}</h6>
        </div>
        <hr />
        <div class="card-body card-body-attribute">
          <el-table :data="attribute.options" style="width: 100%">
            <el-table-column prop="name" label="Tiêu đề"> </el-table-column>
            <el-table-column
              width="120"
              class-name="td-actions"
              label="Hành động"
              align="center"
            >
              <template slot-scope="props">
                <p-button
                  type="primary"
                  size="sm"
                  icon
                  @click="showModalAttributeOption(props.row, 'edit')"
                >
                  <i class="nc-icon nc-ruler-pencil"></i>
                </p-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <hr />
        <div class="card-body">
          <el-button
            type="primary"
            size="small"
            class="full-width"
            @click="showModalAttributeOption(attribute, 'add')"
            >Thêm mới</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog
      title="Tuỳ chọn thuộc tính"
      :visible.sync="dialogEditAttributeOption"
      class="dialogEditAttribute"
    >
      <el-form :model="formModalAttributeOption">
        <div class="form-item clearfix">
          <span class="">Tên</span>
          <el-input
            v-model="formModalAttributeOption.name"
            placeholder="Tên tùy chọn thuộc tính"
          ></el-input>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditAttributeOption = false">Hủy</el-button>
        <el-button
          v-if="formModalAttributeOption.action == 'add'"
          type="primary"
          @click="createAttributeOption"
          >Thêm tùy chọn thuộc tính</el-button
        >
        <el-button
          v-else
          type="primary"
          @click="() => updateAttributeOption(formModalAttributeOption.id)"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Thuộc tính"
      :visible.sync="dialogAddAttribute"
      class="dialogEditAttribute"
    >
      <el-form :model="formModalAttribute">
        <div class="form-item clearfix">
          <span class="">Tên</span>
          <el-input
            v-model="formModalAttribute.name"
            placeholder="Tên thuộc tính"
          ></el-input>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditAttributeOption = false">Hủy</el-button>
        <el-button
          v-if="formModalAttribute.action == 'add'"
          type="primary"
          @click="createAttribute"
          >Thêm thuộc tính</el-button
        >
        <el-button v-else type="primary" @click="updateAttribute"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  Button,
  Dialog,
  Form,
  FormItem,
  Radio,
  Col,
  Table,
  Input,
  TableColumn,
  Message,
} from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import attributeSchema from "./attribute-schema";

export default {
  components: {
    ElButton: Button,
    ElCol: Col,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    ElInput: Input,
    ElForm: Form,
    ElFormItem: FormItem,
    ElRadio: Radio,
    ElTable: Table,
    ElTableColumn: TableColumn,
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    attributes() {
      let rows = this.$store.state.attributes;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    return {
      filterOutput: [],
      actions: [
        {
          type: "primary",
          title: "sync",
          icon: "nc-icon nc-ruler-pencil",
          callback: this.edit,
        },
      ],
      filter: {},
      rules: dtHelper.buildRules(attributeSchema),
      dialogEditAttributeOption: false,
      dialogAddAttribute: false,
      formModalAttributeOption: {
        id: "",
        attribute_id: "",
        name: "",
        meta: "",
        action: "",
      },
      formModalAttribute: {
        id: "",
        name: "",
        description: "",
        action: "",
      },
    };
  },
  async mounted() {
    const actions = [
      {
        type: "primary",
        title: "create",
        icon: "",
        callback: () => this.showModalAttribute({}, "add"),
      },
    ];
    this.$store.dispatch("setPageTitle", "Thuộc tính");
    this.$store.dispatch("fetchAttributes");
    this.$store.dispatch("setCurrentActions", actions);
  },
  methods: {
    updateFilter(filterOutput) {
      const filterTitle = filterOutput.find((f) => f.filter === "name");
      if (filterTitle) {
        this.$store.dispatch("fetchAttributes", {
          name: filterTitle.value,
          perpage: 100,
        });
      } else if (filterOutput.length) {
        this.filterOutput = filterOutput;
      } else {
        this.$store.dispatch("fetchAttributes");
      }
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == "ascending" ? "asc" : "desc";
      this.$store.dispatch("fetchAttributes", {
        order: `${prop}=${order}`,
      });
    },
    edit(index, row) {
      this.$router.push({ name: "ViewAttributes", params: { id: row.id } });
    },
    showModalAttribute(attribute, action) {
      if (action == "edit") {
        this.formModalAttribute = {
          id: attribute.id,
          name: attribute.name,
          description: attribute.description,
          action: action,
        };
      } else {
        this.formModalAttribute = {
          id: "",
          name: "",
          description: "",
          action: action,
        };
      }
      this.dialogAddAttribute = true;
    },
    async createAttribute() {
      if (!this.formModalAttribute.name) {
        return Message({
          message: "Chưa nhập tên thuộc tính",
          type: "error",
        });
      }
      try {
        delete this.formModalAttribute.id;
        await this.$store.dispatch("createAttribute", this.formModalAttribute);
        Message({
          message: "Tạo thành công",
          type: "success",
        });
        this.dialogAddAttribute = false;
      } catch (error) {
        if (error) {
          Message({
            message: error.message,
            type: "error",
          });
        }
      }
    },
    async updateAttribute() {},
    async createAttributeOption() {
      if (!this.formModalAttributeOption.name) {
        return Message({
          message: "Chưa nhập tên tùy chọn thuộc tính",
          type: "error",
        });
      }
      delete this.formModalAttributeOption.id;
      try {
        const resp = await this.$store.dispatch(
          "createAttributeOption",
          this.formModalAttributeOption
        );
        Message({
          message: "Tạo thành công",
          type: "success",
        });
        this.dialogEditAttributeOption = false;
      } catch (error) {
        Message({
          message: error.message,
          type: "error",
        });
      }
    },
    async updateAttributeOption() {
      try {
        await this.$store.dispatch('updateAttributeOption', this.formModalAttributeOption);
        Message({
          message: 'Cập nhật thành công',
          type: 'success'
        })
        this.dialogEditAttributeOption = false;
      } catch(error) {
        Message({
          message: error.message,
          type: 'error'
        })
      }
    },
    showModalAttributeOption(option, action) {
      if (action == "edit") {
        this.formModalAttributeOption = {
          id: option.id,
          attributeId: option.attributeId,
          name: option.name,
        };
      } else {
        this.formModalAttributeOption = {
          id: "",
          attributeId: option.id,
          name: "",
        };
      }

      this.dialogEditAttributeOption = true;
    },
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
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
      > .el-input,
      > .el-select {
        width: calc(100% - 120px);
        display: inline-block;
        float: left;
        margin-left: 10px;
      }
    }
  }
}
</style>

