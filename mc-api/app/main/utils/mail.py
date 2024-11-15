from flask import current_app as app
from app.main import mail
import datetime
import jwt

def generate_verification_token(id):
    payload = {
        "id": id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm=app.config['JWT_ALGORITHM']

def send_verification_email(email, id):
    token = generate_verification_token(id)
    verification_link = f"http://localhost:5000/api/users/verify/{token}"
    msg = Message("Email Verification", recipients=[email])
    msg.body = f"Click the link to verify your email: {verification_link}"
    mail.send(msg)
