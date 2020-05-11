# Python/Django Installation
FROM python:3.6

# Redirects StdOut
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt .

RUN pip3 install --upgrade pip -r requirements.txt

# File Installation
COPY .  /app/

# For migrations, do: docker-compose run backend python3 manage.py migrate
