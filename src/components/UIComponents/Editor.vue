<template>
  <div>
    <editor v-model="text" api-key="no-api-key" :init="tinymceInit"></editor>
  </div>
</template>

<script>
import { Notification } from "element-ui";
import Editor from "@tinymce/tinymce-vue";

export default {
  props: ["value", "height", "route"],
  name: "Editor",
  components: {
    editor: Editor
  },
  data() {
    return {
      tinymceInit: {
        language: "vi",
        height: this.height || 500,
        menubar: false,
        plugins: "advlist autolink lists link image charmap preview anchor media table code help wordcount lists media searchreplace visualblocks code fullscreen".split(
          " "
        ),
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        font_formats:
          "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
        image_title: true,
        automatic_uploads: true,
        media_live_embeds: true,
        menubar: "file edit view insert format tools table help",
        toolbar:
          // eslint-disable-next-line no-multi-str
          "undo redo blocks bold italic underline fontfamily fontsize forecolor backcolor\
            alignleft aligncenter alignright alignjustify  \
            bullist numlist outdent indent removeformat link  customImageButton \
            ",

        content_css: [
          "//fonts.googleapis.com/css?family=Lato:300,300i,400,400i"
        ],
        paste_word_document_format: "googledocs",
        paste_retain_style_properties: "all",
        paste_data_images: true,
        paste_enable_default_filters: false
      }
    };
  },
  computed: {
    text: {
      get() {
        if (this.value) return this.value;
        return "";
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  watch: {
    text(n, o) {
      this.onChange(n);
    }
  },
  methods: {
    handleInput(field, val) {
      const oldValue = this.value[field];
      this.$emit("input", this.value);
      this.$emit("field-update", field, val, oldValue);
    },
    onChange(a) {
      if (navigator && !navigator.userAgent.includes("Safari")) {
        var result = this.value.matchAll(/data:image\/(.*?)"\/>/gs); // Same but whitespaces are optional
        if (result) {
          for (const item of Array.from(a, x => x[1])) {
            const file = this.$util.dataURItoFile("data:image/" + item);
            // console.log(file)
            const formData = this.$util.parseFormData({ file });
            this.$store
              .dispatch("uploadImage", {
                formData,
                route: this.route || "article"
              })
              .then(
                res => {
                  Notification({
                    title: "Success",
                    message: "Upload succeeded",
                    position: "bottom-right",
                    type: "success"
                  });
                  this.$emit(
                    "input",
                    this.value.replace("data:image/" + item, res.data.file)
                  );
                },
                err => {
                  Notification({
                    title: "Error",
                    message: error.message,
                    position: "bottom-right",
                    type: "error"
                  });
                }
              );
          }
        }
      }
    }
  }
};
</script>

<style scoped></style>
