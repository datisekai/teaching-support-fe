<template lang="html">
  <div class="row" data-vv-scope="form">
    <div class="col-lg-9 col-md-9 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'groupleft' + index"
        :group="group"
        v-model="form"
        @updateHandle="updateHandle"
      ></form-card>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-12">
      <form-card
        v-for="(group, index) of sideGroups"
        :key="'groupright' + index"
        hasTop="true"
        :group="group"
        v-model="form"
      >
      </form-card>
    </div>
  </div>
</template>

<script>
import FormCard from "src/components/UIComponents/FormCard.vue";
import CustomField from "src/components/UIComponents/CustomField.vue";
import { Message, Input, Button } from "element-ui";
import MySelect from "src/components/UIComponents/Select";
import dataForm from "./article-form";
import ImageUploadSingle from "src/components/UIComponents/ImageUploadSingle";

const _form = {};

export default {
  components: {
    FormCard,
    CustomField,
    ElInput: Input,
    ElButton: Button,
    Message,
    MySelect,
    ImageUploadSingle,
  },
  beforeCreate() {
    dataForm.forEach((item) => {
      item.groups.forEach((group) => {
        group.attributes.forEach((attr) => {
          if (attr.multiple && _form[attr.prop]) {
            _form[attr.prop] = [];
          } else {
            _form[attr.prop] = "";
          }
          attr.value = _form[attr.prop];
        });
      });
    });
  },
  data() {
    return {
      centerGroups: dataForm[0].groups,
      sideGroups: dataForm[1].groups,
      form: _form,
      show_fields: [],
    };
  },
  computed: {},
  mounted() {
    this.$store.dispatch("setPageTitle", "Tạo bài viết");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Lưu lại",
        type: "primary",
        icon: "",
        callback: this.save,
      },
    ]);
  },

  methods: {
    cancel() {
      this.$router.push({ name: "AllArticles" });
    },
    updateHandle() {
      this.form.handle = this.form.title;
      const data = {
        handle: this.$util.createHandle(this.form.title),
        lang: "vi",
      };
      this.$store.dispatch("checkHandle", data).then((result) => {
        this.form.handle = result;
      });
    },
    async save() {
      const result = await this.$validator.validateAll();
      if (result) {
        try {
          const resp = await this.$store.dispatch("createArticle", this.form);
          Message({
            message: "Tạo thành công",
            type: "success",
          });
          this.$router.push({ path: `/articles/${resp.data.id}` });
        } catch (error) {
          Message({
            message: error.message,
            type: 'error'
          })
        }
      }
    },
  },
  watch: {},
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
    this.$store.state.customField = [];
  },
};
</script>
