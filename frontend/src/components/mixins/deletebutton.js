
import DynamicDeleteButton from '../layout/DynamicDeleteButton.vue';
export default {
    components: { DynamicDeleteButton },
    data() {
        return {
            deleteButtonActive: false
        }
    },
    mounted() {
        if (!this.remove) console.error("You need to implement a remove method!")
    },
    methods: {
        deleteButtonDisable() {
            this.deleteButtonActive = false;
        },
        deleteButtonEnable() {
            this.deleteButtonActive = true;
        },
        deleteButtonRemove(id) {
            this.remove(id);
            this.enable();
        }
    }
}