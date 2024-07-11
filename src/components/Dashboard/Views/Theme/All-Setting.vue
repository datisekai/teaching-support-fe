<template>
  <div class="row">
    <el-tabs v-model="activeName" class="full-width">
      <el-tab-pane
        v-for="(tab, index) of settingView"
        :label="tab.title"
        :name="tab.id"
        :key="'tab' + index"
      >
        <form-card
          :group="group"
          v-for="(group, i) of tab.groups"
          :key="'group' + i"
          v-model="settingData"
          :value="settingData"
        ></form-card>
      </el-tab-pane>
    </el-tabs>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">Hủy</el-button>
        <el-button type="primary" @click="save">Cập nhật</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Select,
  Option,
  Button,
  Tabs,
  TabPane,
  Message,
  Dialog,
  Form,
  FormItem
} from "element-ui";
import FormCard from "src/components/UIComponents/FormCard.vue";
import MySelect from "src/components/UIComponents/Select";
import { mapState } from "vuex";
import themeFormView from "./theme-form";

let _setting_data = {};

export default {
  components: {
    ElSelect: Select,
    ElOption: Option,
    ElButton: Button,
    ElTabs: Tabs,
    ElTabPane: TabPane,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    ElForm: Form,
    FormCard,
    Message,
    MySelect
  },
  computed: {
    ...mapState(["setting"]),
    settingView() {
      let data = themeFormView;
      console.log("data", data);
      if (data && data.length) {
        data.forEach(tab => {
          tab.groups.forEach(group => {
            group.attributes.forEach(attr => {
              if (attr.multiple) {
                _setting_data[attr.name] = [];
              } else {
                _setting_data[attr.name] = "";
              }
            });
          });
        });
        console.log("data: ", data);
        return data;
      }
      return [];
    }
  },
  data() {
    return {
      activeName: "Home",
      dialogFormRestoreVisible: false,
      formRestore: {},
      listVersion: [],
      settingData: _setting_data
    };
  },
  mounted() {
    // this.$store.dispatch("fetchSettingView");
    this.$store.dispatch("fetchSettingData");
    // this.$store.dispatch("fetchVersionSettings");

    this.$store.dispatch("setPageTitle", "Tùy biến giao diện");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Cập nhật",
        type: "primary",
        icon: "",
        callback: this.save
      }
    ]);
  },
  methods: {
    cancel() {
      this.$router.push({ name: "dashboard" });
    },
    showRestore() {
      this.dialogFormRestoreVisible = true;
    },
    save() {
      const self = this;

      const payload = {
        meta_value: this.settingData,
        meta_key: "setting_data"
      };

      this.$store.dispatch("updateMeta", payload).then(
        res => {
          Message({
            message: "Cập nhật thành công",
            type: "success"
          });
        },
        res => {
          Message({
            message: res.message,
            type: "error"
          });
        }
      );
    }
  },
  watch: {
    setting(newValue, oldValue) {
      console.log("newValue", newValue);
      this.settingData = newValue;
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
    this.$store.state.settings = [];
  }
};
</script>
<style lang="scss">
.el-table .td-actions {
  button.btn {
    margin-right: 5px;
  }
}
.full-width {
  width: 100% !important;
}
</style>
