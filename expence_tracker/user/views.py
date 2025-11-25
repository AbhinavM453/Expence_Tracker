from django.utils import timezone 
from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .authentication import LoginJWTAuthentication
from .models import *
from django.shortcuts import get_object_or_404
from utill.email_service import send_email
from utill.otp_service import generate_otp, get_otp_expiry
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.authtoken.models import Token
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.




class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    
    parser_classes = [MultiPartParser, FormParser] 

    @swagger_auto_schema(
        operation_description="Register a new user with an image",
        request_body=UserSerializers,   
        responses={201: "User registered successfully", 400: "Invalid data"}
    )

    def post(self, request):
        serializer = UserSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    permission_classes  = [AllowAny]
    
    @swagger_auto_schema(
        request_body=LoginSerializer,   
        responses={201: "Login successfully", 400: "Invalid data"}
    )

    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            login = serializer.validated_data['user']

            refresh = RefreshToken()
            refresh['user_id'] = login.id
            refresh['username'] = login.username
            refresh['usertype'] = login.usertype

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "usertype": login.usertype,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    @swagger_auto_schema(
        operation_description="Get logged-in user profile",
        responses={200: Userprofile}
    )

    def get(self, request):
        user = get_object_or_404(User, login=request.user)
        serializer = Userprofile(user)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Update user profile (supports image upload)",
        request_body=Userprofile,
        responses={200: Userprofile, 400: "Invalid data"},
    )

    def patch(self, request):
        user = get_object_or_404(User, login=request.user)
        serializer = Userprofile(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ChangepswView(APIView):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Change user User Passowrd ",
        request_body=ChangePasswordSerializer,
        responses={200: Userprofile, 400: "Invalid data"},
    )

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not check_password(old_password, user.password):
            return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
    

class ForgotPasswordView(APIView):
    permission_classes  = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="Recover The Password",
        request_body=ForgotPasswordSerializer,
        responses={200: Userprofile, 400: "Invalid data"},
    )

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = Login.objects.filter(username=email).first()


            mail_body = f"Your password (hashed) is: {user.password}"

            send_email(
                subject="Forgotten Password",
                body=mail_body,
                to_email=email,
                from_email="abhinavmohan778@gmail.com"
            )
            

            return Response({"message": "Password sent successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            refresh = RefreshToken(refresh_token)
            new_access = refresh.access_token
            return Response({'access': str(new_access)}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'error': 'Invalid or expired refresh token'}, status=status.HTTP_400_BAD_REQUEST)



    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        access_token = request.auth  

        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        
        if access_token:
            BlacklistedAccessToken.objects.get_or_create(token=str(access_token))

        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="Send Otp For Reset Password Passowrd ",
        request_body=PasswordResetRequestSerializer,
        responses={200: Userprofile, 400: "Invalid data"},
    )

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        login = Login.objects.filter(username=email).first()
        if not login:
            return Response({"error": "Email not registered"}, status=status.HTTP_400_BAD_REQUEST)

        
        otp = generate_otp()
        login.reset_token = otp
        login.reset_token_expires_at = get_otp_expiry(10)
        login.save()

        
        mail_body = f"Your password reset OTP is: {otp}\nThis OTP is valid for 10 minutes."
        send_email(
            subject="Password Reset OTP",
            body=mail_body,
            to_email=email,
            from_email="abhinavmohan778@gmail.com"
        )

        return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="Reset  User Passowrd",
        request_body=PasswordResetConfirmSerializer,
        responses={200: Userprofile, 400: "Invalid data"},
    )

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        login = Login.objects.filter(username=email).first()
        if not login:
            return Response({"error": "Email not found"}, status=status.HTTP_400_BAD_REQUEST)

        
        if login.reset_token != otp:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        if not login.reset_token_expires_at or timezone.now() > login.reset_token_expires_at:
            return Response({"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)

        
        login.password = make_password(new_password)
        login.reset_token = None
        login.reset_token_expires_at = None
        login.save()

        return Response({"message": "Password has been reset successfully"}, status=status.HTTP_200_OK)


