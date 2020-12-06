import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
	strict: false,
	state: {
		presentations: [],
		slides: [{text: 1, images: {}}, {text: 2, images: {}}],
		activeSlide: 1,
		activeImage: null,
		backgroundImageData: {
			isEnabled: false,
			backgroundImage: 'none'
		},
        savedImages: {}
	},
	getters: {
		presentations: state => state.presentations,
		activeSlide: state => state.activeSlide,
		activeImage: state => state.activeImage,
		backgroundImageData: state => state.backgroundImageData,
		slides: state => state.slides
	},
	actions: {
		async fetchPresentations({state}) {
			state.presentations = '';
		},
		async saveSlide({state}, slide) {

			state.slides.push(slide);
		},
		async setActiveImage({commit}, data) {
			commit('setActiveImage', data);
		},
		async setBackgroundImage({commit}, data) {
			commit('setBackgroundImage', data);
		},
        async saveActiveImageData({commit}, data) {
            commit('saveActiveImageData', data);
        },
        async deleteActiveImageData({commit}, data) {
            commit('deleteActiveImageData', data);
        },
		async assignImageToTheSlide({commit}, data) {
			commit('assignImageToTheSlide', data);
		}
	},
	mutations: {
		setPresentations(state, data) {
			state.presentations = data;
		},
		setActiveImage(state, data) {
			state.activeImage = data;
		},
        saveActiveImageData(state, data) {
			state.backgroundImageData[data.uuid] = data;
		},
        deleteActiveImageData(state, data) {
            delete state.backgroundImageData[data.uuid];
        },
        setBackgroundImage(state, data) {
            state.backgroundImageData = data;
        },
		assignImageToTheSlide(state, data) {
			for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === data.slideId) {
					state.slides[i].images[data.uuid] = data;
					break;
				}
			}
		}
	}
});
