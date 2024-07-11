<template>
  <div id="explorer" :style="isFooter=='true'?'height: 68vh':''">
    <div class="header" style="margin: 0">
      <div class="row">
        <div class="block-left text-left">
          <button class="btn btn-link pull-left btn-xpl btn-show-left" variant="link" @click="toggleShowLeft">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </button>
          <button class="btn btn-link btn-xpl btn-xpl-custom" variant="link" @click="modal.createFolder = true">
            <img :src="folderNewIcon" alt="" class="d-sm-none d-md-none d-lg-none d-xl-none">
            <i class="fa fa-plus-circle d-none d-sm-inline" aria-hidden="true"></i>
            <span class="d-none d-sm-inline"> Tạo thư mục</span>
          </button>
          <button class="btn btn-link pull-left btn-xpl d-inline d-sm-none d-md-none d-lg-none btn-xpl-custom" variant="link" @click="showUploadFile()">
            <i class="fa fa-plus-circle d-none d-sm-inline" aria-hidden="true"></i>
            <img :src="uploadIcon" alt="" class="d-sm-none d-md-none d-lg-none d-xl-none">
          </button>
        </div>
        <div class="block-right">
          <button class="btn btn-link pull-left btn-xpl d-none d-sm-inline d-md-inline d-lg-inline" variant="link" @click="showUploadFile()">
            <i class="fa fa-plus-circle d-none d-sm-inline" aria-hidden="true"></i>
            <img :src="uploadIcon" alt="" class="d-sm-none d-md-none d-lg-none d-xl-none">
            <span class="d-none d-sm-inline"> Upload file</span>
          </button>
          <select class="custom-select mb-3 sl-size d-none d-sm-inline d-md-inline d-lg-inline" v-model="classSize">
            <option v-for="(option, index) of sizeOptions" :key="'size' + index" :value="option.value">{{option.text}}</option>
          </select>
          <el-button v-if="isFooter=='true'" type="text" @click="close()" class="btn-close-xpl">X</el-button>
        </div>
      </div>
    </div>
    <div class="body" :style="isFooter=='false'?'height: calc(95vh - 100px)':'height: calc(65vh - 95px)'">
      <div class="block-left" id="folder-tree">
        <folder :path='"/"' :title='"ROOT"' />
      </div>
      <div v-if="isEmpty" class="block-right empty-folder">Thư mục trống</div>
      <div v-else class="block-right" :class="classSize" id="file-grid">
        <file
          v-for="file in files"
          :file="file"
          v-bind:key="file.name"
          @click="selectItem(file)"
          @delete="requestConfirmDeleteAFile(file)"
        />
      </div>
    </div>
    <div class="footer" :class="isFooter=='false'?'height-0':''">
      <div class="right" v-if="isFooter=='true'">
        <el-button type="primary" :class="checkSelect?'':'hidden'" @click="done()" >Chọn ảnh</el-button>
      </div>
    </div>

    <modal id="createFolderModal" :show.sync="modal.createFolder" title="Tạo thư mục" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up m-0">Tạo thư mục</h4>
      <div class="col-12">
        <input type="text" class="form-control" v-model="newFolderName"placeholder="Nhập tên thư mục">
      </div>
      <br>
      <div class="text-right">
        <p-button type="primary" @click="createFolder">Tạo</p-button>
      </div>
    </modal>

    <modal id="deleteFileModal" :show.sync="modal.deleteFile" title="Xóa file" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up m-0">Xóa file</h4>
      <div class="row">
        <div class="col-12">
          <p>Bạn có thật sự muốn xóa {{deleteFiles}} file?</p>
        </div>
      </div>
      <div class="text-right">
        <p-button type="primary" @click="deleteSelectedFiles">Xóa</p-button>
      </div>
    </modal>

    <modal id="deleteFolderModal" :show.sync="modal.deleteFolder" title="Xóa thư mục" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up m-0">Xóa file</h4>
      <div class="row">
        <div class="col-12">
          <p>Bạn có thật sự muốn xóa thư mục {{folderToDelete}}?</p>
        </div>
      </div>
      <div class="text-right">
        <p-button type="primary" @click="deleteFolder">Xóa</p-button>
      </div>
    </modal>

    <modal id="renameFolderModal" :show.sync="modal.renameFolder" title="Đổi tên thư mục" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up m-0">Đổi tên thư mục</h4>
      <div class="col-12">
        <input type="text" class="form-control" v-model="renameFolderName" placeholder="Nhập tên thư mục">
      </div>
      <br>
      <div class="text-right">
        <p-button type="primary" @click="renameFolder">Đổi tên</p-button>
      </div>
    </modal>
    <vue-toast ref="toast"></vue-toast>
  </div>
</template>

<script>
//xpl
import Modal from 'src/components/UIComponents/Modal'

import 'vue-toast/dist/vue-toast.min.css'
import vueToast from 'vue-toast'

import model from './model';
import utils from './utils';
import file from './fileItem.vue'
import folder from './folderItem.vue'
import { Button } from 'element-ui';

