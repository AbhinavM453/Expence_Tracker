from django.db import models
from user.models import User
from category.models import Category   # Import your category model

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=255, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True,  blank=True)  # NEW FIELD

    description = models.TextField(blank=True, null=True)  # NEW FIELD

    month = models.IntegerField()
    year = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'month', 'year')
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.name} - {self.month}/{self.year}"
