<template lang="html">
  <div class="row">
    <div class="col-md-8 col-sm-12 offset-md-2">
      <el-card>
        <div class="row">
            <div class="col-12">
              <el-form :model="form" :rules="rules" ref="ruleFormCreate" label-position="top">
                <el-form-item label="Tên thuộc tính" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="Mô tả" prop="description">
                  <el-input type="textarea" :rows="5" v-model="form.description"></el-input>
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
      form: {
        id: "",
        name: "",
        decription: "",
      },
      rules: {
        name: [{ require: true, message: "", trigger: "change" }],
      },
    };
  },
  mounted() {
    const attributeId = this.$route.params.id;
    const actions = [
      {
        label: this.$t("el.button.update"),
        type: "primary",
        icon: "",
        callback: this.save,
      },
    ];
    this.$store.dispatch("setPageTitle", "Cập nhật thuộc tính");
    this.$store.dispatch("fetchAttributeDetail", { id: attributeId });
    this.$store.dispatch("setCurrentActions", actions);
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  },
  computed: {},
  methods: {
    async save() {
      try {
        let valid = await this.$refs["ruleFormCreate"].validate();
        if (valid) {
          let res = await this.$store.dispatch("updateAttribute", this.form);
          Message({
            message: "Cập nhật thành công",
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
  watch: {
    "$store.state.attributeDetail": function (nVal) {
      console.log(nVal);
      this.form = nVal;
    },
  },
};
</script>