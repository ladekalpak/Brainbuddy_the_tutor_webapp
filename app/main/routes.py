from flask import Blueprint

main_bp = Blueprint("main", __name__)

@main_bp.get("/ping")
def ping():
    return {"pong": True}
