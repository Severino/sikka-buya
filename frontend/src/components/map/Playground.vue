<template>
  <div></div>
</template>

<script>
import L from 'leaflet';
import MapMixin from './mixins/map';
import { concentricCircles } from '../../models/map/geometry';

export default {
  mixins: [MapMixin],
  mounted() {
    function getOptions(color) {
      return {
        value: 2,
        fillOpacity: 1,
        color: '#fff',
        fillColor: color,
      };
    }

    setTimeout(() => {
      const group = concentricCircles([33.691754111077785, 49.68387338274473], {
        radius: 300,
        innerRadius: 0,
        data: [
          [
            [
              [getOptions('#0f0'), getOptions('#f00'), getOptions('#00f')],
              getOptions('#f00'),
              getOptions('#00f'),
            ],

            getOptions('#0ff'),
            getOptions('#ff0'),
          ],
          [
            getOptions('#fff'),
            [getOptions('#0f0'), getOptions('#0f0')],
            // HERE IT IS IN BACKGROUND
            getOptions('#f00'),
          ],
          [
            getOptions('#0ff'),
            [
              getOptions('#0f0'),
              getOptions('#f00'),
              [getOptions('#0f0'), getOptions('#f00'), getOptions('#00f')],
            ],
          ],
        ],
      });
      console.log(group);
      window.group = group;
      group.addTo(this.map);
    }, 10);
  },
};
</script>