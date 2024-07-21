<template lang="html">
  <div>
    <form-card :group="group" v-model="form" @field-update="handleFieldUpdate">
    </form-card>
  </div>
</template>

<script>
import roomForm from "./room-form.js";
import FormCard from "src/components/UIComponents/FormCard.vue";
import { Notification } from "element-ui";

export default {
  components: {
    FormCard,
    Notification
  },
  data() {
    return {
      form: {},
      group: roomForm
    };
  },
  mounted() {
    this.$store.dispatch("setPageTitle", "Tạo phòng điểm danh");

    this.$store.dispatch("setCurrentActions", [
      {
        label: "Tạo",
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
    async save() {
      try {
        const result = await this.$validator.validateAll();
        const payload = {
          title: this.form.title,
          description: this.form.description,
          group_id: this.form.group.id
        };
        if (result) {
          let q = await this.$store.dispatch("createRoom", payload);
          Notification({
            title: "Success",
            message: "Create succeeded",
            position: "bottom-right",
            type: "success"
          });
          this.$router.push(`/rooms`);
        }
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
