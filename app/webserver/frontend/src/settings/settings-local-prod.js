// Settings for running the production build 
//  locally (on localhost)

import { version, releaseDate } from './settings-base'

const API_URL      = 'http://localhost:80';
const WS_URL_AI    =   'ws://localhost:80/api/ai'
const WS_URL_LIVE  =   'ws://localhost:80/api/live'
const BASE_POLL_FREQ = 500;

export { version, releaseDate, API_URL, BASE_POLL_FREQ, WS_URL_AI, WS_URL_LIVE }