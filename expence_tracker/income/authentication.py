from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import Token
from user.models import Login
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

class LoginJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id', None)
        if user_id is None:
            raise InvalidToken("Token contained no recognizable user identification")
        
        # Check if token is blacklisted
        jti = validated_token.get('jti')
        if jti and BlacklistedToken.objects.filter(token__jti=jti).exists():
            raise InvalidToken('Token is blacklisted')
            
        try:
            user = Login.objects.get(pk=user_id)
            return user
        except Login.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')
    
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        
        # Check if token is blacklisted
        jti = validated_token.get('jti')
        if jti and BlacklistedToken.objects.filter(token__jti=jti).exists():
            raise InvalidToken('Token is blacklisted')
            
        return self.get_user(validated_token), validated_token
