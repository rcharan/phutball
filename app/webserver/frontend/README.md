# Frontend (in ReactJS)

## About
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For more information, see the README in the top level of this repository.

## Usage (standalone)
For the full context of usage, see the top-level README

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
2. `ws.js` provides a connection manager that uses websockets instead. This is for playing against a bot or playing remotely against another human.
2. `App.js` the true entry point for the React app. It contains the client-side routing
3. `settings` a directory with file `settings.js` mirroring `settings-dev.js`. It includes network settings including throttling and where to find the api. Various versions in the directory are for different build configurations (see the top-level README).
4. `gameLogic` directory: pure and essentially functional implementation of the underlying game logic
5. `lander` directory: components for the landing page (single page scroll application)
6. `icons` directory: media, all svg files as used (but also including some illustrator files, why not)
7. `components` directory: a variety of react components for the game (only the API/ConnectionManager is not in this folder). The main entrypoint is `game.js`. The other substantive components doing the heavy lifting of game logic, computation, and rendering are `history.js`, `jump.js`, and `board.js` along with its rendering subcomponent, `square.js`. Other computation is
of course done by the gameLogic files. The other components in this directory are primarily cosmetic/text (instructions, rules, a back button)
8. `structs` directory: some data structures, in particular a generic Vector implementation and
a specialized implementation of trees for computing and dislaying the jumps.

There is also a dockerfile (Dockerfile-dev) and docker-compose file to containerize the frontend, but, as discussed in the top-level README, the use case is limited. It exists for reference only.
 - In particular, it handles a recently (late Mar 2020) created bug in React scripts, in case you want to containerize a React app by itself
 - You could also add this to the top-level docker-compose-dev.yml to run the frontend and api (aka backend) in seperate containers that talk to each other as if they were running in a local dev
 environmenet.
(This dockerfile behaviour is not tested, though I did do it succesfully at some point while developing the full app).

## Logic
The application is generally structured as follows. There is a lander page in `src/lander` that handles game creation in `src/lander/pages/play.js`. During gameplay, the main components are below

### Game
`Game` from `src/components/game.js` is the main entrypoint.

Game stores all the game state including history, moves to be made, and enforces all the game logic. It handles all callbacks from components to do any actions.

### ConnectionManager, LiveConnectionManager, and PlayerSelector

The `Game` component relies on these two components to handle API access.
 - For ai or local play, `Game` always loads blank and uses a `ConnectionManager` from `api.js` to load the information about the game, including whether the game has an ai in it. For ai play, it switches to a `LiveConnectionManager` from `ws.js`.
 - For live games, the entrypoint is a simple `PlayerSelector` component from `src/playerSelector.js`. It checks the game exists, loads the players' names (from the standard HTTP endpoint) and routes them to the page `/live/GAMEID/X` or `/O` appropriately.
 - Upon loading a live game, a `game.js` `Game` component is again loaded, this time relying only on `LiveConnectionManager` from `ws.js` to load the game then open a websocket connection.

The connection managers depend on the `Game`'s `offlineMoveQueue` state to determine what to do as well as information about the game's connection status (e.g. online, offline, waiting to load) and callbacks to either change that connection status or do something such as execute a move or dequeue a move.

In local play (two humans on one computer) the `ConnectionManager` passively attempts to post moves to the server. In ai or live play, the `LiveConnectionManager` is the only way to do a move; moves must go to the server and come back before being executed.

### Board
`Board` from `src/components/board.js` renders the board and jump animations and executes callbacks when the board is clicked to attempt to make a move.

### JumpList
`JumpList` from `src/components/jump.js` renders all the possible jumps and executes callbacks when a jump is hovered (in which case a preview animation is shown) or clicked (in which case an attempt to make the jump is taken)

### History
`History` from `src/components/history.js` renders the history of the game and executes callbacks if a player wants to look back at an earlier state of the game.

### Others
The other components are essentially cosmetic or informative to the player.

## Tutorials
I highly recommend the [React JS Tutorial](https://reactjs.org/tutorial/tutorial.html). You may also want to read about [React Router](https://reacttraining.com/react-router/web/guides/quick-start) to understand the client-side routing.