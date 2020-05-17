from django.urls import re_path
# from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    re_path(r'^api/live/(?P<game_id>[A-Z0-9]{6})/?$', consumers.LiveConsumer),
    re_path(r'^api/ai/(?P<game_id>[A-Z0-9]{6})/?$'                   , consumers.AIConsumer),
]
