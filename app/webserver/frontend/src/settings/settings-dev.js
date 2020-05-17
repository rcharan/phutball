//  Settings enable locally running
//  uncontainerized with "npm start" or 
//  containerized with the Dockerfile-dev build
//  companion backend should be a Django app
//   (containerized or not) on localhost:8000

import { version, releaseDate } from './settings-base'

const API_URL      = 'http://localhost:8000';
const WS_URL_AI    =   'ws://localhost:8000/api/ai'
const WS_URL_LIVE  =   'ws://localhost:8000/api/live'
const BASE_POLL_FREQ = 500;

export { version, releaseDate, API_URL, BASE_POLL_FREQ, WS_URL_AI, WS_URL_LIVE }