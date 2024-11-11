from app.main.utils.exceptions import ValidationError

class RegisterUserDTO:
    def __init__(self, data):
        self.username = data.get('username', None)
        self.email = data.get('email', None)

    def validate(self):
        if not self.username:
            raise ValidationError("Username is required and must be at least 3 characters", "MISSING_USERNAME")

        if not self.email:
            raise ValidationError("A valid email is required", "MISSING_EMAIL")

