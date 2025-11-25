from django.db import models
from django.contrib.auth.hashers import make_password

# Create your models here.


class Login(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    usertype = models.CharField(max_length=100)
    password_changed_at = models.DateTimeField(null=True, blank=True)
    reset_token = models.CharField(max_length=255, null=True, blank=True)
    reset_token_expires_at = models.DateTimeField(null=True, blank=True)
    
    is_authenticated = True
    is_anonymous = False
    
    def __str__(self):
        return self.username
    
    def get_username(self):
        return self.username
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)


class User(models.Model):
    login = models.OneToOneField(Login, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    image = models.ImageField(upload_to="uploads/images/")
    created_at = models.DateTimeField(auto_now_add=True)


class BlacklistedAccessToken(models.Model):
    token = models.CharField(max_length=500, unique=True)
    blacklisted_at = models.DateTimeField(auto_now_add=True)