from flask import Blueprint, request
from app.main.services.interests_service import InterestsService
from app.main.utils.decorators import token_required

interests_bp = Blueprint('interests_bp', __name__)
interests_service = InterestsService()

@interests_bp.route('/')
@token_required
def get_interests(user):
    return interests_service.fetch_interests()

