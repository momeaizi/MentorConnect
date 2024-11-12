class ValidationError(Exception):
    def __init__(self, error, code):
        super().__init__('Validation error')
        self.error = error
        self.code = code
