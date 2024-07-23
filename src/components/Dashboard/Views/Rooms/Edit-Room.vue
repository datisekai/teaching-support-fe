<template lang="html">
  <div>
    <form-card :group="group" v-model="form"> </form-card>

    <!-- <div class="card">
      <div class="card-header">
        <h6 class="title">Debug</h6>
      </div>
      <div class="card-body form-card">
        <div>
          {{ roomState }}
        </div>
        <div>
          {{ enrollStudents }}
        </div>
      </div>
    </div> -->

    <div
      class="card card-attendance"
      :class="{ 'aspect-video': roomState.qr_key }"
      ref="myQRCode"
    >
      <div class="card-header attendance-header">
        <h6 class="title">QR CODE</h6>
        <el-button type="primary" @click="toggleFullScreen"
          >{{ isFullScreen ? "Exit" : "Full" }} Screen
        </el-button>
      </div>
      <div class="card-body form-card">
        <div v-if="roomState.qr_key">
          <h3 class="room-title">{{ roomData.title }}</h3>
          <p class="room-description" v-html="roomData.description"></p>
        </div>
        <div v-if="roomState.qr_key" class="screen-qr">
          <vue-qrcode :value="roomState.qr_key" />
          <div class="screen-players">
            <div
              class="player"
              v-for="(student, index) of enrollStudents"
              :key="index"
            >
              {{ student.code }} - {{ student.name }}
            </div>
          </div>
        </div>
        <div v-if="!roomState.qr_key">
          <p class="room-guide">
            Cập nhật trạng thái sang <b>điểm danh</b> để hiển thị QR điểm danh
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editRoomForm from "./room-edit-form.js";
import FormCard from "src/components/UIComponents/FormCard.vue";
import { Notification, Button } from "element-ui";
import api, { SOCKET_URL } from "src/api/index";
import VueQrcode from "vue-qrcode";
export default {
  components: {
    FormCard,
    Notification,
    VueQrcode,
    ElButton: Button
  },
  data() {
    return {
      form: {},
      group: editRoomForm,
      roomData: {},
      client: null,
      roomColyseus: null,
      roomState: {},
      roomPlayers: [],
      isFullScreen: false,
      enrollStudents: []
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.client = new Colyseus.Client(SOCKET_URL);
    const id = this.$route.params.id;
    // this.$store.dispatch("fetchRoomDetail", id);
    await this.getRoomDetail(id);
    this.joinById();

    this.$store.dispatch("setPageTitle", "Cập nhật trạng thái điểm danh");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Cập nhật",
        type: "primary",
        icon: "",
        callback: this.save
      }
    ]);

    document.addEventListener("fullscreenchange", event => {
      if (!document.fullscreenElement) {
        this.isFullScreen = false;
      }
    });
  },
  methods: {
    toggleFullScreen() {
      const element = this.$refs.myQRCode;

      if (!document.fullscreenElement) {
        element.requestFullscreen();
        this.isFullScreen = true;
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
        this.isFullScreen = false;
      }
    },
    async joinById() {
      const id = this.roomData.room_socket_id;
      try {
        console.log(this.$store.state.user);
        const user = this.$store.state.user;
        const options = {
          code: user.code,
          email: user.email,
          name: user.email,
          qr_key: 1,
          role: "teacher",
          user_id: user.id
        };
        const room = await this.client.joinById(id, options);
        this.listenMessage(room);
        this.roomColyseus = room;
      } catch (error) {
        Notification({
          title: "Error",
          message: error.toString(),
          position: "bottom-right",
          type: "error"
        });
        this.$router.push(`/rooms`);
        console.log(error);
      }
    },
    listenMessage(room) {
      room.onStateChange(state => {
        console.log("the room state has been updated:", state);
        this.roomState = state.data;
        this.form.status = state.data.status;

        let enrollStudents = [];
        state.enrollStudents.forEach(item => {
          enrollStudents.push({
            code: item.code,
            name: item.name,
            userId: item.userId
          });
        });
        this.enrollStudents = enrollStudents;
      });
    },
    async getRoomDetail(id) {
      try {
        const room = await api.get("/api.room/" + id);
        const data = room.data.data;
        this.roomData = data;
        this.form = { status: data.status };
        return room.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async save() {
      try {
        const result = await this.$validator.validateAll();
        if (result) {
          const payload = { status: this.form.status };
          try {
            this.roomColyseus.send("update_status", payload);
            Notification({
              title: "Success",
              message: "Update succeeded",
              position: "bottom-right",
              type: "success"
            });
          } catch (error) {
            Notification({
              title: error.message.toString(),
              message: "Unknown error",
              position: "bottom-right",
              type: "error"
            });
          }
        }
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.screen-qr {
  display: flex;
  align-items: center;
  width: 100%;

  img {
    width: 50%;
  }
}

.screen-players {
  flex: 1;
  padding: 20px;

  .player {
    font-size: 1rem;
  }
}

.room-title {
  text-align: center;
  font-weight: 700;
}

.room-description {
  text-align: center;
  font-size: 1.5rem;
}

.aspect-video {
  aspect-ratio: 16/9;
}

.card-attendance {
  .attendance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.room-guide {
  text-align: center;
  font-size: 1.2rem;
}
</style>
