from rest_framework import serializers
from .models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Budget
        fields = [
            'id',
            'name',
            'amount',
            'month',
            'year',
            'description',
            'category',
            'category_name',  
            'user',            
        ]
        read_only_fields = ['user']


