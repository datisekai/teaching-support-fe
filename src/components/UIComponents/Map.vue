<template lang="html">
  <div class="">
    <div class="row p-0">
      <gmap-autocomplete
        @place_changed="setPlace"
        class="form-control el-input__inner"
        placeholder="Nhập địa điểm..."
      >
      </gmap-autocomplete>
    </div>

    <Gmap-Map style="width: 100%; height: 300px;" :zoom="15" :center="center">
      <Gmap-Marker
        :position="marker.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      ></Gmap-Marker>
      <Gmap-Marker
        v-if="this.place"
        :position="{
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      ></Gmap-Marker>
    </Gmap-Map>
  </div>
</template>

<script>
  import {Select, Option, Button, Tag, Input} from 'element-ui'
  import * as VueGoogleMaps from 'vue2-google-maps'

  export default {
    props: ['value'],
    components: {
      ElSelect: Select,
      ElOption:Option,
      ElButton:Button,
      ElTag:Tag,
      ElInput:Input
    },
    data() {
      return {
        marker: [],
        place: null
      }
    },
    computed: {
      center: {
        get() {
          let self = this;
          self.marker = {
            position: self.value
          }
          return this.value || {
            lat: 10.7546664,
            lng: 106.4150374
          };
        },
        set(value) {}
      },
    },
    methods: {
      setDescription(description) {
        this.description = description;
      },
      setPlace(place) {
        this.place = place;
        this.usePlace(place);
      },
      usePlace(place) {
        if (this.place) {
          this.marker = {
            position: {
              lat: this.place.geometry.location.lat(),
              lng: this.place.geometry.location.lng(),
            }
          }
          this.center = {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng(),
          }
          this.place = null;
        }
      }
    },
    watch: {
      marker(newValue, oldValue) {
        this.$emit('input', newValue.position)
      }
    },
  }
</script>

<style lang="css" scoped>
  .p-0 {
    padding: 0 !important;
  }
  .p-r-0 {
    padding-right: 0 !important;
  }
</style>
