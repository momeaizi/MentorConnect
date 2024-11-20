from flask import Blueprint
from app.main.services.profile_views_service import ProfileViewsService
from app.main.services.profile_likes_service import ProfilelikesService
from app.main.utils.decorators import token_required
from loguru import logger


profile_bp = Blueprint('profile_bp', __name__)

profile_views_service = ProfileViewsService()
profile_likes_service = ProfilelikesService()


@profile_bp.route('/<int:profile_owner_id>/view', methods=['POST'])
@token_required
def log_profile_view(user, profile_owner_id):
    return profile_views_service.log_profile_view(user['id'], profile_owner_id)


@profile_bp.route('/viewers')
@token_required
def get_profile_views(user):
    return profile_views_service.get_profile_views(user['id'])


@profile_bp.route('/viewed')
@token_required
def get_viewed_profiles(user):
    return profile_views_service.get_viewed_profiles(user['id'])


@profile_bp.route('/liked')
@token_required
def liked_profiles(user, liked_profile_id):
    return profile_likes_service.liked_profiles(user.get('id'))




@profile_bp.route('/<int:liked_profile_id>/like', methods=['POST'])
@token_required
def like_profile(user, liked_profile_id):
    return profile_likes_service.like_profile(user['id'], liked_profile_id)


@profile_bp.route('/<int:unliked_profile_id>/like', methods=['DELETE'])
@token_required
def unlike_profile(user, unliked_profile_id):
    return profile_likes_service.unlike_profile(user['id'], unliked_profile_id)
