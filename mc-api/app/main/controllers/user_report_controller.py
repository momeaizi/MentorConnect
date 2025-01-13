from flask import Blueprint
from app.main.utils.decorators import expect_dto
from app.main.utils.decorators import token_required
from app.main.services.user_report_service import UserReportService


user_report_bp = Blueprint('user_report_bp', __name__)

user_report_service = UserReportService()


@user_report_bp.route('/<int:id>/report', methods=['POST'])
@token_required
def report_user(user, id):
    return user_report_service.report_user(user.get('id'), id)

