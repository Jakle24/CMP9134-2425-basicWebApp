from flask import request, jsonify, Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from config import app, db
from models import Contact, User

from OpenverseAPIClient import OpenverseClient

app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

db.init_app(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})


@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not first_name or not last_name or not email:
        return (
            jsonify({"message": "You must include the first name, last name and email"}),
            400,
        )

    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User created!"}), 201


@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()

    return jsonify({"message": "User updated"}), 200


@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        login_user(user)
        return jsonify({'message': 'Logged in successfully'})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'})

ov_client = OpenverseClient()

@app.route("/search_images", methods=["GET"])
def search_images():
    query = request.args.get("q")
    if not query:
        return jsonify({"error": "Search query is required"}), 400

    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("page_size", 20, type=int)
    license_type = request.args.get("license")
    creator = request.args.get("creator")
    tags = request.args.get("tags")
    if tags:
        tags = tags.split(",")

    try:
        # Get results from OpenverseClient
        results = ov_client.search_images(
            query=query,
            page=page,
            page_size=page_size,
            license_type=license_type,
            creator=creator,
            tags=tags
        )

        # Ensure results is a list
        if isinstance(results, dict) and "results" in results:
            images = results["results"]
        else:
            images = results if isinstance(results, list) else []

        # Always return { "results": [...] }
        return jsonify({"results": images})
    except Exception as e:
        # Log the error for debugging
        print(f"Error in /search_images: {e}")
        return jsonify({"error": "Failed to fetch images", "details": str(e)}), 500


@app.route('/recent_searches', methods=['GET', 'POST', 'DELETE'])
@login_required
def recent_searches():
    if request.method == 'GET':
        return jsonify(current_user.recent_searches)
    elif request.method == 'POST':
        search = request.json.get('search')
        current_user.recent_searches.append(search)
        db.session.commit()
        return jsonify({'message': 'Search saved'})
    elif request.method == 'DELETE':
        current_user.recent_searches = []
        db.session.commit()
        return jsonify({'message': 'Recent searches cleared'})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=5000, debug=True)