# Backend/API (Django App)

This directory contains the backend/api. Right now all it does is create games
and log their moves to the database. It is a standardly-structured Django app, plus:
- It also uses `djangorestframework` to simplify the creation of an API and (`django-cors-headers` to allow "Cross-Origin Resource Sharing" (CORS) to permit the React app to access the API)
- An extra folder `game_logic` which contains a small fragment of the underlying game logic and
configuration for construction of the data models and serializers.

## Usage

As discussed in the main README, the backend supports running locally in production mode
(containerized) or in dev mode (uncontainerized). (In addition to running online/remotely in production, of course.) The containerized builds are described in the main readme.

To run uncontainerized, you will need to:
- Clone the repo `https://github.com/rcharan/phutball`
- Install [PostgreSQL](https://www.postgresql.org/) and start it.
- Install the necessary python packages packages: psycopg2 (the python interface to postgres) as well as the django packages (and python 3.6 if you don't have it; 3.7 or 3.8 should be fine but aren't tested). Your choice of the following 3 options:

1. `pip install -r requirements.txt`
2. `conda env create -f environment.yml`
3. `conda install django djangoresetframework django-cors-headers psycopg2`

For the first, you are in charge of managing your pip virtual environments yourself. The second will create a new environment, phutball. Run `conda activate phutball` after doing so
The third is only recommended in the case you wish to add the software to an existing environment, and no promises are made about whether it will work.

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


### More
The [Django Tutorial](https://docs.djangoproject.com/en/3.0/intro/) is pretty good if you are interested in Django.