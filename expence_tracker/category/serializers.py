from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Category
        fields = ['id', 'user', 'name', 'type']