from django.core.mail import EmailMessage

def send_email(subject, body, to_email, from_email="abhinavmohan778@gmail.com"):
    mail = EmailMessage(
        subject=subject,
        body=body,
        from_email=from_email,
        to=[to_email],
    )
    mail.send(fail_silently=False)
    return True
