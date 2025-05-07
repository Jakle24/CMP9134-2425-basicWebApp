from config import db


class ImageSearch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    query = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

    def to_json(self):
        return {
            "id": self.id,
            "query": self.query,
            "timestamp": self.timestamp.isoformat(),
        }


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name   = db.Column(db.String(80), unique=False, nullable=False)
    last_name    = db.Column(db.String(80), unique=False, nullable=False)
    email        = db.Column(db.String(120), unique=True, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
        }
    
    class ImageSearch(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        query = db.Column(db.String(255), nullable=False)
        timestamp = db.Column(db.DateTime, default=db.func.now())

    def to_json(self):
        return {
            "id": self.id,
            "query": self.query,
            "timestamp": self.timestamp.isoformat(),
        }
