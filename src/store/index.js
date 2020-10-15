import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
	strict: false,
	state: {
		presentations: [],
		activeSlide: 0,
	},
	getters: {
		presentations: state => state.presentations,
		activeSlide: state => state.activeSlide
	},
	actions: {
		async fetchPresentations({state}) {
			state.s = '';
		},
	},
	mutations: {
		setPresentations(state, data) {
			state.presentations = data;
		}
	}
});
