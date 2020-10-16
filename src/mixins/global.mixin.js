export default {
	methods: {
		get_blob(path) {
			return URL.createObjectURL(new Blob([require('fs').readFileSync(path)], {type: 'image/jpeg'}));
		},
		/** Function which checks if provided object is empty  */
		isEmpty(obj) {
			for (let prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					return false;
				}
			}
			return JSON.stringify(obj) === JSON.stringify({});
		},
		uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	}
};
