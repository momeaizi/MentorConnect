from app.main.utils.exceptions import ValidationError
from loguru import logger


class RegisterUserDTO:
    def __init__(self, data):
        fields = ['username', 'email']

        fields_to_remove = [key for key in data if key not in fields]

        for attribute in fields_to_remove:
            del data[attribute]

        self.data = data


    def validate(self):
        if not self.data.get('username', None):
            raise ValidationError("username is required", "MISSING_USERNAME")

        if not self.data.get('email', None):
            raise ValidationError("A valid email is required", "MISSING_EMAIL")

