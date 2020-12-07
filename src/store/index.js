import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import {uuid} from 'vue-uuid';

export default new Vuex.Store({
	strict: false,
	state: {
		presentations: [],
		slides: [],
		activeSlide: null, // {text: 1, images: {}, maxX: 2, maxY: 2},
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
		},
		async changeActiveSlide({commit}, data) {
			commit('changeActiveSlide', data);
		},
		async createNewSlide({commit}) {
			commit('createNewSlide');
		},
		async saveImage({commit}, data) {
			commit('saveImage', data);
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
		},
		changeActiveSlide(state, data) {
			console.log('slideId', data);
			console.log(state.slides);
			for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === data) {
					console.log('fffffffffffff');
					state.activeSlide = state.slides[i];
					console.log('nnnnnnnnnnnnnn');
					break;
				}
			}
			//const slideId = data;
			/*state.activeSlide = state.slides.filter(slide => slide.text === slideId)[0];
			console.log(state.slides);
			console.log(state.activeSlide);*/
		},
		createNewSlide(state) {
			const nextSlideId = state.slides.length + 1;
			state.slides.push({ text: nextSlideId, images: {}, maxX: 2, maxY: 2});
			for(let i = 0; i < 2; ++i) {
				for(let j = 0; j < 2; ++j) {
					const imageUuid = uuid.v4();
					state.slides[state.slides.length - 1].images[imageUuid] = {
						uuid: imageUuid,
						src: null,
						width: "250",
						x: i,
						y: j,
						rotation: 0,
						positionX: null,
						positionY: null,
						roundFactor: 0,
						blurringLevel: 0,
						sepiaLevel: 0,
						saturationLevel: 1,
						invertLevel: 0,
						opacityLevel: 100,
						brightnessLevel: 100,
						contrastLevel: 100,
						isBackgroundImage: null
					}
				}
			}
			state.activeSlide = state.slides[state.slides.length - 1];
		},
		saveImage(state, data) {
			console.log(state, data);
			for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === data.slideId) {
					state.slides[i].images[data.uuid] = data;
					break;
				}
			}
		}
	}
});
