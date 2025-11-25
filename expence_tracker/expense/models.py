from django.db import models
from user.models import User
from category.models import Category

# Create your models here.




class Expense(models.Model):
    PAYMENT_METHOD_CHOICES = [
    ("CASH", "Cash"),
    ("CARD", "Card"),
    ("UPI", "UPI"),
    ("BANK", "Bank Transfer"),
    ("OTHER", "Other"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    payment_method = models.CharField(max_length=20,choices=PAYMENT_METHOD_CHOICES,default="CASH")
    date = models.DateField()
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
