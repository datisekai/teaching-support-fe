<template>
  <div>
    <div class="card card-map">
      <div class="card-header">
        <h4 class="card-title">Full Screen Map</h4>
      </div>
      <div id="map" class="full-screen-map"></div>
    </div>
  </div>
</template>
<script>
import GoogleMapsLoader from 'google-maps';
import { API_KEY } from './API_KEY';

GoogleMapsLoader.KEY = API_KEY;

export default {
  methods: {
    initMap(google) {
      // Regular Map
      const myLatlng = new window.google.maps.LatLng(40.748817, -73.985428);
      const mapOptions = {
        zoom: 8,
        center: myLatlng,
        scrollwheel: false, // we disable de scroll over the map, it is a really annoing when you scroll through page
      };

      const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

      const marker = new window.google.maps.Marker({
        position: myLatlng,
        title: 'Regular Map!',
      });

      marker.setMap(map);
    },
  },
  mounted() {
    GoogleMapsLoader.load((google) => {
      this.initMap(google);
    });
  },
};
</script>
<style>
</style>
