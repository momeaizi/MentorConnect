
from datetime import datetime, timedelta
from flask import current_app as app
import uuid
import jwt

def create_custom_access_token(identity):
    headers = {'kid': 'ckxjzeb7c0000z04q9u9d4bt4'}
    
    now = datetime.utcnow()
    payload = {
        **identity,
        "exp": (now + timedelta(days=4)).timestamp(),
        "iat": now.timestamp() - 2,
        "auth_time": now.timestamp() - 2,
        "jti": str(uuid.uuid4()),
        "sub": str(uuid.uuid4()),
        "typ": "Bearer",
    }
    encoded_jwt = jwt.encode(payload, app.config['JWT_PRIVATE_KEY'], algorithm=app.config['JWT_ALGORITHM'], headers=headers)
    
    return encoded_jwt