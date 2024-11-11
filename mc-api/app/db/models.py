class User(Repository):
    def __init__(self, db_connection_pool):
        self.table = 'users'
        self.columns = [
            'userId', 'firstName', 'lastName', 'fullname', 'email', 'password_hash',
            'role', 'avatar', 'created_at', 'updated_at', 'is_verified', 
            'email_verification_code', 'email_verification_expiry', 
            'password_recovery_code', 'password_recovery_expiry', 'tokens', 'registrationDate'
        ]

    def add_user(self, firstName, lastName, fullname, email, password_hash, role="student"):
        """Create a new user"""
        values = (firstName, lastName, fullname, email, password_hash, role, 'default.png', 
                  datetime.utcnow(), datetime.utcnow(), False, None, None, None, None, 0, datetime.utcnow())
        return self.add(self.table, self.columns, values)

    def update_user(self, user_id, updates):
        """Update an existing user"""
        condition = "userId = %s"
        return self.update(self.table, updates, condition, (user_id,))

    def delete_user(self, user_id):
        """Delete a user by ID"""
        condition = "userId = %s"
        return self.delete(self.table, condition, (user_id,))

    def find_user_by_id(self, user_id):
        """Find a user by their ID"""
        return self.find_one(self.table, self.columns, "userId = %s", (user_id,))

    def find_user_by_email(self, email):
        """Find a user by their email"""
        return self.find_one(self.table, self.columns, "email = %s", (email,))

    def find_all_users(self):
        """Find all users"""
        return self.find_all(self.table, self.columns)

    def count_users(self):
        """Count the total number of users"""
        return self.count(self.table)
