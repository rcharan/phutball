# Reinforcement Learning for Phutball (v0.2)

This directory contains the PyTorch implementation of the game used to create and train bots using Deep Reinforcement Learning.

## About
As of version 0.2, there is a minimal working example of a bot. However, it has not been fully trained yet (only about 10,000 moves, with a target on the order of \~1,000,000).

### Architecture
The current implementation of the bot is a residual convolutional neural network with 14 convolutional layers and 3 fully connected layers (including the output). It uses Scaled-Exponential Linear Units for activations, contains one MaxPool layer in the middle (downsampling from 19x15x64 to 5x7x64 then later convolved up to 128 channels. Note: channels last in this notation). Final output uses a Sigmoid layer to obtain a 0-1 value.

The network's output should be interpreted as its estimated probability of winning from the given situation provided that it is its turn to move, and it wins by getting the ball to the righthand side. (See the game rules on [philosophers.football](http://philosophers.football))

The reinforcement learning algorithm used focuses on learning an approximate value function <img src="https://render.githubusercontent.com/render/math?math=\hat{v}(S)">. For each move, the possible resulting states are computed. *Then* the board is turned around to present the opponent's point of view. The bot evaluates the positions and the position with the lowest value is selected (for an on-policy move). This necessitates some changes in the textbook algorithm.

### Training Algorithm: Alternating TD(λ)
Note: there are currently some issues with getting Latex to render in a Github README. This will be ported to a different format in the future.

