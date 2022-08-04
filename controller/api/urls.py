from django.urls import path
from .views import AddressViewSet


urlpatterns = [
    path('addresses/', AddressViewSet.as_view(
        {'get': 'read_all',
        'post': 'create'}),
         name='general_address'),
    path('addresses/<str:uuid>', AddressViewSet.as_view(
        {'get': 'read_one',
        'put': 'update',
        'delete': 'remove'}), 
        name='specific_address'),
]
