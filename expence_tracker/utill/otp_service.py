import random
from datetime import timedelta
from django.utils import timezone

def generate_otp(length=6):

    return ''.join([str(random.randint(0, 9)) for _ in range(length)])


def get_otp_expiry(minutes=10):

    return timezone.now() + timedelta(minutes=minutes)
