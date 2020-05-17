from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'live/(?P<game_id>[A-Z0-9]{6})/(?P<player_num>)', consumers.LiveConsumer),
    re_path(r'ai/(?P<game_id>[A-Z0-9]{6})', consumers.AIConsumer),
]
