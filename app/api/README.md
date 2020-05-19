# Backend/API (Django App)

This directory contains the backend/api. 
## Navigation

The files mentioned below contain the core logic of the application. All the other files not mentioned below handle settings, configuration, building, administration, etc.

The application is structured as a simple Django project with one application, `backend`. See the tutorial links below to understand more about the structure as well as the settings and configurations files.

The main entrypoints are the two API endpoints below.

### Database
`backend/models.py` in provides the data model and the Python interface to the database, and is standard Django code.

The underlying database is PostgreSQL.

### HTTP API Endpoint
The first entrypoint is in `backend/views.py` which handles standard HTTP (PUT, GET, POST) requests with `djangorestframework`. In particular, it provides the API endpoint for:
 - Creating a new game
 - Loading an existing game
 - Posting a new move in local mode (two players on the same computer)

The model is:
 - The client creates a game (PUT) and receives back the game's ID. It then navigates to the page for the game.
 - When arriving at a game page, the client requests the full game history (GET) and loads it.
 - When playing in local mode only, new moves are recorded on the server (POST). The client can 
 play offline since it does not depend on receiving information from the server.

`backend/views.py` in turn depends on `backend/serializers.py` to serialize the data (convert the python representation arising from `models.py` into a JSON representation for the client, or vice-versa)

This component also uses `django-cors-headers` to allow "Cross-Origin Resource Sharing" (CORS) to permit the React app to access the API).

Routing for this component is in `phutball/urls.py`.

To understand more, see the tutorial link below for Djano REST framework.

### Websockets API Endpoint
This endpoint uses `django-channels` to support websocket connections. The entrypoint is `consumers.py` which depends on the models and serializers discussed above. It also imports the bots. It is used for
 - Playing live against another human remotely
 - Playing against a bot.

The model is:
 - Game creation and loading are handled by the standard HTTP API, then a websocket connection is opened.
 - The client checks move legality. When a legal move is made it is sent to the server which distributed the move to all connected clients. Upon receiving the move (either getting it back, for the player making the move, or seeing it the first time, for a human opponent), the client records and displays the move.
 - In the case of bot play, this component also asks the bot for a move and then distributes it.

This component depends on a Redis key-value store.

Routing for this component is in `phutball/routing.py` and `backend/routing.py`

### Testing
For simplicity, testing is only available for the bots and the (standard) HTTP API endpoint. Find it in `backend/tests.py`

### Game Logic
- An extra folder `backend/game_logic` contains a small fragment of the underlying game logic and configuration for construction of the data models and serializers.
- `backend/bots` mirrors and wraps the implementation in the top-level `pytorch-implementation` to provide the bots. See that top-level directory to understand more.

## Usage

As discussed in the main README, the backend supports running locally in production mode
(containerized) or in dev mode (uncontainerized). (In addition to running online/remotely in production, of course.) The containerized builds are described in the main readme.

To run uncontainerized, you will need to:
- Clone the repo `https://github.com/rcharan/phutball`
- Install [PostgreSQL](https://www.postgresql.org/) and start it.
- Install [Redis](https://redislabs.com/) and start it. (You could also use Docker: `docker run -d -p 6379:6379 redis:5`)
- Install the necessary python packages packages: psycopg2 (the python interface to postgres) as well as the django packages (and python 3.6 if you don't have it; 3.7 or 3.8 should be fine but aren't tested) and PyTorch. Your choice of the following 3 options:

1. `pip install -r requirements.txt`
2. `conda env create -f phutball.yml` then `conda activate phutball`
3. `conda install -c pytorch django djangorestframework django-cors-headers psycopg2 channels pytorch` and `pip install channels-redis`

For the first, you are in charge of managing your pip virtual environments yourself. The second will create a new environment, phutball. The third is only recommended in the case you wish to add the software to an existing environment, and no promises are made about whether it will work.

- Navigate in your terminal to the repository and, from its top level, go to `/app/api/`. The following instructions from from this base directory.
- Modify the database settings (`DATABASE`) in `./phutball/config/settings_dev.py` to match
a username and password with access to your postgres database. I find this step to be a bit finnicky; some trial-and-error may be in order.
- Create/migrate the database with `python manage.py migrate` (run from this directory) – note the migrations have already been created (see references below if you are curious)
- Run the server with `python manage.py runserver`

## References

You may find the following a useful reference if you are working on a django project

1. To create a new django project `django-admin startproject phutball`
2. To create a new app in the django project `python manage.py startapp backend`
3. To create database migrations `python manage.py makemigrations`
4. To do database migrations `python manage.py migrate`
5. To run the server `python manage.py runserver`


## Tutorials
The [Django Tutorial](https://docs.djangoproject.com/en/3.0/intro/) is pretty good if you are interested in Django.

Likewise for [Django REST Framework](https://www.django-rest-framework.org/tutorial/quickstart/) and [Django Channels](https://channels.readthedocs.io/en/latest/tutorial/part_1.html)