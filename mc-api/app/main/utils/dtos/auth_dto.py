from app.main.utils.exceptions import ValidationError
from loguru import logger
import re

class RegisterUserDTO:
    def __init__(self, data):
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        fields_to_remove = [key for key in data if key not in fields]
        for attribute in fields_to_remove:
            del data[attribute]
        self.data = data

    def validate(self):
        username = self.data.get('username', None)
        if not username:
            raise ValidationError("username is required", "MISSING_USERNAME")
        if len(username) > 15:
            raise ValidationError("username must be less than 15 characters", "INVALID_USERNAME_LENGTH")

        first_name = self.data.get('first_name', None)
        if not first_name:
            raise ValidationError("first name is required", "MISSING_FIRST_NAME")
        if len(first_name) > 15:
            raise ValidationError("first name must be less than 15 characters", "INVALID_FIRST_NAME_LENGTH")
        
        last_name = self.data.get('last_name', None)
        if not last_name:
            raise ValidationError("last name is required", "MISSING_LAST_NAME")
        if len(last_name) > 15:
            raise ValidationError("last name must be less than 15 characters", "INVALID_LAST_NAME_LENGTH")
        
        email = self.data.get('email', None)
        if not email:
            raise ValidationError("A valid email is required", "MISSING_EMAIL")
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            raise ValidationError("Invalid email format", "INVALID_EMAIL_FORMAT")

        
        password = self.data.get('password', None)
        if not self.data.get('password', None):
            raise ValidationError("password is required", "MISSING_PASSWORD")
        if not password:
            raise ValidationError("password is required", "MISSING_PASSWORD")
        if len(password) < 8:
            raise ValidationError("password must be more or equale than 8 characters", "INVALID_PASSWORD_LENGTH")

class VerifyAccountDTO:
    def __init__(self, data):
        fields = ['email']
        fields_to_remove = [key for key in data if key not in fields]
        for attribute in fields_to_remove:
            del data[attribute]
        self.data = data

    def validate(self):
        email = self.data.get('email', None)
        
        if not email:
            raise ValidationError("email is required", "MISSING_EMAIL")
        if not len(email):
            raise ValidationError("email must not be empty", "INVALID_EMAIL_LENGTH")


class LoginUserDTO:
    def __init__(self, data):
        fields = ['username', 'password']
        fields_to_remove = [key for key in data if key not in fields]
        for attribute in fields_to_remove:
            del data[attribute]
        self.data = data

    def validate(self):
        username = self.data.get('username', None)
        
        if not username:
            raise ValidationError("username is required", "MISSING_USERNAME")
        if not len(username):
            raise ValidationError("username must not be empty", "INVALID_USERNAME_LENGTH")

        password = self.data.get('password', None)
        if not password:
            raise ValidationError("password is required", "MISSING_PASSWORD")
        if not len(password):
            raise ValidationError("Password must not be empty", "INVALID_PASSWORD_LENGTH")


class ForgotPasswordDTO:
    def __init__(self, data):
        fields = ['email']
        fields_to_remove = [key for key in data if key not in fields]
        for attribute in fields_to_remove:
            del data[attribute]
        self.data = data

    def validate(self):
        email = self.data.get('email', None)
        if not email:
            raise ValidationError("A valid email is required", "MISSING_EMAIL")
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            raise ValidationError("Invalid email format", "INVALID_EMAIL_FORMAT")


class ResetPasswordDTO:
    def __init__(self, data):
        fields = ['new_password']
        fields_to_remove = [key for key in data if key not in fields]
        for attribute in fields_to_remove:
            del data[attribute]
        self.data = data

    def validate(self):
        new_password = self.data.get('new_password', None)
        if not new_password:
            raise ValidationError("password is required", "MISSING_PASSWORD")
        if len(new_password) < 8:
            raise ValidationError("password must be more or equale than 8 characters", "INVALID_PASSWORD_LENGTH")
