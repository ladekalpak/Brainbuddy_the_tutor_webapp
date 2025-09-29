import os
from flask import Blueprint, request, send_from_directory
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from ..extensions import db
from ..models import Report, ContactMessage

api_bp = Blueprint("api", __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif", "webp"}
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@api_bp.get("/health")
def health():
    return {"status": "ok"}

# ---------- Contact / form submission ----------
@api_bp.post("/contact")
def contact():
    data = request.get_json(silent=True) or request.form
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    subject = (data.get("subject") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
        return {"error": "name, email, message are required"}, 400

    cm = ContactMessage(name=name, email=email, subject=subject, message=message)
    db.session.add(cm)
    db.session.commit()
    return {"message": "Message received", "data": cm.to_dict()}, 201

# ---------- File upload (Reports) ----------
@api_bp.post("/reports")
@login_required
def upload_report():
    title = (request.form.get("title") or "").strip()
    description = (request.form.get("description") or "").strip()
    file = request.files.get("file")

    if not title or not file:
        return {"error": "title and file are required"}, 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = request.app.config["UPLOAD_FOLDER"] if hasattr(request, "app") else None
        if upload_folder is None:
            from flask import current_app
            upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)

        save_path = os.path.join(upload_folder, filename)
        # If name collision, add suffix
        base, ext = os.path.splitext(filename)
        counter = 1
        while os.path.exists(save_path):
            filename = f"{base}_{counter}{ext}"
            save_path = os.path.join(upload_folder, filename)
            counter += 1

        file.save(save_path)
        size_bytes = os.path.getsize(save_path)
        content_type = file.mimetype

        report = Report(
            user_id=current_user.id,
            title=title,
            description=description,
            filename=filename,
            content_type=content_type,
            size_bytes=size_bytes,
        )
        db.session.add(report)
        db.session.commit()
        return {"message": "Uploaded", "report": report.to_dict()}, 201

    return {"error": "Unsupported file type"}, 400

@api_bp.get("/reports")
@login_required
def list_reports():
    reports = Report.query.filter_by(user_id=current_user.id).order_by(Report.created_at.desc()).all()
    return {"reports": [r.to_dict() for r in reports]}

@api_bp.get("/reports/<int:report_id>")
@login_required
def get_report(report_id):
    r = Report.query.filter_by(id=report_id, user_id=current_user.id).first_or_404()
    return {"report": r.to_dict()}

@api_bp.get("/reports/<int:report_id>/download")
@login_required
def download_report(report_id):
    from flask import current_app
    r = Report.query.filter_by(id=report_id, user_id=current_user.id).first_or_404()
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], r.filename, as_attachment=True)

@api_bp.delete("/reports/<int:report_id>")
@login_required
def delete_report(report_id):
    from flask import current_app
    r = Report.query.filter_by(id=report_id, user_id=current_user.id).first_or_404()
    # Delete file
    file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], r.filename)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception:
        pass
    # Delete record
    db.session.delete(r)
    db.session.commit()
    return {"message": "Deleted"}
