from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from ..extensions import db
from ..models import User
from email_validator import validate_email, EmailNotValidError

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or request.form
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not name or not email or not password:
        return {"error": "name, email and password are required"}, 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return {"error": "Invalid email"}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "Email already registered"}, 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    login_user(user)  # auto login after register
    return {"message": "Registered successfully", "user": user.to_dict()}, 201

@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or request.form
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return {"error": "Invalid credentials"}, 401

    login_user(user, remember=True)
    return {"message": "Logged in", "user": user.to_dict()}, 200

@auth_bp.post("/logout")
@login_required
def logout():
    logout_user()
    session.clear()
    return {"message": "Logged out"}, 200

@auth_bp.get("/me")
def me():
    if not current_user.is_authenticated:
        return {"user": None}, 200
    return {"user": current_user.to_dict()}, 200
