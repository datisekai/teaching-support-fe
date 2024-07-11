<template lang="html">
  <div class="row">
    <div class="offset-xl-2 col-xl-8 col-md-12">
      <div class="card pb-5">
            <div class="card-header">
              <h6 class="title">Trung tâm bảo hành</h6>
            </div>

            <div class="col-12 px-5 py-2">
              <label class="required">Tên trung tâm</label>
              <el-input type="text" v-model="form.name" validate="required"></el-input>
            </div>

            <div class="row">
              <div class="col-12 px-5 py-2">
                <div class="col-6 py-2" id="province-select">
                  <label class="required d-block">Tỉnh/Thành phố</label>
                  <el-select class="px-1" placeholder="Chọn Tỉnh/Thành phố" v-model="form.provinceId">
                    <el-option v-for="prov in provinces" :value="prov.id" :label="prov.name" :key="prov.id"></el-option>
                  </el-select>
                </div>
                
                <div class="col-6 py-2" id="district-select">
                  <label class="required d-block">Quận/Huyện</label>
                  <el-select class="px-1" placeholder="Chọn Quận/Huyện" v-model="form.districtId">
                    <el-option v-for="district in districts" :value="district.id" :label="district.name" :key="district.id"></el-option>
                  </el-select>
                </div>
              </div>
            </div>

            <div class="col-12 px-5 py-2">
              <label>Bản đồ</label>
             <GmapMap
                :center="{lat: centerMap.lat, lng: centerMap.lng}"
                :zoom="12"
                map-type-id="terrain"
                @click="changeLocation"
                style="height: 300px"
              >
                <GmapMarker
                  :position="google && new google.maps.LatLng(location.lat, location.lng)"
                  :clickable="true"
                  :draggable="true"
                  @position_changed="updateMarker"
                />
              </GmapMap>
            </div>

            <div class="col-12 px-5 py-2">
              <label class="required">Địa chỉ</label>
              <el-input type="text" v-model="form.address"></el-input>
            </div>

            <div class="col-12 px-5 py-2">
              <label class="required">Người phụ trách</label>
              <el-input type="text" v-model="form.manager"></el-input>
            </div>

            <div class="col-12 px-5 py-2">
              <label class="required">Số điện thoại</label>
              <el-input type="text" v-model="form.phone"></el-input>
            </div>

            <div class="col-12 px-5 py-2">
              <label class="required">Email</label>
              <el-input type="email" v-model="form.email"></el-input>
            </div>
      </div>
    </div>
  </div>

</template>

<script>
// import locationForm from './location-form.js'
import FormCard from "src/components/UIComponents/FormCard.vue";
import { Select, Input, Option, Radio, Notification } from "element-ui";
import { mapState } from "vuex";
import {gmapApi} from 'vue2-google-maps'

export default {
  components: {
    FormCard,
    Notification,
    ElInput: Input,
    ElSelect: Select,
    ElOption: Option,
  },
  data() {
    return {
      form: {
        "name": "",
        "phone": "",
        "address": "",
        "email": "",
        "provinceId": '',
        "districtId": '',
        "manager": "",
        "lat": 0,
        "lng": 0
      },
      centerMap: {
        lat: 0,
        lng: 0
      },
      location: {
        lat: 0,
        lng: 0,
      },
    };
  },
  computed: {
    ...mapState(["provinces", "districts", "wards"]),
    locationDetail() {
      const detail = this.$store.state.warrantyLocationDetail;
      return detail;
    },
    google: gmapApi
  },
  watch: {
    "form.provinceId"(nVal, oVal) {
      if (oVal) {
        this.form.districtId = "";
        this.getMapCenter()
      }
      this.$store.dispatch("fetchDistricts", nVal);
    },
    "form.districtId"(nVal, oVal) {
      if (oVal) {
        this.getMapCenter()
      }
    },
    locationDetail(nVal, oVal) {
      if (nVal.id) {
        this.form = Object.assign({}, nVal);
        this.location.lat = this.form.lat;
        this.location.lng = this.form.lng;
        this.centerMap.lat = this.form.lat;
        this.centerMap.lng = this.form.lng;
      }
    },
  },
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch("fetchWarrantyLocationDetail", id);
    this.$store.dispatch("setPageTitle", "warrantyLocation");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Cập nhật",
        type: "primary",
        icon: "",
        callback: this.save,
      },
    ]);
  },
  methods: {
    changeLocation(position) {
      this.location.lat = position.latLng.lat()
      this.location.lng = position.latLng.lng()
      this.updateMarker(position.latLng)
    },
    updateMarker(position) {
      this.form.lat = position.lat()
      this.form.lng = position.lng()
    },
    async getMapCenter() {
      const province = this.provinces.find((p) => p.id === this.form.provinceId)
      const district = this.districts.find((p) => p.id === this.form.districtId)
      const array = [(province && province.name) || '', (district && district.name) || '']
      try {
        console.log('---->')
        const res = await this.$store.dispatch('getMapCenter', {
          input: array.filter((a) => a).join(','),
          inputtype: 'textquery',
          fields: 'geometry'
        })
        if (res.candidates && res.candidates.length) {
          this.centerMap = res.candidates[0].geometry.location
        } else {

        }
      } catch(e) {
        console.log(e)
      }
    },
    async save() {
      try {
        const result = await this.$validator.validateAll();
        if (result) {
          await this.$store.dispatch(
            "updateWarrantyLocation",
            Object.assign({}, this.form)
          );
          Notification({
            title: "Success",
            message: "Update succeeded",
            position: "bottom-right",
            type: "success",
          });
        }
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
#province-select, #district-select {
  display: inline-block;
}
</style>
