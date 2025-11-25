from django.db import models
from user.models import User
from django.utils import timezone

# Create your models here.


class Category(models.Model):
    CategoryType=[
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense')
    ]
      
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CategoryType)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
