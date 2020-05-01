# Philosopher's Football (Phutball) v0.0 (pre-alpha)

Reinforcement Learning for Phutball (in honor of John Conway). See below for the current way you can play, and stay tuned for more!

## How to Play

This project is currently in pre-alpha. Phutball is a 2-player game that you can currently play locally in your browser. There is currently no AI/Bot to play against (coming soon!). You can find the rules on [wikipedia](https://en.wikipedia.org/wiki/Phutball). The rules are (mostly) enforced by the react app which you can play locally in your browser (see installation below). (They are also enforced by the Django app, but it's ugly, don't do it).

To install the react app: Clone the repository and install the [node package manager](https://www.npmjs.com/get-npm) (npm). Navigate to the react/phutball directory in your terminal. Then run "npm start". A browser window should open with the default location for the node.js server (http://localhost:3000/). If there are any troubles, you may need to change the port (3000 by default). The app is tested on Chrome only.

Gameplay instructions:
- Click on a cell to place a player.
- Click on a button in the "Jumps" section to do the desired jump (see notation below).
- Click on a move in the "History" section to go to the state after that move was made.

Notation:
- The rows are lettered A-B-C-D-E-F-G-H-J-K-L-M-N-O-P (nota bene: there is no "I" column: this is a team sport!) from left to right.
- The columns are numbered 1-19 from left to right. The ball may additionally move to columns 0 or 20, not shown on the board view presently. If the ball ends a move there, the game is over. (the game is also over if the ball ends on rows 1 or 19).
- The placement of a player is denoted as the letter and number of the cell into which it was placed (for example H13).
- A jump is indicated by the sequence of cells through which the ball moves, in order.

Caveats
- The game does not currently check whether the game is over, so you will have to make that determination yourself.

