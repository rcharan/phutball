# Backend/API (Django App)

This directory contains the backend/api. Right now all it does is create games
and log their moves to the database. It is a standardly-structured Django app.
It also uses `djangorestframework` and (`django-cors-headers` to allow "Cross-Origin Resource Sharing (CORS)" i.e. to permit the React app to access the API)

## Usage

If you want to run this Django app standalone (it has no frontend) or generally
create your own Django app, you may find the following helpful (after installing Django)

1. To create a new django project `django-admin startproject phutball`
2. To create a new app in the django project `python manage.py startapp backend`
3. To create database migrations `python manage.py makemigrations`
4. To do database migrations `python manage.py migrate`
5. To run the server `python manage.py runserver`

If you wish to use this app standalone, you will need to modify the settings, in particular
the settings in `phutball/settings_dev` to match your database configuration, and ensure that
permissions are granted to the user and other software (`CORS_ORIGIN_WHITELIST` needs to match
the client, e.g. localhost:3000 for a React App in dev mode with `npm start`) and `ALLOWED_HOSTS`
needs to match the host (`[]` is fine for a local setup).

## More
The [Django Tutorial](https://docs.djangoproject.com/en/3.0/intro/) is pretty good if you are interested in Django.