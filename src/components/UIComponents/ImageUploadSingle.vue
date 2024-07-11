<template lang="html">
  <div class="image-uploader" :class="{ disabled: disabled }">
    <div tabindex="0" class="el-upload el-upload--text" v-if="!imageUrl">
      <label class="image-detail">
        <i v-if="loading" class="el-icon-loading"></i>
        <i v-else class="el-icon-plus image-uploader-icon"></i>
        <input
          :disabled="disabled"
          type="file"
          accept="image/*"
          class="el-upload__input"
          ref="import"
          v-on:change="browseFileOnChange()"
        />
      </label>
    </div>
    <div class="image-uploaded" v-else>
      <img :src="imageUrl" />
      <el-button
        class="btn-delete-image"
        type="danger"
        icon="el-icon-close"
        size="mini"
        @click="removeImage()"
      ></el-button>
    </div>
  </div>
</template>

<script>
import { Notification, Input, Button } from "element-ui";
export default {
  props: ["attribute", "value", "placeholder", "disabled"],
  components: {
    ElInput: Input,
    ElButton: Button
  },
  data() {
    return {
      files: [],
      imageUrl: this.value,
      loading: false
    };
  },
  methods: {
    removeImage() {
      this.imageUrl = "";
      this.$emit("input", null);
    },
    browseFileOnChange() {
      const formData = this.$util.parseFormData({
        file: this.$refs.import.files
      });
      this.loading = true;
      this.$store.dispatch("uploadImage", formData).then(
        res => {
          this.loading = false;
          Notification({
            title: "Success",
            message: "Upload succeeded",
            position: "bottom-right",
            type: "success"
          });
          console.log("res", res);
          const file = res.url;
          console.log("file", file);
          this.$emit("input", file);
          this.$refs.import.value = "";
        },
        err => {
          this.loading = false;
          this.$refs.import.value = "";
          Notification({
            title: "Error",
            message: err.message,
            position: "bottom-right",
            type: "error"
          });
        }
      );
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal) {
        this.imageUrl = newVal;
      } else {
        this.imageUrl = "";
        this.files = [];
      }
    }
  }
};
function getImageName(newVal) {
  if (Array.isArray(newVal)) return newVal.map(n => n.title).join(";");
  else if (newVal instanceof FileList)
    return newVal.map(n => n.title).join(";");
  else if (typeof newVal == "object") {
    let pieces = newVal.title && newVal.title.split(/[\s\/]+/);
    return pieces && pieces.length && pieces[pieces.length - 1];
  } else if (typeof newVal == "string") {
    let pieces = newVal.split(/[\s\/]+/);
    return pieces[pieces.length - 1];
  } else return newVal;
}
</script>

<style lang="scss" scoped>
.w-100 {
  width: 100px !important;
}
.ipt-with-btn {
  width: calc(100% - 100px) !important;
}
i {
  position: absolute;
  font-size: 30px;
  top: calc(50% - 15px);
  left: calc(50% - 15px);
  width: unset;
  height: unset;
  line-height: 1;
}
.image-uploader {
  width: 120px;
  height: 120px;
  border-color: #fff !important;
}
.image-uploader .el-upload {
  width: 100%;
  height: 100%;
}
label.image-detail {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  margin-bottom: 0px;
}
.image-uploaded {
  width: 120px;
  height: 120px;
  border: 1px solid #ccc;
  padding: 5px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  .btn-delete-image {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 9;
    padding: 2px;
    display: none;
  }

  &:hover {
    border-color: #ccc;
    .btn-delete-image {
      display: inline-block;
      border-radius: 50%;
    }
  }
}
</style>
