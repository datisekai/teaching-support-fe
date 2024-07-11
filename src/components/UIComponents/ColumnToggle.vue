<template>
  <div class="update-col-def-btn">
    <el-button @click="updateColDefs">{{$t('el.button.showHideCol')}}</el-button>
    <modal :show.sync="modal.display" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up m-0">{{$t('el.button.showHideCol')}}</h4>
      <div class="row">
        <p-checkbox v-for="f of fieldArrays" :key="f.prop" class="text-left col-md-6" v-model="f.active">
          {{$t(`el.tableHeader.${f.label}`)}}
        </p-checkbox>
      </div>

      <div class="text-right">
        <p-button @click.native="modal.display = false">{{$t('el.button.cancel')}}</p-button>
        <p-button type="primary" @click="resetColDef">{{$t('el.button.apply')}}</p-button>
      </div>
    </modal>
  </div>
</template>
<script>
  import {Button} from 'element-ui'
  import Modal from './Modal'

  export default {
    props: ['value'],
    components: {
      ElButton: Button,
      Modal: Modal,
    },
    data() {
      return {
        modal: {
          display: false
        },
        fieldArrays: this.value
      };
    },
    methods: {
      updateColDefs() {
        this.modal.display = !this.modal.display;
      },
      resetColDef() {
        let columns = this.fieldArrays.filter(f => f.active);
        this.$emit('input', columns);
        this.modal.display = false;
      }
    },
    mounted() {
      this.resetColDef();
    }
  }
</script>

<style lang="scss">
  .update-col-def-btn {
    display: flex;
    height: 100%;
    width: 100%;
    padding: 0 !important;
    align-items: center;
    justify-content: center;
    button.el-button.el-button--default {
      width: calc(100% - 30px);
      height: 40px;
    }
  }
</style>