from flask import Blueprint, jsonify
from app.db.sql_executor import execute_query
from app.main.services.tags_service import TagService
from loguru import logger


tags_bp = Blueprint('tags_bp', __name__)

tag_service = TagService()

@tags_bp.route('/',)
def get_all_tags():
    return tag_service.get_all_tags()
