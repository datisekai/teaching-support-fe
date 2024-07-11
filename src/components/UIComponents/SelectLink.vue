<template lang="html">
  <div class="row">
    <div class="col-sm-6">
      <my-select
        :attribute="listType"
        placeholder="Chọn loại"
        v-model="select_link_type">
      </my-select>
    </div>
    <div class="col-sm-6">
      <el-input
        v-if="select_link_type == 'custom' || !select_link_type"
        autocomplete="off"
        v-model="select_link"
        placeholder="Địa chỉ web..."
      ></el-input>
      <my-select
        v-else-if="select_link_type == 'product'"
        class="full-width"
        placeholder="Chọn sản phẩm"
        :attribute="products"
        v-model="select_link"
      >
      </my-select>
      <my-select
        v-else-if="select_link_type == 'collection'"
        class="full-width"
        placeholder="Chọn nhóm sản phẩm"
        :attribute="collections"
        v-model="select_link"
      >
      </my-select>
      <my-select
        v-else-if="select_link_type == 'article'"
        class="full-width"
        placeholder="Chọn bài viết"
        :attribute="articles"
        v-model="select_link"
      >
      </my-select>
      <my-select
        v-else-if="select_link_type == 'blog'"
        class="full-width"
        placeholder="Chọn nhóm bài viết"
        :attribute="blogs"
        v-model="select_link"
      >
      </my-select>
      <my-select
        v-else-if="select_link_type == 'page'"
        class="full-width"
        placeholder="Chọn trang nội dung"
        :attribute="pages"
        v-model="select_link"
      >
      </my-select>
      <my-select
        v-else-if="select_link_type == 'gallery'"
        class="full-width"
        placeholder="Chọn gallery"
        :attribute="galleries"
        v-model="select_link"
      >
      </my-select>
    </div>
  </div>
</template>

<script>
  import MySelect from 'src/components/UIComponents/Select';
  import {Input, Button, Select } from 'element-ui';
  import { mapState } from 'vuex'

  export default {

    props: ['linkType', 'link'],

    components: {
      MySelect,
      ElInput: Input
    },

    data() {
      return {
        select_link_type: this.linkType,
        select_link: this.link,
        listType: {
          multiple: false,
          options: [
            {
              title: 'Địa chỉ web',
              value: 'custom',
            },
            {
              title: 'Nhóm sản phẩm',
              value: 'collection',
            },
            {
              title: 'Sản phẩm',
              value: 'product',
            },
            {
              title: 'Nhóm bài viết',
              value: 'blog',
            },
            {
              title: 'Bài viết',
              value: 'article',
            },
            {
              title: 'Trang nội dung',
              value: 'page',
            },
            {
              title: 'Gallery',
              value: 'gallery',
            },
          ],
        }
      }
    },
    mounted() {
      this.$store.dispatch('fetchProducts');
      this.$store.dispatch('fetchCollections');
      this.$store.dispatch('fetchArticles');
      this.$store.dispatch('fetchBlogs');
      this.$store.dispatch('fetchPages');
      this.$store.dispatch('fetchGalleries');
    },
    computed: {
      products() {
        let data = this.$store.state.products;
        return this.$util.parseSelect(data);
      },
      collections() {
        let data = this.$store.state.collections;
        return this.$util.parseSelect(data);
      },
      articles() {
        let data = this.$store.state.articles;
        return this.$util.parseSelect(data);
      },
      blogs() {
        let data = this.$store.state.blogs;
        return this.$util.parseSelect(data);
      },
      pages() {
        let data = this.$store.state.pages;
        return this.$util.parseSelect(data);
      },
      galleries() {
        let data = this.$store.state.galleries;
        return this.$util.parseSelect(data);
      }
    },
    watch: {
      select_link_type(value) {
        this.$emit('selectLinkType', value);
      },
      select_link(value) {
        this.$emit('selectLink', value);
      },
      linkType(value) {
        this.select_link_type = value;
      },
      link(value) {
        this.select_link = value;
      }
    }
  }
</script>