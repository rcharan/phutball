from channels.routing import ProtocolTypeRouter, URLRouter
import backend.routing

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': URLRouter(backend.routing.websocket_urlpatterns),
})
