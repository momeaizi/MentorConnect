from functools import wraps
from flask import request, jsonify
from app.utils.exceptions import ValidationError


def expect_dto(dto_class):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                if not request.is_json:
                    return jsonify({
                        "status": "error",
                        "error": {
                            "message": "Invalid content type. Expected application/json",
                            "code": "EXPECTED_JSON",
                        }
                    }), 400

                data = request.json
                dto_instance = dto_class(data)
                
                # Validate the DTO
                dto_instance.validate()
            except ValidationError as e:
                return jsonify({
                    "status": "error",
                    "error": {
                        "message": e.error,
                        "code": e.code
                    }
                }), 400
            except Exception as e:
                return jsonify({"error": str(e)}), 400

            return func(*args, **kwargs)
        return wrapper
    return decorator

