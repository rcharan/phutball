#!/bin/bash

# Entrypoint for the API/Backend Docker Container

# Wait, since the database sometimes restarts and
#  isn't ready for migrations even after the
#  container is started. 2 seconds is excessive but
#  tolerable. 200ms is a realistic amount of time,
#  so add a 10x tolerance
sleep 2s

# Do the database migrations
python manage.py migrate

# Launch the server
python manage.py runserver 0.0.0.0:8000