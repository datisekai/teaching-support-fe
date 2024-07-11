<template>
  <div>
    <editor
      v-model="text"
      apiKey="pgm9gcnllfimfcgo7joyxpm22j4ov87erg4u4fyy7gxo1g23"
      :init="tinymceInit"
    ></editor>
  </div>
</template>

<script>
  import { Notification } from 'element-ui'
  import Editor from '@tinymce/tinymce-vue'
  export default {
    props: ['value', 'height'],
    name: "Editor",
    components: {
      editor: Editor
    },
    data() {
      return {
        tinymceInit: {
          height: this.height || 300,
          theme: 'modern',
          relative_urls: false,
          remove_script_host: false,
          convert_urls: true,
          menubar: true,
          file_picker_callback: this.editorImageCallback,
          file_picker_types: 'image',
          plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help code save contextmenu paste textcolor colorpicker',
          toolbar1: 'formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify',
          toolbar2: 'fontselect fontsizeselect table | image link | numlist bullist outdent indent | fullscreen | removeformat tools',
          table_default_styles: {
            width: '50%'
          },
          // image_advtab: true,
          // automatic_uploads: true,
          // images_upload_base_path: '/uploads',
          // imageupload_url: '/',
          valid_elements : '*[*]',
          file_browser_callback_types: 'file image',
        }
      }
    },
    computed: {
      text: {
        get() {
          if (this.value) return this.value;
          return '';
        },
        set(value){
          this.$emit('input', value);
        }
      }
    },
    methods: {
      handleInput(field, val) {
        const oldValue = this.value[field];
        this.$emit('input', this.value);
        this.$emit('field-update', field, val, oldValue);
      },
      editorImageCallback(callback, value, meta) {
        const self = this;
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = function () {
          const file = this.files[0];
          const formData = self.$util.parseFormData({file});
          Notification({
            title: 'Warning',
            message: 'Uploading',
            position: 'bottom-right',
            type: 'warning',
          });
          self.$store.dispatch('uploadImage', formData).then(res => {
            Notification({
              title: 'Success',
              message: 'Upload succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            callback(file.name, { title: file.name, src: res[0].large});
          }, err => {
            Notification({
              title: 'Error',
              message: error.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
        };
        input.click();
      }
    }
  }
</script>

<style scoped>

</style>
