# Generate this with ./keygen.sh in this directory
#  May need to do chmod 777 ./keygen.sh first
with open('/app/phutball/config/secret.txt', 'r') as f:
    SECRET_KEY = f.read().strip()

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['157.245.84.245', 'api', 'philosophers.football'] # Should match service name in nginx config

CORS_ORIGIN_ALLOW_ALL = False

CORS_ORIGIN_WHITELIST = (
       'http://www.philosophers.football',
       'http://157.245.84.253',
)

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'db',
        'PORT': '5432',
    }
}

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],
        },
    },
}
