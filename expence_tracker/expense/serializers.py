from rest_framework import serializers
from .models import *


class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.name')
    category_name = serializers.CharField(source="category.name", read_only=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = Expense
        fields = "__all__"
        read_only_fields = ['id', 'user', 'created_at']
