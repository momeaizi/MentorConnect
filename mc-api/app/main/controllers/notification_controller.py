from flask import Blueprint, request
from app.main.services.notification_service import (
    create_notif_service , get_notif_by_user_service,
    see_notification_service, number_of_notification_service)
from app.main.utils.decorators import token_required

notification_bp = Blueprint('notification_bp', __name__)

#{ notified_user_id, actor_id, type}
# TODO (remove) this endpoit the notification will be created in other services
@notification_bp.route('/', methods=['POST'])
# @token_required
def create_notif():
    data = request.json
    return create_notif_service(data)



@notification_bp.route('/', methods=['GET'])
@token_required
def get_notif_by_user(user):
    return get_notif_by_user_service(user)

@notification_bp.route('/see')
@token_required
def see_notification(user):
    user_id = user.get('id', None)
    return see_notification_service(user_id)

@notification_bp.route('/number')
@token_required
def number_of_notification(user):
    return number_of_notification_service(user)
