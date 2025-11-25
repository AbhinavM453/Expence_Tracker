from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password


class UserSerializers(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True) 
    password = serializers.CharField(write_only=True, min_length=6)
    image = serializers.ImageField(required=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'phone', 'image', 'password']
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if Login.objects.filter(username=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value
    
    
    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        name = validated_data.pop('name')
        phone = validated_data.pop('phone')
        image = validated_data.pop('image', None)
        password = validated_data.pop('password')

        
        login = Login.objects.create(
            username=validated_data['email'],
            password=make_password(password),
            usertype = 'user'
        )

        
        user = User.objects.create(
            login=login,
            name=name,
            email=login.username,  
            phone=phone,
            image=image
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = Login.objects.get(username=data['username'])
        except Login.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password")

        if not check_password(data['password'], user.password):
            raise serializers.ValidationError("Invalid username or password")

        data['user'] = user
        return data
    

class Userprofile(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name','email','phone','image']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("New passwords do not match")
        validate_password(data["new_password"])  
        return data       

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not Login.objects.filter(username=value).exists():
            raise serializers.ValidationError("No user found with this email.")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not Login.objects.filter(username=value).exists():
            raise serializers.ValidationError("No user found with this email.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)         