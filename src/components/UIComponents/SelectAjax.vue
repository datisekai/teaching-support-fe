<template lang="html">
  <el-select
    ref="select"
    class="full-width"
    v-model="selectValues"
    filterable
    clearable
    remote
    reserve-keyword
    :disabled="disabled"
    :multiple="isMultiple"
    :placeholder="placeholder || 'Tìm kiếm ' + type + '...'"
    :remoteMethod="remoteMethod"
    :loading="loading"
    no-data-text="Không tìm thấy kết quả"
    loadingText="Đang tải..."
    value-key="id"
    @input="val => handleInput(val)"
    @focus="handleFocus()"
  >
    <el-option
      v-for="(item, index) in dataSource"
      :key="item.id"
      :label="item.label || item.title"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option, Message } from "element-ui";
import api from "src/api/index";

export default {
  props: ["attribute", "value", "disabled", "placeholder"],
  components: {
    ElSelect: Select,
    ElOption: Option
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      firstFocus: false,
      selectValues: [this.value]

      // model: this.$util.findModel(this.attribute.type),
      // type: this.$util.findModelName(this.attribute.type),
      // valueKey: this.attribute.valueKey,
      // field: this.attribute.field || 'term',
    };
  },
  computed: {
    model() {
      return this.$util.findModel(this.attribute.type);
    },
    type() {
      return this.$util.findModelName(this.attribute.type) || "";
    },
    valueKey() {
      return this.attribute.valueKey;
    },
    key() {
      return this.attribute.key;
    },
    field() {
      return this.attribute.field;
    },
    displayField() {
      return this.attribute.displayField;
    },
    dataField() {
      return this.attribute.dataField;
    },
    isMultiple() {
      return this.attribute.multiple === undefined
        ? this.$util.isMultiple(this.attribute.type)
        : this.attribute.multiple;
    }
  },
  mounted() {
    this.remoteMethod();
    // console.log(this.model);
  },
  methods: {
    remoteMethod(query) {
      const buildQuery = this.buildUrl(query);
      // if (buildQuery === false) {
      //   return;
      // }
      this.loading = true;
      api
        .get(buildQuery)
        .then(resp => {
          let data = resp.data;
          if (!data.error) {
            const buildSrc = this.buildDataSource(
              [],
              this.dataField ? data.data[this.dataField] : data.data
            );

            this.dataSource = buildSrc;
          }

          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    buildUrl(query) {
      // if (!query) return false;
      if (!this.model) {
        return false;
      }
      let url = `/api.${this.model}`;

      if (this.model == "teacher") {
        url = "/api.user/teacher";
      }
      let queryObject = {};
      if (query) {
        queryObject[this.field] = query;
      }
      if (this.attribute.extraQuery) {
        const extraQuery = this.attribute.extraQuery || {};
        queryObject = { ...queryObject, ...extraQuery };
      }
      url += this.$util.buildQuery(queryObject);
      return url;
    },
    buildDataSource(selectedList, newList) {
      selectedList = selectedList || [];
      let list = selectedList.concat(newList);
      if (this.key) {
        list = this.$util.uniqueList(this.key, list);
      }

      return list.map((obj, index) => {
        let label =
          (this.displayField && obj[this.displayField]) ||
          obj[this.field] ||
          obj.name ||
          obj.title;

        if (this.model == "group") {
          label = `${obj["name"]} - ${obj.course.name}`;
        }
        return {
          label,
          value: this.valueKey ? obj[this.valueKey] : obj,
          id: this.key ? obj[this.key] : index
        };
      });
    },
    handleInput(val) {
      this.$emit("input", val);
    },
    handleFocus() {
      if (!this.firstFocus) {
        this.remoteMethod("");
      }
      this.firstFocus = true;
    }
  },
  watch: {
    model: function(newVal, old) {
      if (newVal) {
        this.remoteMethod();
      }
    },
    value: function(newVal, old) {
      this.selectValues = newVal;
      // if (this.isMultiple === false) {
      //   if (newVal) {
      //     this.dataSource = [];
      //   } else {
      //     this.remoteMethod();
      //   }
      // }
    },
    "attribute.initOptions": {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.dataSource = this.buildDataSource(newVal, []);
        }
      }
    }
  }
};
</script>

<style lang="scss">
span.el-select__tags-text {
  color: white !important;
}
i.el-tag__close.el-icon-close {
  color: white !important;
}
</style>
