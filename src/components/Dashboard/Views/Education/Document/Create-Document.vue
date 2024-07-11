<template lang="html">
    <div>
        <form-card
          :group="group"
          v-model="form">
          <div>
            <label>Tài liệu</label>
            <div class="custom-file mb-3" :class="{loading: loading}">
              <input type="file" class="custom-file-input" id="customFile" name="filename" accept="application/pdf" ref="upload" v-on:change="browseFileOnChange()">
              <label class="custom-file-label" for="customFile">{{ urlToShow }}</label>
            </div>
            <p>{{$t('el.documentUploadNote')}}</p>
          </div>
        </form-card>
    </div>
</template>

<script>
import documentForm from './document-form.js'
import FormCard from 'src/components/UIComponents/FormCard.vue';
import {Notification } from 'element-ui';

export default {
  components: {
    FormCard,
    Notification
  },
  data() {
    return {
        form: {},
        group: documentForm,
        url: '',
        loading: false
    }
  },
  computed: {
      document() {
          const detail = this.$store.state.documentDetail
          return detail
      },
      urlToShow() {
        return this.url
      }
  },
  watch: {
      document(nVal, oVal) {
          if (nVal.id) {
              this.form = Object.assign({}, nVal)
          }
      }
  },
  mounted() {
    this.$store.dispatch('setCurrentActions', [{
      label: 'Tạo',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
      browseFileOnChange() {
        const formData = this.$util.parseFormData({
          document: this.$refs.upload.files
        });
        this.loading = true;
        this.$store.dispatch('uploadPDF', formData).then(res => {
          this.loading = false;
          //add urlDocument to form
          this.url = res.data
          this.form.urlDocument = res.data;
        }, (err) => {
          this.loading = false;
          Notification ({
            title: 'Error',
            message: err.message,
            position: 'bottom-right',
            type: 'error',
          });
        });
      },
      async save() {
          try {
              const result = await this.$validator.validateAll()
              if (result) {
                  const res = await this.$store.dispatch('createDocument', Object.assign({}, this.form))
                  this.$router.push('/education/document/'+res.id)
                  Notification({
                    title: 'Success',
                    message: 'Create succeeded',
                    position: 'bottom-right',
                    type: 'success',
                });
              }
          } catch(e) {
                Notification({
                    title: 'Error',
                    message: e.message,
                    position: 'bottom-right',
                    type: 'error',
                });
          }
      }
  }
}

</script>
<style lang="scss" scoped>
  .custom-file {
    display: block;
  }
  .custom-file-label {
    border: 2px solid #51cbce;
  }
  .custom-file-label::after {
    background-color: #51cbce;
    color: white;
    content: 'Chọn tệp';
    border-radius: 0 1px 1px 0;
    width: 130px;
    text-align: center;
  }
  .custom-file-input:hover{
    cursor: pointer;
  }
  .loading .custom-file-label::after {
    content: 'Uploading...';
    opacity: 0.5;
    pointer-events: none;
  }
</style>
