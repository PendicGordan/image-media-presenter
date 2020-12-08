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
		},
		async restructureActiveSlide({commit}, data) {
			commit('restructureActiveSlide', data);
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
            state.activeSlide.images[data.uuid] = {
				src: null,
				width: "250",
				rotation: 0,
				positionX: null,
				positionY: null,
				slideId: -1,
				roundFactor: 0,
				x: 0,
				y: 0,
				blurringLevel: 0,
				sepiaLevel: 0,
				saturationLevel: 1,
				invertLevel: 0,
				opacityLevel: 100,
				brightnessLevel: 100,
				contrastLevel: 100,
				isBackgroundImage: null
			};

            for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === state.activeSlide.text) {
					state.slides[i] = state.activeSlide;
					break;
				}
			}
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
			for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === data) {
					state.activeSlide = state.slides[i];
					break;
				}
			}
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
			for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === data.slideId) {
					state.slides[i].images[data.uuid] = data;
					break;
				}
			}
		},
		restructureActiveSlide(state, data) {
			for(let i = state.activeSlide.maxX; i < data.columns; ++i) {
				for(let j = 0; j < data.rows; ++j) {
					const imageUuid = uuid.v4();
					state.activeSlide.images[imageUuid] = {
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
					};
				}
			}

			for(let i = state.activeSlide.maxY; i < data.rows; ++i) {
				for(let j = 0; j < data.columns; ++j) {
					let isDuplicate = false;
					const imageUuid = uuid.v4();
					let activeSlideImagesArray = Object.values(state.activeSlide.images);
					for(let k = 0; k < activeSlideImagesArray.length; ++k) {
						if(activeSlideImagesArray[k].x === j && activeSlideImagesArray[k].y === i) {
							isDuplicate = true;
							break;
						}
					}
					if(isDuplicate) continue;
					state.activeSlide.images[imageUuid] = {
						uuid: imageUuid,
						src: null,
						width: "250",
						x: j,
						y: i,
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
					};
				}
			}

			let restructuredActiveSlide = Object.values(state.activeSlide.images);
			restructuredActiveSlide.forEach(image => {
				if(image.x > data.columns - 1 || image.y > data.rows - 1) {
					delete state.activeSlide.images[image.uuid];
				}
			});

			state.activeSlide.maxX = data.columns;
			state.activeSlide.maxY = data.rows;

			for(let i = 0; i < state.slides.length; ++i) {
				if(state.activeSlide.text === state.slides[i].text) {
					state.slides[i] = state.activeSlide;
					break;
				}
			}
		}
	}
});
