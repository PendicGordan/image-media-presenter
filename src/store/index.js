import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import {uuid} from 'vue-uuid';
import * as xlsx from 'json-as-xlsx';

export default new Vuex.Store({
	strict: false,
	state: {
		presentationId: null,
		presentationName: '',
		slides: [],
		activeSlide: null, // {text: 1, images: {}, maxX: 2, maxY: 2},
		activeImage: null,
		backgroundImageData: {
			isEnabled: false,
			backgroundImage: 'none'
		},
        savedImages: {},
		presentationAudio: null,
		presentationModeActive: false,
		autosliding: {
			timeLengthsInSeconds: [
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10
			],
			currentTimeLengthInSeconds: 1,
			autoslideEnabled: false,
			reverse: false,
			playMusic: false
		}
	},
	getters: {
		activeSlide: state => state.activeSlide,
		activeImage: state => state.activeImage,
		backgroundImageData: state => state.backgroundImageData,
		slides: state => state.slides,
		presentationId: state => state.presentationId,
		presentationModeActive: state => state.presentationModeActive,
		autosliding: state => state.autosliding
	},
	actions: {
		async saveSlide({state}, slide) {
			for(let i = 0; i < state.slides.length; ++i) {
				if(slide.text === state.slides[i].text) {
					state.slides[i] = slide;
					return;
				}
			}
			slide.slides.push(slide);
		},
		async savePresentation({commit}) {
			commit('savePresentation');
		},
		async setActiveImage({commit}, data) {
			commit('setActiveImage', data);
		},
		async setBackgroundImage({commit}, data) {
			commit('setBackgroundImage', data);
		},
        async deleteActiveImagedata({commit}, data) {
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
		async deleteSlideFromStore({state, commit}, slideId) {
			if(state.slides.length === 1) {
				return commit('clearPresentationData');
			}
			commit('deleteSlideFromStore', slideId);
			commit('setActiveImage', null);
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
		async setAutosliding({commit}, data) {
			commit('setAutosliding', data);
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
        },
		pickRandomlyPresentationId({commit}) {
			commit('pickRandomlyPresentationId');
		},
		setPresentationName({commit}, name) {
			commit('setPresentationName', name);
		},
		saveCurrentPresentationOnTheDevice() {

		},
		async loadPresentation({state, commit}, presentation) {
			commit('setPresentationName', presentation[1]);
			const slides = JSON.parse(presentation[2]);
			await commit('setSlides', slides);

			if(slides && slides[0])
				state.activeSlide = slides[0];

			commit('setPresentationAudio', JSON.parse(presentation[3]));
			commit('setBackgroundImageData', JSON.parse(presentation[4]));
			commit('setAutosliding', JSON.parse(presentation[5]))
		},
		togglePresentationMode({commit}) {
			commit('togglePresentationMode');
		},
		setCurrentTimeLengthInSeconds({commit}, data) {
			commit('setCurrentTimeLengthInSeconds', data);
		},
		setAutoslideEnabled({commit}, data) {
			commit('setAutoslideEnabled', data);
		},
		setReverse({commit}, data) {
			commit('setReverse', data);
		},
		setPlayMusic({commit}, data) {
			commit('setPlayMusic', data);
		},
		clearPresentationData({commit}) {
			commit('clearPresentationData');
		},
		exchangeImageWithNeighbour({commit}, imageId) {
			commit('exchangeImageWithNeighbour', imageId);
		}
    },
	mutations: {
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
		changeActiveSlide(state, slideId) {
			if(slideId < 1 || slideId > state.slides.length) return;
			console.log(slideId);
			for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === state.activeSlide.text) {
					state.slides[i] = state.activeSlide;
					break;
				}
			}

			for(let i = 0; i < state.slides.length; ++i) {
				if(state.slides[i].text === slideId) {
					state.activeSlide = state.slides[i];
					break;
				}
			}
		},
		createNewSlide(state) {
			const nextSlideId = state.slides.length + 1;
			let maxX = 2, maxY = 2;
			if(state.slides[state.slides.length - 1]) {
				maxX = state.slides[state.slides.length - 1].maxX;
				maxY = state.slides[state.slides.length - 1].maxY;
			}
			state.slides.push({ text: nextSlideId, images: {}, maxX, maxY});
			for(let i = 0; i < maxX; ++i) {
				for(let j = 0; j < maxY; ++j) {
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
		deleteSlideFromStore(state, slideId) {
			state.slides = state.slides.filter(slide => slide.text !== slideId);
			let i = 1;
			state.slides = state.slides.map(slide => {
				slide.text = i;
				i++;
				return slide;
			});
			state.activeSlide = state.slides[slideId - 2] ? state.slides[slideId - 2] : state.slides[slideId - 1];
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
		},
		saveSlide(state, data) {
			state.presentations[data.id] = data;
		},
		savePresentation(state) {
			const presentationUuid = uuid.v4();
			const columns = [
				{ label: 'Id', value: 'id' },
				{ label: 'Name', value: 'name' },// Top level data
				{ label: 'Content', value: 'content' },
				{ label: 'Audio', value: 'audio' },
				{ label: 'Background', value: 'background' },
				{ label: 'Presentation Mode', value: 'presentationMode' }
			];
			const content = [
				{
					id: presentationUuid,
					name: state.presentationName,
					content: JSON.stringify(state.slides),
					background: JSON.stringify(state.backgroundImageData),
					audio: JSON.stringify(state.presentationAudio),
					presentationMode: JSON.stringify(state.autosliding)
				}];

			const settings = {
				sheetName: 'Presentation sheet', // The name of the sheet
				fileName: `${state.presentationName}-${presentationUuid}`, // The name of the spreadsheet
				extraLength: 3, // A bigger number means that columns should be wider
				writeOptions: {} // Style options from https://github.com/SheetJS/sheetjs#writing-options
			};

			const download = true; // If true will download the xlsx file, otherwise will return a buffer

			xlsx(columns, content, settings, download) // Will download the excel file
		},
		pickRandomlyPresentationId(state) {
			state.presentationId = uuid.v4();
		},
		setPresentationName(state, name) {
			state.presentationName = name;
		},
		setBackgroundImageData(state, data) {
			state.backgroundImageData = data;
		},
		setSlides(state, data) {
			state.slides = data;
		},
		togglePresentationMode(state) {
			state.presentationModeActive = !state.presentationModeActive;
		},
		setCurrentTimeLengthInSeconds(state, currentTimeLengthInSeconds) {
			state.autosliding.currentTimeLengthInSeconds = currentTimeLengthInSeconds;
		},
		setAutoslideEnabled(state, autoslideEnabled) {
			state.autosliding.autoslideEnabled = autoslideEnabled;
		},
		setReverse(state, reverse) {
			state.autosliding.reverse = reverse;
		},
		setPlayMusic(state, playMusic) {
			state.autosliding.playMusic = playMusic;
		},
		async setAutosliding(state, autosliding) {
			state.autosliding = autosliding;
		},
		clearPresentationData(state) {
			state.presentationId = null;
			state.presentationName = '';
			state.slides = [];
			state.activeSlide = null; // {text: 1, images: {}, maxX: 2, maxY: 2},
			state.activeImage = null;
			state.backgroundImageData = {
				isEnabled: false,
				backgroundImage: 'none'
			};
			state.presentationAudio = null;
			state.autosliding = {
				timeLengthsInSeconds: [
					1, 2, 3, 4, 5, 6, 7, 8, 9, 10
				],
					currentTimeLengthInSeconds: 1,
					autoslideEnabled: false,
					reverse: false,
					playMusic: false
			}
		},
		exchangeImageWithNeighbour(state, imageId) {
			let selectedImage = state.activeSlide.images[imageId];
			for(const uuid in state.activeSlide.images) {
				if(selectedImage.x + 1 === state.activeSlide.images[uuid].x && selectedImage.y === state.activeSlide.images[uuid].y) {

					state.activeSlide.images[uuid].blurringLevel = [state.activeSlide.images[imageId].blurringLevel, state.activeSlide.images[imageId].blurringLevel = state.activeSlide.images[uuid].blurringLevel][0];
					state.activeSlide.images[uuid].brightnessLevel = [state.activeSlide.images[imageId].brightnessLevel, state.activeSlide.images[imageId].brightnessLevel = state.activeSlide.images[uuid].brightnessLevel][0];
					state.activeSlide.images[uuid].contrastLevel = [state.activeSlide.images[imageId].contrastLevel, state.activeSlide.images[imageId].contrastLevel = state.activeSlide.images[uuid].contrastLevel][0];
					state.activeSlide.images[uuid].invertLevel = [state.activeSlide.images[imageId].invertLevel, state.activeSlide.images[imageId].invertLevel = state.activeSlide.images[uuid].invertLevel][0];
					state.activeSlide.images[uuid].isBackgroundImage = [state.activeSlide.images[imageId].isBackgroundImage, state.activeSlide.images[imageId].isBackgroundImage = state.activeSlide.images[uuid].isBackgroundImage][0];
					state.activeSlide.images[uuid].opacityLevel = [state.activeSlide.images[imageId].opacityLevel, state.activeSlide.images[imageId].opacityLevel = state.activeSlide.images[uuid].opacityLevel][0];
					state.activeSlide.images[uuid].rotation = [state.activeSlide.images[imageId].rotation, state.activeSlide.images[imageId].rotation = state.activeSlide.images[uuid].rotation][0];
					state.activeSlide.images[uuid].roundFactor = [state.activeSlide.images[imageId].roundFactor, state.activeSlide.images[imageId].roundFactor = state.activeSlide.images[uuid].roundFactor][0];
					state.activeSlide.images[uuid].saturationLevel = [state.activeSlide.images[imageId].saturationLevel, state.activeSlide.images[imageId].saturationLevel = state.activeSlide.images[uuid].saturationLevel][0];
					state.activeSlide.images[uuid].sepiaLevel = [state.activeSlide.images[imageId].sepiaLevel, state.activeSlide.images[imageId].sepiaLevel = state.activeSlide.images[uuid].sepiaLevel][0];
					state.activeSlide.images[uuid].width = [state.activeSlide.images[imageId].width, state.activeSlide.images[imageId].width = state.activeSlide.images[uuid].width][0];
					state.activeSlide.images[uuid].src = [state.activeSlide.images[imageId].src, state.activeSlide.images[imageId].src = state.activeSlide.images[uuid].src][0];

					for(let j = 0; j < state.slides.length; ++j) {
						if(state.activeSlide.text === state.slides[j].text) {
							state.slides[j] = state.activeSlide;
							return;
						}
					}
				}
			}

			for(const uuid in state.activeSlide.images) {
				if(selectedImage.x - 1 === state.activeSlide.images[uuid].x && selectedImage.y === state.activeSlide.images[uuid].y) {

					state.activeSlide.images[uuid].blurringLevel = [state.activeSlide.images[imageId].blurringLevel, state.activeSlide.images[imageId].blurringLevel = state.activeSlide.images[uuid].blurringLevel][0];
					state.activeSlide.images[uuid].brightnessLevel = [state.activeSlide.images[imageId].brightnessLevel, state.activeSlide.images[imageId].brightnessLevel = state.activeSlide.images[uuid].brightnessLevel][0];
					state.activeSlide.images[uuid].contrastLevel = [state.activeSlide.images[imageId].contrastLevel, state.activeSlide.images[imageId].contrastLevel = state.activeSlide.images[uuid].contrastLevel][0];
					state.activeSlide.images[uuid].invertLevel = [state.activeSlide.images[imageId].invertLevel, state.activeSlide.images[imageId].invertLevel = state.activeSlide.images[uuid].invertLevel][0];
					state.activeSlide.images[uuid].isBackgroundImage = [state.activeSlide.images[imageId].isBackgroundImage, state.activeSlide.images[imageId].isBackgroundImage = state.activeSlide.images[uuid].isBackgroundImage][0];
					state.activeSlide.images[uuid].opacityLevel = [state.activeSlide.images[imageId].opacityLevel, state.activeSlide.images[imageId].opacityLevel = state.activeSlide.images[uuid].opacityLevel][0];
					state.activeSlide.images[uuid].rotation = [state.activeSlide.images[imageId].rotation, state.activeSlide.images[imageId].rotation = state.activeSlide.images[uuid].rotation][0];
					state.activeSlide.images[uuid].roundFactor = [state.activeSlide.images[imageId].roundFactor, state.activeSlide.images[imageId].roundFactor = state.activeSlide.images[uuid].roundFactor][0];
					state.activeSlide.images[uuid].saturationLevel = [state.activeSlide.images[imageId].saturationLevel, state.activeSlide.images[imageId].saturationLevel = state.activeSlide.images[uuid].saturationLevel][0];
					state.activeSlide.images[uuid].sepiaLevel = [state.activeSlide.images[imageId].sepiaLevel, state.activeSlide.images[imageId].sepiaLevel = state.activeSlide.images[uuid].sepiaLevel][0];
					state.activeSlide.images[uuid].width = [state.activeSlide.images[imageId].width, state.activeSlide.images[imageId].width = state.activeSlide.images[uuid].width][0];
					state.activeSlide.images[uuid].src = [state.activeSlide.images[imageId].src, state.activeSlide.images[imageId].src = state.activeSlide.images[uuid].src][0];

					for(let j = 0; j < state.slides.length; ++j) {
						if(state.activeSlide.text === state.slides[j].text) {
							state.slides[j] = state.activeSlide;
							return;
						}
					}
				}
			}
		}
	}
});
