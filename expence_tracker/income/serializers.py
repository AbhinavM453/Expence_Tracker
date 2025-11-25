from rest_framework import serializers
from .models import Income


class IncomeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.name')
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = Income
        fields = "__all__"
        read_only_fields = ['id', 'user', 'created_at']