<template>
  <div></div>
</template>

<script>
import MapMixin from './mixins/map';
import { concentricCircles } from '../../maps/graphics/ConcentricCircles';

export default {
  mixins: [MapMixin],
  mounted() {
    function getOptions(color) {
      return {
        stroke: false,
        // value: 2,
        // color: '#fff',

        fillOpacity: 1,
        fillColor: color,
      };
    }

    let data = [
      {
        data: [
          [
            [getOptions('#0f0'), getOptions('#f00'), getOptions('#00f')],
            getOptions('#f00'),
            getOptions('#00f'),
          ],

          getOptions('#0ff'),
          getOptions('#ff0'),
        ],
      },
      {
        data: [
          getOptions('#fff'),
          [getOptions('#0f0'), getOptions('#0f0')],
          // HERE IT IS IN BACKGROUND
          getOptions('#f00'),
        ],
      },
      // {
      //   data: [
      //     getOptions('#0ff'),
      //     [
      //       getOptions('#0f0'),
      //       getOptions('#f00'),
      //       [getOptions('#0f0'), getOptions('#f00'), getOptions('#00f')],
      //     ],
      //   ],
      // },
    ];

    setTimeout(() => {
      const group = concentricCircles(
        [33.691754111077785, 49.68387338274473],
        data,
        {
          radius: 300,
          innerRadius: 0,
          borderStyle: {
            stroke: true,
            weight: 4,
            color: '#fff',
          },
        }
      );
      window.group = group;
      group.addTo(this.map);
    }, 10);
  },
};
</script>