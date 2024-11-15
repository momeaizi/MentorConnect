from flask import current_app as app
from app.main import mail, Message
from loguru import logger
import datetime
import jwt

def generate_verification_token(id):
    payload = {
        "id": id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    }
    return jwt.encode(payload, app.config['JWT_PRIVATE_KEY'], algorithm=app.config['JWT_ALGORITHM'])

def send_verification_email(email, id):
    try:
        logger.info(f"afdsfafsdf {email}")
        token = generate_verification_token(id)
        verification_link = f"http://localhost:5000/api/auth/verify/{token}"
        msg = Message("Email Verification", recipients=[email])
        msg.body = f"Click the link to verify your email: {verification_link}"
        mail.send(msg)
    except e:
        logger.info(f"error: {e}")

