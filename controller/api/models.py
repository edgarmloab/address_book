from django.db import models
from uuid import uuid4

# TODO If I was to implement my own User I'd do it as below and save hashed passwords only
# class User(models.Model):
#     username = models.CharField(max_length=30)
#     password = models.CharField(max_length=50)
#     e_mail = models.EmailField(default="example@mail.com")
#     account_active = models.BooleanField(default=False)


class Address(models.Model):
    uuid_id = models.UUIDField(null=False, unique=True, default=uuid4)
    street_address = models.CharField(null=False, max_length=50)
    city = models.CharField(null=False, max_length=30)
    postal_code = models.CharField(null=False, max_length=15)
    country = models.CharField(null=False, max_length=20)
    entry_updated = models.DateTimeField(auto_now_add=True, null=False)
