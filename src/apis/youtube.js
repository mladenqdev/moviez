import axios from 'axios';

const KEY = 'AIzaSyCWFAUSgtUjz42nsBWCF9WAjCRi7WLwDeE';

export default axios.create({
	baseURL: 'https://www.googleapis.com/youtube/v3',
	params: {
		part: 'snippet',
		type: 'video',
		maxResults: 1,
		key: KEY
	}
});