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
import { mapState } from "vuex";

export default {
  components: {
    FormCard,
    Notification
  },
  data() {
    return {
      form: {},
      group: roomForm,
      initSelect: false
    };
  },
  computed: {
    ...mapState(["groups"])
  },
  mounted() {
    this.$store.dispatch("setPageTitle", "Tạo phòng điểm danh");

    const groupId = this.$route.query.group_id;
    if (groupId) {
      this.$store.dispatch("fetchGroups");
    }
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
        console.log("error", e);
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    }
  },
  watch: {
    groups(newVal, oldVal) {
      if (this.initSelect) return;
      if (newVal && newVal.length > 0) {
        const groupId = this.$route.query.group_id;
        if (groupId) {
          const group = newVal.find(item => item.id == groupId);
          if (group) {
            this.initSelect = true;
            this.form.group = group;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
