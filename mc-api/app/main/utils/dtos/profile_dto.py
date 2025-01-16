from app.main.utils.exceptions import ValidationError
import re


class ProfileUpdateDTO:
    def __init__(self, data):
        fields = ['first_name', 'last_name', 'email', 'username', 'bio', 'gender', 'interests', 'latitude', 'longitude', 'birth_date', 'geolocation']
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
            raise ValidationError("first_name is required", "MISSING_FIRST_NAME")
        if len(first_name) > 100:
            raise ValidationError("first_name must be less than 15 characters", "INVALID_FIRST_NAME_LENGTH")
        

        last_name = self.data.get('last_name', None)
        if not last_name:
            raise ValidationError("last_name is required", "MISSING_LAST_NAME")
        if len(last_name) > 100:
            raise ValidationError("last_name must be less than 15 characters", "INVALID_LAST_NAME_LENGTH")
        
        email = self.data.get('email', None)
        if not email:
            raise ValidationError("A valid email is required", "MISSING_EMAIL")
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            raise ValidationError("Invalid email format", "INVALID_EMAIL_FORMAT")

        bio = self.data.get('bio', None)
        if not bio:
            raise ValidationError("bio is required", "MISSING_BIO")
        
        birth_date = self.data.get('birth_date', None)
        if not birth_date:
            raise ValidationError("birth_date is required", "MISSING_BIRTH_DATE")
        
