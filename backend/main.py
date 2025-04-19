from flask import request, jsonify, escape
from config import app, db
from models import Contact
import re

from OpenverseAPIClient import OpenverseClient
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])


@app.route("/contacts", methods=["GET"])
@limiter.limit("10 per minute")
def get_contacts():
    """
    Retrieve all contacts.
    """
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})


@app.route("/create_contact", methods=["POST"])
def create_contact():
    """
    Create a new contact.
    """
    first_name = escape(request.json.get("firstName"))
    last_name = escape(request.json.get("lastName"))
    email = escape(request.json.get("email"))

    if not first_name or not last_name or not email:
        return jsonify({"message": "You must include the first name, last name, and email"}), 400

    # Validate email format
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return jsonify({"message": "Invalid email format"}), 400

    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User created!"}), 201


@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    """
    Update an existing contact.
    """
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    contact.first_name = escape(data.get("firstName", contact.first_name))
    contact.last_name = escape(data.get("lastName", contact.last_name))
    contact.email = escape(data.get("email", contact.email))

    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User updated"}), 200


@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    """
    Delete a contact by ID.
    """
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200


ov_client = OpenverseClient()


@app.route("/search_images", methods=["GET"])
def search_images():
    """
    Endpoint to search for images using the OpenVerse API.
    Query parameters:
    - q: Search query (required)
    - page: Page number (default: 1)
    - page_size: Results per page (default: 20)
    - license: Filter by license type
    - creator: Filter by creator
    - tags: Comma-separated list of tags
    """
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "Search query is required"}), 400

    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("page_size", 20, type=int)

    if page <= 0 or page_size <= 0:
        return jsonify({"error": "Page and page_size must be positive integers"}), 400

    license_type = request.args.get("license")
    creator = request.args.get("creator")

    # Handle tags as a comma-separated list
    tags = request.args.get("tags")
    if tags:
        tags = tags.split(",")

    try:
        results = ov_client.search_images(
            query=query,
            page=page,
            page_size=page_size,
            license_type=license_type,
            creator=creator,
            tags=tags
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(results)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=5000, debug=True)