#### Context
The algorithm is a slight variant on textbook TD(λ) described in [Sutton and Barto](http://incompleteideas.net/book/the-book-2nd.html) (§12.2 in 2ed). In tabular Temporal Difference (TD) learning, a value function <img src="https://render.githubusercontent.com/render/math?math=v"> may be estimated from a policy <img src="https://render.githubusercontent.com/render/math?math=\pi"> by first initializing <img src="https://render.githubusercontent.com/render/math?math=v"> with a random value for each possible state <img src="https://render.githubusercontent.com/render/math?math=S">. Games are played. At time <img src="https://render.githubusercontent.com/render/math?math=t"> the state is <img src="https://render.githubusercontent.com/render/math?math=S_t"> and a move selected by the policy <img src="https://render.githubusercontent.com/render/math?math=\pi"> is made resulting in state <img src="https://render.githubusercontent.com/render/math?math=S_{t+1}">. (I ignore rewards, because in our context there are none). The value function <img src="https://render.githubusercontent.com/render/math?math=v"> is updated so that <img src="https://render.githubusercontent.com/render/math?math=v(S_t)"> is closed to its realized value <img src="https://render.githubusercontent.com/render/math?math=v(S_{t+1})">. In other words, this makes <img src="https://render.githubusercontent.com/render/math?math=v"> consistent with <img src="https://render.githubusercontent.com/render/math?math=\pi">. (<img src="https://render.githubusercontent.com/render/math?math=\pi"> in turn depends on <img src="https://render.githubusercontent.com/render/math?math=v"> in our setup)

The extension to an approximate value function <img src="https://render.githubusercontent.com/render/math?math=\hat{v}"> computed by a neural network is immediate, with the updates done by backpropogation.

In the TD(λ) algorithm, an *elegibility trace* <img src="https://render.githubusercontent.com/render/math?math=z_t"> is used. This is essentially momentum in stochastic gradient descent (SGD) but has a different interpretation. Namely, for example, updates should be made to <img src="https://render.githubusercontent.com/render/math?math=\hat{v}(S_t)"> based on later states <img src="https://render.githubusercontent.com/render/math?math=\hat{v}(S_{t_2})"> because the value of the state <img src="https://render.githubusercontent.com/render/math?math=S_t"> should take into account the value farther into the future than just one move. However, when an off-policy move is made, the trace <img src="https://render.githubusercontent.com/render/math?math=z_t"> is reset to 0.

For further details about standard TD(λ) consult Sutton and Barto

#### Alternating TD(λ)
The unique setup of this game means there is a perfect symmetry between a player and their opponent simply by turning the game around. We can account for this as follows.

Notation:
 - <img src="https://render.githubusercontent.com/render/math?math=\hat{v}"> the approximate value function
 - <img src="https://render.githubusercontent.com/render/math?math=\nabla\hat{v}"> its derivative with respect to the weights evaluated at the appropriate state <img src="https://render.githubusercontent.com/render/math?math=S_t"> and current weights.
 - <img src="https://render.githubusercontent.com/render/math?math=\delta_t"> the temporal difference at step <img src="https://render.githubusercontent.com/render/math?math=t">.
 - <img src="https://render.githubusercontent.com/render/math?math=S_t"> the state at time <img src="https://render.githubusercontent.com/render/math?math=t"> (or <img src="https://render.githubusercontent.com/render/math?math=t+1"> depending on the subscript etc.)
 - <img src="https://render.githubusercontent.com/render/math?math=S_t'"> the state at time <img src="https://render.githubusercontent.com/render/math?math=t"> *with the board turned around*
 - <img src="https://render.githubusercontent.com/render/math?math=w_t"> the weights of the network at time <img src="https://render.githubusercontent.com/render/math?math=t">
 - <img src="https://render.githubusercontent.com/render/math?math=z_t"> the trace (i.e. the momentum)
 - <img src="https://render.githubusercontent.com/render/math?math=\lambda"> the decay of the trace (making the momentum an exponentially weighted moving average)
 - <img src="https://render.githubusercontent.com/render/math?math=\alpha"> the learning rate

The core of the training algorithm consists of looping through the following at time <img src="https://render.githubusercontent.com/render/math?math=t">:
1. Evaluate <img src="https://render.githubusercontent.com/render/math?math=S_{t+1}'"> = argmin <img src="https://render.githubusercontent.com/render/math?math=\hat{v}(S_{t+1}', w_t)">
2. Compute <img src="https://render.githubusercontent.com/render/math?math=\delta_t = 0 + (1 - \hat{v}(S_{t+1}', w_t)) - \hat{v}(S_t, w_t)">
3. Update <img src="https://render.githubusercontent.com/render/math?math=w_{t+1} = w_t + \alpha\delta_t z_t">
4. Update <img src="https://render.githubusercontent.com/render/math?math=z_t = -\lambda z_{t-1} + \nabla\hat{v}(S_{t+1}, w_t)">
5. <img src="https://render.githubusercontent.com/render/math?math=S_{t+1} = S_{t+1}'">

Note carefully the difference between <img src="https://render.githubusercontent.com/render/math?math=S"> the board state as viewed by the bot and <img src="https://render.githubusercontent.com/render/math?math=S'"> the board state viewed by its opponent. Notice also the crucial minus sign in updating the trace. Because the bot will play as its own opponent next, if it overestimated the value <img src="https://render.githubusercontent.com/render/math?math=v(S_t)">, it will next appear as an *underestimate* to the opponent, and so the gradient needs to be reversed.

#### Training Algorithm Details
Training was done with an <img src="https://render.githubusercontent.com/render/math?math=\epsilon">-greedy algorithm for off-policy moves. After an off-policy move, the trace has to be reset. For details about hyperparemeters used in various versions of the models' training, consult the training notes in `model-training.ipynb`.

## Setup

### Colab
The directory is setup to use the `model-training.ipynb` notebook on [Google Colab](colab.research.google.com) for training. Colab conveniently mirrors github notebooks, so you can find it on Colab with this link: [https://colab.research.google.com/github/rcharan/phutball/blob/rl/pytorch-implementation/model-training.ipynb](https://colab.research.google.com/github/rcharan/phutball/blob/rl/pytorch-implementation/model-training.ipynb). Note that in general the rl branch of this repository will have the latest version of the notebook.

### Persistent Storage
Model weights are saved to Google Drive.

### Deployment
This code is mirrored, with slight modifications in `app/api/backend/bots` and the model-weight file used in deployment is copied there as well. That directory handles deployment.

## Directory Structure
All of the relevant files except for `model-training.ipynb` are contained in `./lib`. In there you will find:
 - `pretraining` code to pre-train the model including random board generation (`data.py`, simple supervised-learning training code (`pre_training.py`) and an implementation of fit one cycle to choose the learning rate (`fit_one_cycle.py`). For more context, see the About section above.
 - `models` a directory containing common components to the various model architectures. You can find model architectures in `./lib/model_v1` and `./lib/model_v2`. The first version was discarded due to performance concerns.
 - `arena.py` contains code for evaluation. (There is no loss function to use for train/test loss).
 It contains code to play a bot against another. Currently, RandoTron is used for evaluation, with the metric the win rate versus RandoTron. In the future, non-random bots will be played against older versions of themselves or other architectures; however, a non-deterministic implementation of the bots is not currently used. (Coming soon).
 - `move_selection.py`, `jumps`, and `moves.py` contain the code to take a given board state, compute the possible resulting states after the bot's move as a tensor, turn the board around, and feed the data to the bot for evaluation. (The position it least likes is chosen, since it is looking from its' opponents perspective). Computation of the possible placements is done on-device, and computation of jumps is done on the CPU
 - `off_policy.py` contains an implementation of the epsilon-greedy algorithm for off-policy training
 - `optim.py` contains a variant of the TD(λ) algorithm described in Sutton and Barto.
 - The other files are for testing or are generic utilities.