# Frontend (in ReactJS)

## About
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For more information, see the README in the top level of this repository.

## Usage (standalone)
To run the frontend component in a local development environment you can 
 - Install [Node.js](https://nodejs.org/en/) (which includes the node package manager `npm`)
 - Clone the repo `https://github.com/rcharan/phutball`
 - Navigate to the top directory of the repository in your terminal then to `app/webserver/frontend` (aka here)
 - Install the necessary software with `npm install`
 - Run `npm start`
 - Point your browser to [localhost:3000](http://localhost:3000). Only Chrome desktop is
 supported; see the top-level README.

Alternatively, you can build with `npm build`. In that case, see on the [React site](https://create-react-app.dev/docs/deployment/) to deploy/serve. Likely, instead of doing this
use the full build from the top-level directory using Docker.

You may want to use/test the game without a backend (it will work fine, just in offline mode) or
run the backend in a local development environment or else containerized.

## Organization
In the src directory, there is:
1. `api.js` with two components
	- One handles api calls and serialization/deserialization
	- The other manages the connection asynchrously during the game and shows the user the 
		connection status as well as helpful messages.
2. `App.js` the true entry point for the React app. It contains the client-side routing
3. `settings` a directory with file `settings.js` mirroring `settings-dev.js`. It includes network settings including throttling and where to find the api. Various versions in the directory are for different build configurations (see the top-level README).
4. `gameLogic` directory: pure and essentially functional implementation of the underlying game logic
5. `lander` directory: components for the landing page (single page scroll application)
6. `icons` directory: media, all svg files as used (but also including some illustrator files, why not)
7. `components` directory: a variety of react components for the game (only the API/ConnectionManager is not in this folder). The main entrypoint is `game.js`. The other substantive components doing the heavy lifting of game logic, computation, and rendering are `history.js`, `jump.js`, and `board.js` along with its rendering subcomponent, `square.js`. Other computation is
of course done by the gameLogic files. The other components in this directory are primarily cosmetic/text (instructions, rules, a back button)

There is also a dockerfile (Dockerfile-dev) and docker-compose file to containerize the frontend, but, as discussed in the top-level README, the use case is limited. It exists for reference only.
 - In particular, it handles a recently (late Mar 2020) created bug in React scripts, in case you want to containerize a React app by itself
 - You could also add this to the top-level docker-compose-dev.yml to run the frontend and api (aka backend) in seperate containers that talk to each other as if they were running in a local dev
 environmenet.
(This dockerfile behaviour is not tested, though I did do it succesfully at some point while developing the full app).[]
