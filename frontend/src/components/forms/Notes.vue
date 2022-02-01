<template>
  <div class="notes">
    <div class="button" @click="toggle">
      <CommentIcon />
      <span id="notes-count">{{ notes.length }}</span>
    </div>

    <div class="messages" :class="{ open }">
      <h3>Notizen</h3>

      <div class="history">
        <div class="comment" v-for="note of notes" :key="'note-' + note.id">
          <div class="username">{{ getUserName(note.user) }}</div>
          <p>
            {{ note.text }}
          </p>
        </div>
      </div>

      <textarea v-model="text" cols="30" rows="5"> </textarea>
      <button
        type="button"
        :diabled="disabled"
        class="button"
        @click.stop.prevent="submit"
      >
        Comment
      </button>

      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>


<script>
import CommentIcon from 'vue-material-design-icons/Comment.vue';
import Query from '../../database/query';
export default {
  components: {
    CommentIcon,
  },
  props: {
    property: String,
    propertyId: String,
  },
  data: function () {
    return {
      text: '',
      notes: [],
      open: false,
      error: '',
      disabled: false,
    };
  },
  mounted: function () {
    this.update();
  },
  methods: {
    update() {
      Query.raw(
        `
     { getNotes (property: "${this.property}", propertyId: ${this.propertyId}){
          id,
          user {email, id},
          text,
          time
      }}
      `
      )
        .then((response) => {
          let data = response.data.data.getNotes;
          data = data.map((el) => {
            el.text = decodeURIComponent(el.text).trim();
            return el;
          });
          this.notes = data;
        })
        .catch(function (e) {
          this.error = e;
        });
    },
    submit() {
      this.error = '';
      if (!this.text) {
        this.error = 'Kein Text angegeben';
        return;
      }
      this.disabled = true;
      Query.raw(
        `mutation{
            addNote(text: "${encodeURIComponent(this.text.trim())}", user: ${
          this.user.id
        }, property: "${this.property}", propertyId: "${this.propertyId}")
        }`
      )
        .then(() => {
          this.update();
        })
        .catch((e) => (this.error = e));
    },
    toggle() {
      this.open = !this.open;
    },
    getUserName(user) {
      return user?.email?.split('@')[0] || 'UNKNOWN';
    },
  },
  computed: {
    user: function () {
      return this.$store.state.user || 'UNNAMED';
    },
  },
};
</script>


<style lang="scss" scoped>
.notes {
  position: fixed;
  top: 13vh;
  right: 0;
  z-index: 1000000;
  height: 80vh;

  .button {
    position: relative;
    z-index: 1000;
  }
}

.history {
  overflow-y: auto;
}

.messages {
  .comment {
    margin-bottom: 10px;
  }

  position: absolute;
  overflow-y: auto;
  max-width: 100vw;
  width: 512px;
  max-height: 100%;
  top: 0;
  right: 0;
  max-height: 100%;
  transform: translateX(100%);
  transition: transform 0.3s;
  background-color: white;
  border: 1px solid gray;
  border-right: none;
  padding: 20px;
  box-sizing: border-box;

  box-shadow: 1px 2px 5px rgba($color: #000000, $alpha: 0.2);
}

.messages.open {
  transform: translateX(0);
}

textarea {
  height: 150px !important;
}

.comment {
  padding: 5px 15px;
  border: 1px solid black;
}

.username {
  font-weight: bold;
}

#notes-count {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 3px;
  right: 3px;
  border: 1px solid gray;
  box-sizing: border-box;
  font-weight: bold;
  background-color: white;
  color: gray;
  width: 20px;
  height: 20px;
  border-radius: 10px;
}
</style>