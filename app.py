#!/usr/bin/env python3
from flask import jsonify, request
from config import app, db
from config import Order, OrderSchema, orders_schema, order_schema
from flask_cors import CORS
import json
import datetime
from sqlalchemy.sql import func

CORS(app)

@app.route('/')
def get_orders():
    orders_list = Order.query.all()
    result = orders_schema.dump(orders_list)
    return jsonify(result)

# Get cards by date range
@app.route('/date/<bdate>/<edate>')
def get_cards_by_date(bdate, edate):

    qry = Order.query.filter(Order.date <= datetime.datetime.strptime(edate, '%Y-%m-%d')).filter(Order.date >= datetime.datetime.strptime(bdate, '%Y-%m-%d'))
    result = orders_schema.dump(qry)
    result.append({'Total Cards': db.session.query(func.sum(Order.quantity)).filter(Order.date <= datetime.datetime.strptime(edate, '%Y-%m-%d')).filter(Order.date >= datetime.datetime.strptime(bdate, '%Y-%m-%d')).one()[0]})
    return jsonify(result)

# Get Students Names
@app.route('/students')
def get_students():
    targets = [r.target for r in db.session.query(Order.target).distinct()]
    separate = ["Student Fund", "General Fund"]
    return jsonify({'students': [s for s in targets if s not in separate]})

# Get single student with total discretion at the bottom
@app.route('/students/<s_name>')
def get_student_detail(s_name):
    s_orders = Order.query.filter_by(target='Student '+ str(s_name))
    result = orders_schema.dump(s_orders)
    student_name = 'Student '+ str(s_name)
    result.append({'Total Discretion': db.session.query(func.sum(Order.discretion)).filter(Order.target==student_name).one()[0]})
    return jsonify(result)

# Get Merchants Names
@app.route('/merchants')
def get_merchants():
    targets = [r.merchant for r in db.session.query(Order.merchant).distinct()]
    separate = ["Student Fund", "General Fund"]
    return jsonify({'merchants': [s for s in targets if s not in separate]})

# Get single student with total discretion at the bottom
@app.route('/merchants/<m_name>')
def get_merchant_detail(m_name):
    if m_name == "A&W_LIS10%":
        m_name = "A&W/LIS 10% (Sold as LIS Card)"
    m_orders = Order.query.filter_by(merchant= str(m_name))
    result = orders_schema.dump(m_orders)
    student_name = str(m_name)
    result.append({'Total Cards': db.session.query(func.sum(Order.quantity)).filter(Order.merchant==student_name).one()[0]})
    return jsonify(result)

# Get all general fund with total discretion at the bottom
@app.route('/generalfund')
def get_general_fund():
    s_orders = Order.query.filter_by(target='General Fund')
    result = orders_schema.dump(s_orders)
    result.append({'Total Discretion': db.session.query(func.sum(Order.discretion)).filter(Order.target=="General Fund").one()[0]})
    return jsonify(result)

# Get all student fund with total discretion at the bottom
@app.route('/studentfund')
def get_student_fund():
    s_orders = Order.query.filter_by(target='Student Fund')
    result = orders_schema.dump(s_orders)
    result.append({'Total Discretion': db.session.query(func.sum(Order.discretion)).filter(Order.target=="Student Fund").one()[0]})
    return jsonify(result)

# Add order to database from frontend
@app.route('/post_orders', methods=['POST'])
def post_orders():
    order = request.json
    separate = ["Purchaser", "Date", "Target"]

    max_order = db.session.query(func.max(Order.order)).one()
    max_order = max_order[0]
    if max_order is None:
        max_order = 0

    for card in order.keys():
        if card not in separate:
            for single in order[card]:
                submit = Order(purchaser = order["Purchaser"],
                date = datetime.datetime.strptime(order["Date"], '%Y-%m-%d'),
                merchant = card,
                denomination = single['denomination'],
                quantity = single['quantity'],
                amount = single['amount'],
                discretion = single['discretion'],
                target = order["Target"],
                order = int(max_order) + 1)
                db.session.add(submit)
                db.session.commit()
    print("Cards data has been added to data base")
    return jsonify("Data Received")