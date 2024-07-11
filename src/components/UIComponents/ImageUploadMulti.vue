<template>
  <div :style="{width: '100%'}" class="multi-image-main-wrapper">
    <div
      class="image-item image-upload"
      v-if="disabled === false"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      @click="input.click()"
    >
      <div class="upload-icon"><i class="fa fa-plus"></i></div>
    </div>
    <div
      class="image-item image-thumbnail-wrapper"
      v-for="(image, index) of images"
      :key="index"
    >
      <div
        class="image-thumbnail"
        :style="{ 'background-image': `url('${image.small}')` }"
      ></div>
      <div class="image-thumbnail-tool">
        <div>
          <div
            class="image-thumbnail-btn image-thumbnail-remove-btn"
            v-if="disabled === false"
            @click="removeImage(index)"
          >
            <i class="fa fa-trash"></i>
          </div>
          <div
            class="image-thumbnail-btn image-thumbnail-preview-btn"
            @click="openImagePreview(index)"
          >
            <i class="fa fa-eye"></i>
          </div>
        </div>
      </div>
    </div>
    <input
      :disabled="disabled"
      multiple
      type="file"
      accept="image/*"
      class="el-upload__input"
      ref="import"
      v-on:change="browseFileOnChange()"
    />
    <image-preview-slider
      :visible.sync="dialog.preview"
      :initialIndex.sync="dialog.initialIndex"
      :images="images"
    >
    </image-preview-slider>
  </div>
</template>
<script>
import ImagePreviewSlider from "./ImagePreviewSlider";

export default {
  props: {
    value: {},
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    ImagePreviewSlider: ImagePreviewSlider,
  },
  data() {
    return {
      input: "",
      images: [],
      loading: false,
      dialog: {
        preview: false,
        initialIndex: 0,
      },
    };
  },
  mounted() {
    this.input = this.$refs.import;
  },
  methods: {
    async browseFileOnChange() {
      try {
        const files = this.input.files;
        if (files) {
          this.loading = true;
          const formData = new FormData();
          for (const f of files) {
            formData.append("files", f);
          }
          const res = await this.$store.dispatch('uploadImage', formData);
          this.addImage(res);
          this.loading = false;
        }
        this.input.value = null;
      } catch (error) {
        this.loading = false;
        this.input.value = null;
      }
    },
    addImage(files) {
      if (!files || !files.length) {
        return;
      }
      this.$emit("input", files.concat(this.images));
    },

    removeImage(index) {
      this.images.splice(index, 1);
      this.$emit("input", this.images);
    },

    openImagePreview(index) {
      this.dialog.preview = true;
      this.dialog.initialIndex = index;
    },
    initImages(value) {
      if (!value) {
        return [];
      }
      return value;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.images = this.initImages(this.value);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.multi-image-main-wrapper {
  display: flex;
  overflow-x: auto;
  flex-wrap: nowrap;
  .image-item {
    flex: 0 0 170px;
    height: 170px;
    margin-right: 15px;
  }
  .image-thumbnail-wrapper {
    border: 1px solid #ddd;
    position: relative;
    cursor: pointer;
    .image-thumbnail {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    &:hover {
      .image-thumbnail-tool {
        display: flex;
      }
    }
    .image-thumbnail-tool {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      .image-thumbnail-btn {
        width: 40px;
        height: 40px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        background-color: white;
        margin: 0 10px;
        font-size: 20px;
      }
      .image-thumbnail-remove-btn {
        color: red;
      }
    }
  }
  .image-upload {
    border: 1px dashed #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .upload-icon {
      text-align: center;
      font-size: 28px;
      color: #666;
    }
  }
}
</style>
