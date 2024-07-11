<template>
  <div class="d-flex row">
    <div class="col-lg-12 col-md-12">
      <form-card
        v-for="(dataF, index) in dataForm.filter(item => !item.col)"
        :key="index"
        @updateHandle="updateHandle"
        :group="dataF"
        v-model="form"
        @field-update="handleFieldUpdate"
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
        v-model="form"
        @field-update="handleFieldUpdate"
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
  </div>
</template>

<script>
import FormCard from "@/components/UIComponents/FormCard.vue";
import { Input, Button, Notification } from "element-ui";
import MySelect from "@/components/UIComponents/Select.vue";
import dataForm from "./order-form";
import util from "@/helpers/util";

export default {
  components: {
    ElInput: Input,
    ElButton: Button,
    FormCard,
    MySelect
  },
  data() {
    return {
      form: {
        send_username: "",
        send_server: 1,
        order_status: "pending",
        amount: 0
      },
      dataForm: dataForm
    };
  },
  mounted() {
    this.$store.dispatch("setPageTitle", "Tạo đơn hàng");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "create",
        type: "primary",
        icon: "",
        callback: this.save
      }
    ]);
  },
  methods: {
    handleFieldUpdate(key, value) {
      this.form[key] = value;
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          const payload = {
            ...this.form,
            amount: +this.form.amount
          };
          this.$store.dispatch("storeOrder", payload).then(
            res => {
              Notification({
                title: "Success",
                message: "Tạo đơn hàng thành công",
                position: "bottom-right",
                type: "success"
              });
              // setTimeout(() => {
              this.$router.push({
                name: "AllOrders"
              });
              // }, 1000);
            },
            error => {
              Notification({
                title: "Error",
                message: error.message,
                position: "bottom-right",
                type: "error"
              });
            }
          );
        }
      });
    },
    updateHandle() {
      const self = this;
      const data = {
        handle: self.$util.createHandle(self.form.title),
        lang: "vi"
      };
      self.form.slug = data.handle;
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  }
};
</script>
