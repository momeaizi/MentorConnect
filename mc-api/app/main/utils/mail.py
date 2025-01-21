from flask import current_app as app
from app.main import mail, Message
from loguru import logger
from urllib.parse import quote
import datetime
import jwt

def generate_verification_token(id):
    payload = {
        "id": id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    }
    return jwt.encode(payload, app.config['JWT_PRIVATE_KEY'], algorithm=app.config['JWT_ALGORITHM'])

def send_verification_email(email, id):
    token = quote(generate_verification_token(id))
    verification_link = f"{app.config['FRONTEND_URL']}/verify-email/{token}"
    body = f"Click the link to verify your email: {verification_link}"
    send_email("Email Verification", body, [email])




def send_email(subject, body, recipients):
    msg = Message(
        subject,
        recipients=recipients,
        body=body,
    )
    mail.send(msg)