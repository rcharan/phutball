// Settings for running the production build 
//  locally (on localhost)

import { version, releaseDate } from './settings-base'

const API_URL      = 'http://philosophers.football';
const WS_URL_AI    =   'ws://philosophers.football/api/ai'
const WS_URL_LIVE  =   'ws://philosophers.football/api/live'
const BASE_POLL_FREQ = 500;

export { version, releaseDate, API_URL, BASE_POLL_FREQ, WS_URL_AI, WS_URL_LIVE }