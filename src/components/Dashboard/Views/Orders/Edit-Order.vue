<template>
  <div class="d-flex row">
    <div class="col-lg-12 col-md-12">
      <form-card
        v-for="(dataF, index) in dataForm.filter(item => !item.col)"
        :key="index"
        @updateHandle="updateHandle"
        :group="dataF"
        @field-update="handleFieldUpdate"
        v-model="form"
      ></form-card>
    </div>
    <div class="col-lg-8 col-md-8">
      <form-card
        v-for="(dataF, index) in dataForm.filter(
          item => item.col && item.col == 8
        )"
        :key="index"
        @updateHandle="updateHandle"
        :group="dataF"
        @field-update="handleFieldUpdate"
        v-model="form"
      ></form-card>
    </div>
    <div class="col-lg-4 col-md-4">
      <form-card
        v-for="(dataF, index) in dataForm.filter(item => item.col == 4)"
        @updateHandle="updateHandle"
        :group="dataF"
        :key="index"
        v-model="form"
        @field-update="handleFieldUpdate"
      ></form-card>
    </div>

    <div
      class="col-lg-12 col-md-12"
      v-if="
        categoryDetail &&
          categoryDetail.articles &&
          categoryDetail.articles.length > 0
      "
    >
      <list-article :articles="categoryDetail.articles" />
    </div>
  </div>
</template>

<script>
import FormCard from "@/components/UIComponents/FormCard.vue";
import { MessageBox, Input, Button, Notification } from "element-ui";
import { mapState } from "vuex";
import MySelect from "@/components/UIComponents/Select.vue";
import dataForm from "./order-form";
import util from "@/helpers/util";

var _dataForm = {};
export default {
  components: {
    ElInput: Input,
    ElButton: Button,
    FormCard,
    MySelect
  },
  beforeCreate() {
    _dataForm = JSON.parse(JSON.stringify(dataForm));
  },
  data() {
    return {
      form: {},
      dataForm: _dataForm,
      orderDetailID: null
    };
  },
  computed: {
    ...mapState(["orderDetail"])
  },
  mounted() {
    this.orderDetailID = this.$route.params.id;
    this.$store.dispatch("fetchOrderDetail", this.orderDetailID);

    this.$store.dispatch("setPageTitle", "Cập nhật đơn hàng");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "delete",
        type: "danger",
        icon: "",
        callback: this.remove
      },
      {
        label: "update",
        type: "primary",
        icon: "",
        callback: this.save
      }
    ]);
  },
  methods: {
    updateHandle() {
      const self = this;
      const data = {
        handle: self.$util.createHandle(self.form.title),
        lang: "vi"
      };
      self.form.slug = data.handle;
    },
    handleFieldUpdate(key, value) {
      this.form[key] = value;
    },

    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          const form = util.convertObjectForm(this.form);
          const payload = {
            ...form,
            tags: form.tags.join("#"),
            is_active: form.is_active == "true" ? true : false
          };
          this.$store
            .dispatch("updateCategory", payload)
            .then(result => {
              Notification({
                title: "Success",
                message: "Đã cập nhật nhóm bài viết",
                position: "bottom-right",
                type: "success"
              });

              setTimeout(() => {
                this.$router.push({
                  name: "AllCategory"
                });
              }, 1000);
            })
            .catch(error => {
              Notification({
                title: "Error",
                message: error.message,
                position: "bottom-right",
                type: "error"
              });
            });
        }
      });
    },
    isOwned() {
      return this.orderDetailID == this.categoryDetail.id;
    }
  },
  watch: {
    orderDetail(newValue, oldValue) {
      console.log("orderDetail", newValue);
      if (newValue) {
        this.form = {
          ...this.form,
          ...newValue
        };
      }
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  }
};
</script>
