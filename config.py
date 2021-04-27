from flask import Flask, jsonify, request, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, Date
import os
import datetime
from flask_marshmallow import Marshmallow
import pandas as pd

"""App Config"""

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'orders.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)
ma = Marshmallow(app)

"""App Database"""

@app.cli.command('db_create')
def db_create():
    db.create_all()
    print('Databases created')

@app.cli.command('db_drop')
def db_drop():
    db.drop_all()
    print('Databases dropped')

# @app.cli.command('db_seed')
# def db_seed():
#     jon = Order(purchaser = "Jon",
#                 date = datetime.date(2020, 3, 20),
#                 merchant = 'Fareway',
#                 denomination = 5,
#                 quantity = 10,
#                 amount = 10*5,
#                 discretion = 10*5*0.01,
#                 target = "Student Eric",
#                 order = 1)

#     hiep = Order(purchaser = "Hiep",
#                 date = datetime.date(2021, 4, 14),
#                 merchant = 'Casey',
#                 denomination = 10,
#                 quantity = 15,
#                 amount = 10*15,
#                 discretion = 10*15*0.01,
#                 target = "General Fund",
#                 order = 2)

#     db.session.add(jon)
#     db.session.add(hiep)
#     db.session.commit()
#     print('Databases seeded')

"""Database Models"""

class Order(db.Model):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key = True)
    purchaser = Column(String)
    date = Column(Date)
    merchant = Column(String)
    denomination = Column(Integer)
    quantity = Column(Integer)
    amount = Column(Integer)
    discretion = Column(Float)
    target = Column(String)
    order = Column(Integer)

class OrderSchema(ma.Schema):
    class Meta:
        fields = ('id', 'purchaser', 'date', 'merchant', 'denomination', 'quantity', 'amount', 'discretion', 'target', 'order')

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
PORT = int(os.environ.get('PORT', 5000))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT, debug=False)