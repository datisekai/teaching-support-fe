<template>
  <el-dialog
    top="0vh"
    @open="handleOpen"
    :width="dialogWidth"
    :visible.sync="dialogVisible"
    :title="$t(langPrefix + 'preview')"
  >
    <el-carousel
      trigger="click"
      ref="myCarousel"
      :autoplay="false"
      indicator-position="outside"
    >
      <el-carousel-item v-for="(image, index) in images" :key="index">
        <img class="image-preview" :src="image.origin" />
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
import { Carousel, Dialog } from "element-ui";
export default {
  components: {
    ElCarousel: Carousel,
    ElDialog: Dialog
  },
  props: {
    images: {
      type: Array,
      default: [],
    },
    initialIndex: {
      type: Number,
      default: [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    langPrefix: {
      type: String,
      default: "component.shared.imagePreview.default.",
    },
  },
  data() {
    return {
      window: window,
      myCarousel: {},
    };
  },
  computed: {
    dialogWidth() {
      return ((this.window.innerHeight - 210) / 9) * 16 + "px";
    },
    dialogVisible() {
      return this.visible;
    },
  },
  methods: {
    handleOpen() {
      this.$nextTick(() => {
        if (!this.myCarousel) {
          this.myCarousel = this.$refs.myCarousel;
        }
      });
      if (this.myCarousel) {
        this.myCarousel.setActiveItem(this.initialIndex);
      }
    },
  },

  // set dialogVisible(value) {
  //   this.$emit("update:visible", value);
  // }
};
</script>
<style lang="scss">
.el-dialog {
  margin-bottom: 0 !important;
  max-height: 100vh !important;
  .el-carousel__container {
    height: calc(100vh - 165px);
  }
  .el-carousel__item {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
  }
  .image-preview {
    max-width: 100%;
    max-height: calc(100vh - 110px);
    object-fit: contain;
  }
}
</style>
