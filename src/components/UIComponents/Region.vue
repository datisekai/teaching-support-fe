<template>
  <div>
    <div class="col-xs-12" :class="{'col-sm-6 pull-left p-l-0' : !hasTop}">
      <my-select
        placeholder="Tỉnh/Thành phố"
        class="full-width"
        :attribute="regions"
        v-model="region"
      ></my-select>
    </div>
    <div class="col-xs-12" :class="{'col-sm-6 pull-right p-r-0' : !hasTop, 'm-t-10' : hasTop}">
      <my-select
        placeholder="Quận/Huyện"
        class="full-width"
        :attribute="subRegions"
        v-model="subRegion"
      ></my-select>
    </div>
  </div>
</template>

<script>
  import MySelect from 'src/components/UIComponents/Select'

  export default {
    props: ['regionID', 'subRegionID', 'hasTop'],
    components: {
      MySelect
    },
    async beforeCreate() {
      await this.$store.dispatch('fetchRegion');
      if (this.regionID) {
        await this.$store.dispatch('fetchListSubRegion', this.regionID); 
      }
    },
    data(){
      return {
        region: '',
        subRegion: ''
      }
    },
    computed: {
      regions() {
        let data = this.$store.state.region;
        let arr = {};
        arr.options = [];
        for (let item of data) {
          arr.options.push({
            value: item.id,
            title: item.name
          });
        }
        return arr;
      },
      subRegions() {
        let data = this.$store.state.subRegion;
        let arr = {};
        arr.options = [];
        arr.options.push({
          value: 0,
          title: 'Chọn Quận/huyện'
        });
        for (let item of data) {
          arr.options.push({
            value: item.id,
            title: item.name
          });
        }
        return arr;
      },
    },
    watch: {
      regionID(newValue, oldValue) {
        if (newValue) {
          this.$store.dispatch('fetchListSubRegion', newValue);
          this.region = newValue;
        }
      },
      region(newValue, oldValue) {
        if (newValue) {
          this.$store.dispatch('fetchListSubRegion', newValue);
          this.subRegion = '';
          let self = this;
          this.$emit('input', {
            region: self.region,
            subRegion: self.subRegion,
          });
        }
      },
      subRegionID(newValue, oldValue) {
        this.subRegion = newValue;
      },
      subRegion(newValue, oldValue) {
        let self = this;
        this.$emit('input', {
          region: self.region,
          subRegion: self.subRegion,
        });
      },
    },
    destroyed(){
      this.$store.state.subRegion = [];
      this.region = '';
      this.subRegion = '';
    }
  }
</script>

<style scoped>
  .m-t-10{
    margin-top: 10px;
  }
</style>
