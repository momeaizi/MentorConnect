from flask import Blueprint, request
from app.main.services.notification_service import create_notif_service , get_notif_by_user_service, see_notification_service
from app.main.utils.decorators import token_required

notification_bp = Blueprint('notification_bp', __name__)


#{ notified_user_id, actor_id, type}
# TODO (remove) this endpoit the notification will be created in other services
@notification_bp.route('/', methods=['POST'])
@token_required
def create_notif(user):
    data = request.json
    return create_notif_service(data)


@notification_bp.route('/')
@token_required
def get_notif_by_user(user):
    return get_notif_by_user_service(user)

@notification_bp.route('/see')
@token_required
def see_notification(user):
    return see_notification_service(user)

