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
              <div class="col-12 px-5 py-2 d-flex">
                <div class="col-6 py-2">
                  <label class="required d-block">Tỉnh/Thành phố</label>
                  <el-select class="px-1" placeholder="Chọn Tỉnh/Thành phố" v-model="form.provinceId">
                    <el-option v-for="prov in provinces" :value="prov.id" :label="prov.name" :key="prov.id"></el-option>
                  </el-select>
                </div>
                
                <div class="col-6 py-2">
                  <label class="required d-block">Quận/Huyện</label>
                  <el-select class="px-1" placeholder="Chọn Quận/Huyện" v-model="form.districtId">
                    <el-option v-for="district in districts" :value="district.id" :key="district.id" :label="district.name"></el-option>
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
        // "wardId": '',
        "manager": "",
        "lat": 0,
        "lng": 0
      },
      centerMap: {
        lat: 10.762622,
        lng: 106.660172,
      },
      location: {
        lat: 10.762622,
        lng: 106.660172,
      },
    };
  },
  computed: {
    ...mapState(["provinces", "districts", "wards"]),
    google: gmapApi
  },
  watch: {
    "form.provinceId"(nVal, oVal) {
      this.form.districtId = "";
      this.getMapCenter()
      this.$store.dispatch("fetchDistricts", nVal);
    },
    "form.districtId"(nVal, oVal) {
      if (nVal) {
        this.getMapCenter()
      }
    },
  },
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch("setPageTitle", "Thêm địa điểm bảo hành");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Tạo",
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
      const array = [(province && province.name) || '', (district && district.name) || '']                //, (ward && ward.name) || ''
      try {
        const res = await this.$store.dispatch('getMapCenter', {
          input: array.filter((a) => a).join(','),
          inputtype: 'textquery',
          fields: 'geometry'
        })

        if (res.candidates && res.candidates.length) {
          this.centerMap = res.candidates[0].geometry.location
          console.log(this.centerMap)
        } else {

        }
      } catch(e) {
        console.log(e)
      }
    },
    async save() {
      try {
        const result = await this.$validator.validateAll();
        console.log(result);
        if (result) {
          const res = await this.$store.dispatch(
            "createWarrantyLocation",
            Object.assign({}, this.form)
          );
          this.$router.push('/warranty-location/' + res.data.id)
          Notification({
            title: "Success",
            message: "Create succeeded",
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
</style>
