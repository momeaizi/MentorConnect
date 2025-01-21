class UniqueConstraintError(Exception):
    def __init__(self, field):
        super().__init__(f"Unique constraint violation on {field}")
        self.field = field.split('_')[1]
        self.code = "UNIQUE_CONSTRAINT_VIOLATION"
