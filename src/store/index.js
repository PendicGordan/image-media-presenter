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
        savedImages: {},
		presentationAudio: null
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
		},
		async setPresentationAudio({commit}, data) {
			commit('setPresentationAudio', data);
		},
        async exchangeImages({state}, data) {
            for(let uuid in state.activeSlide.images) {
                let currentImage = state.activeSlide.images[uuid];
                if(currentImage.x === data.imageCoordinateToExchangeWithX - 1 && currentImage.y === data.imageCoordinateToExchangeWithY - 1) {
                    currentImage.blurringLevel = [state.activeImage.blurringLevel, state.activeImage.blurringLevel = currentImage.blurringLevel][0];
                    state.activeSlide.images[state.activeImage.uuid].blurringLevel = state.activeImage.blurringLevel;
                    currentImage.brightnessLevel = [state.activeImage.brightnessLevel, state.activeImage.brightnessLevel = currentImage.brightnessLevel][0];
                    state.activeSlide.images[state.activeImage.uuid].brightnessLevel = state.activeImage.brightnessLevel;
                    currentImage.contrastLevel = [state.activeImage.contrastLevel, state.activeImage.contrastLevel = currentImage.contrastLevel][0];
                    state.activeSlide.images[state.activeImage.uuid].contrastLevel = state.activeImage.contrastLevel;
                    currentImage.invertLevel = [state.activeImage.invertLevel, state.activeImage.invertLevel = currentImage.invertLevel][0];
                    state.activeSlide.images[state.activeImage.uuid].invertLevel = state.activeImage.invertLevel;
                    currentImage.isBackgroundImage = [state.activeImage.isBackgroundImage, state.activeImage.isBackgroundImage = currentImage.isBackgroundImage][0];
                    state.activeSlide.images[state.activeImage.uuid].isBackgroundImage = state.activeImage.isBackgroundImage;
                    currentImage.opacityLevel = [state.activeImage.opacityLevel, state.activeImage.opacityLevel = currentImage.opacityLevel][0];
                    state.activeSlide.images[state.activeImage.uuid].opacityLevel = state.activeImage.opacityLevel;
                    currentImage.rotation = [state.activeImage.rotation, state.activeImage.rotation = currentImage.rotation][0];
                    state.activeSlide.images[state.activeImage.uuid].rotation = state.activeImage.rotation;
                    currentImage.roundFactor = [state.activeImage.roundFactor, state.activeImage.roundFactor = currentImage.roundFactor][0];
                    state.activeSlide.images[state.activeImage.uuid].roundFactor = state.activeImage.roundFactor;
                    currentImage.saturationLevel = [state.activeImage.saturationLevel, state.activeImage.saturationLevel = currentImage.saturationLevel][0];
                    state.activeSlide.images[state.activeImage.uuid].saturationLevel = state.activeImage.saturationLevel;
                    currentImage.sepiaLevel = [state.activeImage.sepiaLevel, state.activeImage.sepiaLevel = currentImage.sepiaLevel][0];
                    state.activeSlide.images[state.activeImage.uuid].sepiaLevel = state.activeImage.sepiaLevel;
                    currentImage.width = [state.activeImage.width, state.activeImage.width = currentImage.width][0];
                    state.activeSlide.images[state.activeImage.uuid].width = state.activeImage.width;
                    currentImage.src = [state.activeImage.src, state.activeImage.src = currentImage.src][0];
                    state.activeSlide.images[state.activeImage.uuid].src = state.activeImage.src;
                }
            }
        }
    },
	mutations: {
		setPresentations(state, data) {
			state.presentations = data;
		},
		setActiveImage(state, data) {
			state.activeImage = data;
		},
        deleteActiveImageData(state, data) {
            state.activeSlide.images[data.uuid] = {
				uuid: data.uuid,
				src: null,
				width: "250",
				rotation: 0,
				positionX: null,
				positionY: null,
				slideId: -1,
				roundFactor: 0,
				x: data.x,
				y: data.y,
				blurringLevel: 0,
				sepiaLevel: 0,
				saturationLevel: 1,
				invertLevel: 0,
				opacityLevel: 100,
				brightnessLevel: 100,
				contrastLevel: 100,
				isBackgroundImage: { isEnabled: null, backgroundSize: 'cover' }
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
				if(state.slides[i].text === state.activeSlide.text) {
					state.slides[i] = state.activeSlide;
					break;
				}
			}

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
						isBackgroundImage: { isEnabled: null, backgroundSize: 'cover' }
					}
				}
			}
			state.activeSlide = state.slides[state.slides.length - 1];
		},
		saveImage(state, data) {
			for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === data.slideId) {
					state.slides[i].images[data.uuid] = data;
					state.activeSlide.images[data.uuid] = data;
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
						isBackgroundImage: { isEnabled: null, backgroundSize: 'cover' }
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
						isBackgroundImage: { isEnabled: null, backgroundSize: 'cover' }
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
		},
		setPresentationAudio(state, data) {
			state.presentationAudio = data;
		}
	}
});
