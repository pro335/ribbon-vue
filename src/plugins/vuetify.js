import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                tableTextColor: "rgb(58, 58, 64, 0.87)"
            }
        }
    }
});