window.model = model;

export default {
  name: 'explorer',
  props: {
    isFooter: {
      default: 'true'
    },
    mode: {}
  },
  components: {
    file, folder,
    vueToast,
    ElButton: Button,
    Modal
  },
  data () {
    return {
      files: [],
      folders: [],
      folder: '',
      classSize: 'size-s',
      newFolderName: '',
      renameFolderName: '',
      sizeOptions: [
        { value: 'size-s', text: 'Nhỏ' },
        { value: 'size-m', text: 'Vừa' },
        { value: 'size-l', text: 'Lớn' },
      ],
      filesToDelete: [],
      folderToDelete: null,
      restFiles: [],
      destinationFolder: "",
      selectFolderList: [],
      iframId: "",
      folderNewIcon: require("./assets/images/folder-new.png"),
      uploadIcon: require("./assets/images/upload.png"),
      modal: {
        createFolder: false,
        deleteFile: false,
        deleteFolder: false,
        renameFolder: false
      }
    }
  },
  created() {
    this._data.iframeId = utils.getParam("iframeId");

    utils.bindEvent(window, 'message', function (msg) {
      var payload = {};
      try {
        payload = JSON.parse(msg.data);
      } catch (e) {}
      var data = payload.data || {};
      var iframeId = payload.iframeId || "";
      var event = payload.event || '__NOTHING__';

      if (iframeId && iframeId == (this._data.iframeId || utils.getParam("iframeId"))) {

        if (event == "MODE") {
          this.mode = data;
        }

        if (event == "CLEAR SELECTED FILE") {
          for (var file of this.files) {
            file.selected = false;
          }
        }
      }
    }.bind(this));

    utils.sendMessage('READY');
    this.$root.$on('FolderSelect', data => {
      this.files = data.files;
      this.folder = data.dir;
    });

    this.$root.$on('delete', data => {
      this.folderToDelete = data.path;
      this.modal.deleteFolder = true;
    });

    this.$root.$on('rename', data => {
      this.folder = data.path;
      this.modal.renameFolder = true;
    });
  },
  mounted() {
    const toast = this.$refs.toast.setOptions({
      timeLife: 2000,
      position: 'bottom right',
    });
    window.toast = this.$refs.toast;
  },
  computed: {
    isEmpty() {
      return this.files.length === 0;
    },
    canSelectAll() {
      return this.files.find(f => !f.selected) && this.mode.multiple == true ? true : false;
    },
    canUnselect() {
      return this.files.find(f => f.selected) ? true : false;
    },
    deleteFiles() {
      return this.filesToDelete.length;
    },
    checkSelect() {
      const files = this.files.filter(f => f.selected);
      return files.length;
    },
  },
  methods:  {
    showUploadFile(){
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple = 1;

      input.onchange = _ => {
        for (let file of input.files) {
          let data = new FormData();
          data.append('file', file)
          data.append('folder', this.folder);
          data.append('method', 'uploadFile');
          model.uploadFile(data).then(res => {
            if (!res.code) {
              const newFile = {};
              newFile.name =  res.data[0];
              newFile.time = input.files[0].lastModified;
              newFile.size = input.files[0].size;
              newFile.mime = input.files[0].type;
              this.files = [utils.formatData(this.folder, newFile), ...this.files];
              this.$root.$emit('uploadFilesSuccess');
            } else{
              toast.showToast(res.message, {
                theme: 'error'
              });
            }
          });
        }

      };

      input.click();
    },

    testToastr() {
      toast.showToast("test", {
        theme: 'error'
      });
    },

    getFiles(dir) {
      this.folder = dir;
      model.getDir(dir).then(res => {
        this.files = res.files.map(f => utils.formatData(this.folder, f));
      });
    },
    selectAll() {
      this.files = this.files.map(f => ({...f, selected: true}));
    },
    unselectAll() {
      this.files = this.files.map(f => ({...f, selected: false}));
    },
    selectItem(file) {
      if (this.mode.multiple) {
        file.selected = !file.selected;
      } else {
        if (file.selected) {
          file.selected = false;
        } else {
          for(var f of this.files) {
            f.selected = false;
          }
          file.selected = true;
        }
      }
    },
    deleteSelectedFiles() {
      let self = this;
      model.deleteFiles(this.filesToDelete).then(res => {
        if (!res.code) {
          this.files = this.restFiles;
        }
        self.modal.deleteFile = false;
      });
    },
    closeCreateFolderModal() {
      this.newFolderName = '';
      this.$refs.createFolderModal.hide();
    },
    showRenameFolderModal(f) {
      this.folder = f;
      this.$refs.renameFolderModal.show();
    },
    showMoveFileModal() {
      this.selectFolderList = this.folders.map(f => {
        return {
          value: f,
          text: f ? `/${f}` : "/"
        }
      });
      this.selectFolderList.push({
        value: "",
        text: "/"
      });

      this.destinationFolder = "";
      this.$refs.moveFileModal.show();
    },
    closeMoveFileModal() {
      this.$refs.moveFileModal.hide();
    },
    closeRenameFolderModal() {
      this.$refs.renameFolderModal.hide();
    },
    requestConfirmDeleteSelectedFiles() {
      this.filesToDelete = this.files.filter(f => f.selected).map(f => `${this.folder}/${f.name}`);
      this.restFiles = this.files.filter(f => !f.selected);
      this.modal.deleteFile = true;
    },
    requestConfirmDeleteAFile(file) {
      this.filesToDelete = [`${this.folder}/${file.name}`];
      this.restFiles = this.files.filter(f => f.name !== file.name);
      this.modal.deleteFile = true;
    },
    closeDeleteFileModal() {
      this.modal.deleteFile = false;
    },
    requestConfirmDeleteFolder(folder) {
      this.folderToDelete = folder;
      this.$refs.deleteFolderModal.show();
    },
    deleteFolder() {
      let self = this;
      model.deleteFolder(this.folderToDelete).then(res => {
        if (!res.code) {
          this.$root.$emit('deleteFolder', {
            folderToDelete: this.folderToDelete
          })
        }
        this.modal.deleteFolder = false;
      });
    },
    closeDeleteFolderModal() {
      this.$refs.deleteFolderModal.hide();
    },
    successEvent(file, response) {
      const { code, message, data } = JSON.parse(response);
      if (!code) {
        const newFile = {};
        newFile.name =  data[0];
        newFile.time = file.lastModified;
        newFile.size = file.size;
        newFile.mime = file.type;
        this.files = [...this.files, utils.formatData(this.folder, newFile)];
        this.$root.$emit('uploadFilesSuccess');
      }
    },
    createFolder() {
      let self = this;
      model.createFolder(this.folder + '/' + this.newFolderName).then(res => {
        if (!res.code) {
          this.$root.$emit('createFolder', {
            path: this.folder + '/' + this.newFolderName
          });
          this.newFolderName = '';
          self.modal.createFolder = false;
        } else {
          toast.showToast('Thư mục đã tồn tại', {
            theme: 'error'
          });
        }
      });
    },
    moveFile() {
      var filesToMove = this.files.filter(f => f.selected).map(f => `${this.folder}/${f.name}`);
      var restFiles = this.files.filter(f => !f.selected);
      model.moveFile(filesToMove, this.destinationFolder).then(res => {
        if (!res.code) {
          this.destinationFolder = "";
          this.files = restFiles;
          this.closeMoveFileModal();
        }
        else {
          this.$refs.toast.showToast(res.message, {
            theme: 'error',
          });
        }
      })
    },
    renameFolder() {
      let self = this;
      let parts = this.folder.split('/');
      parts.pop();
      parts.push(this.renameFolderName);
      let newName = parts.join('/');
      model.renameFolder(newName, this.folder).then(res => {
        if (!res.code) {
          let eventData = {
            oldName: this.folder,
            newName: newName,
            newShortName: this.renameFolderName
          };
          this.$root.$emit('renameFolder', eventData);
          this.renameFolderName = '';
          self.modal.renameFolder = false;
        }
        else {
          this.$refs.toast.showToast(res.message, {
            theme: 'error',
          });
        }
      });
    },
    close() {
      this.$emit('eventClose');
    },
    done() {
      let self = this;
      const files = this.files.filter(f => f.selected);
      self.$emit('eventDone', files);
      setTimeout(function () {
        self.files.map(file => file.selected = false);
      }, 2000)
    },
    toggleShowLeft() {
      let x = document.getElementById("folder-tree");
      if (x.className === "block-left") {
        x.className += " show-left";
      } else {
        x.className = "block-left";
      }
    }
  },
}
</script>
<style lang="scss">
  @import './assets/styles/explorer.scss';
  .hidden {
    display: none !important;
  }
  .vue-toast-manager_container {
    z-index: 99999;
  }
  .height-0{
    height: 0px !important;
    padding: 0px;
  }
  .footer{
    padding: 10px 0px !important;
  }
  .footer .right{
    display: block !important;
    position: absolute;
    right: 15px;
  }
  #createFolderModal .modal-title, #uploadFileModal .modal-title, #deleteFileModal .modal-title, #deleteFolderModal .modal-title, #renameFolderModal .modal-title{
    float: left !important;
  }
  .modal-header{
    border-bottom: none;
  }
  .modal-footer{
    border-top: none;
  }
  .modal-body{
    padding: 20px 10px;
  }
  #createFolderModal___BV_modal_footer_, #deleteFileModal___BV_modal_footer_, #deleteFolderModal___BV_modal_footer_, #renameFolderModal___BV_modal_footer_{
    padding: 10px !important;
  }
  .el-form-item__content{
    line-height: normal !important;
  }
  .btn-close-xpl{
    margin-right: 5px !important;
    span{
      color: #ccc;
      font-size: 15px;
    }
  }
</style>
