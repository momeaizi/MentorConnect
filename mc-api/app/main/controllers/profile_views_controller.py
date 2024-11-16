from flask import Blueprint
from app.main.services.profile_views_service import ProfileViewsService

profile_views_bp = Blueprint('profile_views_bp', __name__)
profile_views_service = ProfileViewsService()


@profile_views_bp.route('/<int:profile_owner_id>', methods=['POST'])
def log_profile_view(profile_owner_id):
    return profile_views_service.log_profile_view(1, profile_owner_id)


@profile_views_bp.route('/')
def get_profile_views():
    return profile_views_service.get_profile_views(2)


@profile_views_bp.route('/viewer')
def get_viewed_profiles():
    return profile_views_service.get_viewed_profiles(1)
