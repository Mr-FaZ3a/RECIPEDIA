from flask import Flask, request, jsonify, render_template, redirect
from cs50 import SQL
import requests, aiohttp
from basic import request_simple

app = Flask(__name__)

db = SQL("sqlite:///database.db")

RECIPES = {}

@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/kitchen", methods=["GET", "POST"])
def kitchen():
    return render_template("kitchen.html", RECIPES=RECIPES, type="ingredients")  

@app.route("/api/data", methods=["POST"])
async def get_data():
    global RECIPES

    if request.content_type == "application/json":

        data = request.get_json()

        for key, value in data.items():
            if value : 
                RECIPES = await request_simple({key : value})


        return jsonify(RECIPES=RECIPES)
    
@app.route("/api/auto-complete", methods=["POST"])
async def get_completion():
    SUG = {}

    if request.content_type == "application/json":
        # TODO
        input = request.get_json()

        for key, value in input.items():
            if value :
                SUG = await request_simple(value)

        return jsonify(SUG=SUG)