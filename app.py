from flask import Flask, request, jsonify, render_template, redirect
from cs50 import SQL

app = Flask(__name__)

db = SQL("sqlite:///database.db")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/kitchen")
def kitchen():
    ingredients = request.args.get("ingredients")
    print(ingredients)

    return render_template("kitchen.html")  

