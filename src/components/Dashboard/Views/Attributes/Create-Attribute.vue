<template lang="html">
  <div class="row">
    <div class="col-md-8 col-sm-12 offset-md-2">
      <el-card>
        <div class="row">
            <div class="col-12">
              <el-form :model="formCreate" :rules="rules" ref="formCreate" label-position="top">
                <el-form-item label="Tên thuộc tính" prop="name">
                  <el-input v-model="formCreate.name"></el-input>
                </el-form-item>
                <el-form-item label="Mô tả" prop="description">
                  <el-input type="textarea" :rows="5" v-model="formCreate.description"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  Input,
  Button,
  Form,
  FormItem,
  Select,
  Option,
  Card,
  Message,
} from "element-ui";
import MySelect from "src/components/UIComponents/Select";

export default {
  components: {
    ElCard: Card,
    ElForm: Form,
    ElFormItem: FormItem,
    ElInput: Input,
    ElButton: Button,
    ElSelect: Select,
    ElOption: Option,
    MySelect,
  },

  data() {
    return {
      formCreate: {
        name: "",
        description: "",
      },
      rules: {
        name: [{ require: true, message: "", trigger: "change" }],
      },
    };
  },
  mounted() {
    const actions = [
      {
        label: this.$t("el.button.create"),
        type: "primary",
        icon: "",
        callback: this.create,
      },
    ];
    this.$store.dispatch("setPageTitle", "Tạo mới thuộc tính");
    this.$store.dispatch("setCurrentActions", actions);
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  },
  methods: {
    async create() {
      try {
        const valid = await this.$refs["formCreate"].validate();
        if (valid) {
          let res = await this.$store.dispatch(
            "createAttribute",
            this.formCreate
          );
          Message({
            message: "Tạo thành công",
            type: "success",
          });
          this.$router.push({ path: `/attributes/${res.id}` });
        }
      } catch (error) {
        if (error) {
          Message({
            message: error.message,
            type: "error",
          });
        }
      }
    },
  },
  watch: {},
};
</script>
