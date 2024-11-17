from flask import Blueprint, request
from loguru import logger
from app.db import execute_query
from app.main.utils.decorators import token_required, expect_dto
from app.main.utils.exceptions import ValidationError

notification_bp = Blueprint('notification_bp', __name__)


#post new notification
#{ notified_user_id, actor_id, notification_time}
@notification_bp.route('/', methods=['POST'])
# @expect_dto(RegisterUserDTO, validate=True)
@token_required
def create_notif(data):
    insert_query = f"INSERT INTO notifications ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
    new_notif = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
    return  new_notif

#get notification by  notified user id
@notification_bp.route('/')
# @expect_dto(RegisterUserDTO, validate=True)
@token_required
def get_notif_by_user(user):
    select_query = "SELECT * FROM notifications WHERE notified_user_id = %s"
    notif = execute_query(select_query, params=(user.get('id',None),) ,fetch_all=True)
    return notif

#get, seen to notification by id of notif
@notification_bp.route('/see')
# @expect_dto(RegisterUserDTO, validate=True)
@token_required
def see_notification(user):
    update_query = f"UPDATE notifications SET is_seen = TRUE WHERE notified_user_id = %s"
    updated_notif = execute_query(update_query, params=(user.get('id',None),) ,fetch_all=True)
    return updated_notif
