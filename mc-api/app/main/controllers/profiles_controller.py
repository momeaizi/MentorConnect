from flask import Blueprint
from app.main.services.profile_views_service import ProfileViewsService
from app.main.services.profile_likes_service import ProfilelikesService

profile_bp = Blueprint('profile_bp', __name__)

profile_views_service = ProfileViewsService()
profile_likes_service = ProfilelikesService()


@profile_bp.route('/<int:profile_owner_id>/view', methods=['POST'])
def log_profile_view(profile_owner_id):
    return profile_views_service.log_profile_view(1, profile_owner_id)


@profile_bp.route('/viewers')
def get_profile_views():
    return profile_views_service.get_profile_views(1)


@profile_bp.route('/viewed')
def get_viewed_profiles():
    return profile_views_service.get_viewed_profiles(1)


@profile_bp.route('/<int:liked_profile_id>/like', methods=['POST'])
def like_user(liked_profile_id):
    return profile_likes_service.like_user(2, liked_profile_id)


@profile_bp.route('/<int:unliked_profile_id>/like', methods=['DELETE'])
def unlike_user(unliked_profile_id):
    return profile_likes_service.unlike_user(2, unliked_profile_id)
