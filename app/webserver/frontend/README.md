# Frontend (in ReactJS)

## About
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage (standalone)
To run the frontend component solo (without any backend) you can install with `npm install`

Then you can run `npm start` to view the frontend on [http://localhost:3000](localhost:3000).

Alternatively, you can build with `npm build`.

## Organization
In the src directory, there is:
1. `api.js` with two components
	- One handles api calls and serialization/deserialization
	- The other manages the connection asynchrously during the game and shows the user the 
		connection status as well as helpful messages.
2. `App.js` the true entry point for the React app. It contains the client-side routing
3. `settings.js` network settings including throttling and where to find the api. Modify this
for configurations other than the canonical docker-compose build.
4. `gameLogic` directory: pure, essentially functional, implementation of the underlying game logic
5. `lander` directory: components for the landing page (single page scroll application)
6. `icons` directory: media
7. `components` directory: a variety of react components for the game (only the API/ConnectionManager is not in this folder). The main entrypoint is `game.js`. The other substantive components doing the heavy lifting of game logic, computation, and rendering are `history.js`, `jump.js`, and `board.js` and its rendering subcomponent, `square.js`.
