import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
	strict: false,
	state: {
		presentations: [],
		activeSlide: 0,
		activeImage: null,
		backgroundImageData: {
			isEnabled: false,
			backgroundImage: 'none'
		}
	},
	getters: {
		presentations: state => state.presentations,
		activeSlide: state => state.activeSlide,
		activeImage: state => state.activeImage,
		backgroundImageData: state => state.backgroundImageData
	},
	actions: {
		async fetchPresentations({state}) {
			state.s = '';
		},
		async setActiveImage({commit}, data) {
			commit('setActiveImage', data);
		},
		async setBackgroundImage({commit}, data) {
			commit('setBackgroundImage', data);
		}
	},
	mutations: {
		setPresentations(state, data) {
			state.presentations = data;
		},
		setActiveImage(state, data) {
			state.activeImage = data;
		},
		setBackgroundImage(state, data) {
			state.backgroundImageData = data;
		}
	}
});
