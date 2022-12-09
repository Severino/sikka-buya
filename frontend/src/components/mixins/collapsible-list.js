export default {
    data() {
        return {
          collapsibleOpenedMap: {},
        };
      },
      methods:{
        toggleCollapsible(id, collapsed) {
          console.log(collapsed)
            this.$set(this.collapsibleOpenedMap, id, !collapsed);
          },
          isCollapsed(id){
            return !this.collapsibleOpenedMap[id] || false
          }
        }

}