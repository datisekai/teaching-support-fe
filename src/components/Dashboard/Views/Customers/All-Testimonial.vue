<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-9 col-md-6 col-sm-6 col-6">
            <my-filter
              :rules="rules"
              v-on:filter-change="updateFilter"
            ></my-filter>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-6">
            <column-toggle
              v-model="columnDefs"
              @input="cols => this.$refs['table'].updateColumns(cols)"
            ></column-toggle>
          </div>
        </div>
        <div class="col-sm-12 p-0">
          <my-table
            ref="table"
            :columnDefs="columnDefs"
            v-bind:data-rows="testimonials"
            :actions="actions"
            :actionsTable="actionsTable"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message } from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import testimonialSchemas from "./testimonial-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    testimonials() {
      const rows = this.$store.state.testimonials;
      return dtHelper.filterByRules(rows, this.filterOutput);
    }
  },
  data() {
    const initFiledArrays = ["id", "logo", "name", "updated_at", "status"];
    const columnDefs = dtHelper.buildInitFields(
      testimonialSchemas,
      initFiledArrays
    );

    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          callback: this.edit
        },
        {
          type: "danger",
          icon: "fa-solid fa-xmark",
          callback: this.remove
        }
      ],
      actionsTable: [
        {
          title: "Ẩn",
          callback: this.inactiveAll
        },
        {
          title: "Hiện",
          callback: this.activeAll
        },
        {
          title: "Xóa",
          color: "text-danger",
          callback: this.removeAll
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(testimonialSchemas)
    };
  },
  mounted() {
    this.$store.dispatch("fetchTestimonial");

    this.$store.dispatch("setPageTitle", "khách hàng nói về chúng tôi");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Xuất excel",
        type: "default",
        icon: "",
        callback: this.exportExcel
      },
      {
        label: "Tạo mới",
        type: "primary",
        icon: "",
        callback: this.create
      }
    ]);
  },
  methods: {
    create() {
      this.$router.push("/testimonial/create");
    },
    edit(index, row) {
      this.$router.push(`/testimonial/${row.id}`);
    },
    inactiveAll(rows) {
      this.updateStatus(rows, "inactive");
    },
    activeAll(rows) {
      this.updateStatus(rows, "active");
    },
    remove(index, row) {
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      }).then(() => {
        this.updateStatus([row], "delete");
      });
    },
    removeAll(rows) {
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      }).then(() => {
        this.updateStatus(rows, "delete");
      });
    },
    updateStatus(rows, status) {
      const self = this;
      this.$util
        .updateStatusAll("testimonial", rows, status)
        .then(result => {
          self.$store.dispatch("fetchTestimonial");
          Message({
            type: "success",
            message: "Cập nhật thành công"
          });
        })
        .catch(error => {
          Message({
            type: "error",
            message: error.message
          });
        });
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == "ascending" ? "asc" : "desc";
      this.$store.dispatch("fetchTestimonial", {
        order: `${prop}=${order}`
      });
    },
    exportExcel() {
      let self = this;
      this.$util.exportExcel("testimonial", self.$store.state.testimonials);
    }
  }
};
</script>
<style lang="scss">
.el-table .td-actions {
  button.btn {
    margin-right: 5px;
  }
}
</style>
