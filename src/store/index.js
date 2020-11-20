import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
	strict: false,
	state: {
		presentations: [],
		activeSlide: 0,
		activeImage: null,
	},
	getters: {
		presentations: state => state.presentations,
		activeSlide: state => state.activeSlide,
		activeImage: state => state.activeImage
	},
	actions: {
		async fetchPresentations({state}) {
			state.s = '';
		},
		async setActiveImage({commit}, data) {
			commit('setActiveImage', data);
		}
	},
	mutations: {
		setPresentations(state, data) {
			state.presentations = data;
		},
		setActiveImage(state, data) {
			console.log('ac', data);
			state.activeImage = data;
		}
	}
});
