from rest_framework import serializers

from .models import Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('__all__')

    def create(self, validated_data):
        return Address.objects.create(**validated_data)