from flask import Flask, request, jsonify, render_template, redirect
from cs50 import SQL
import requests, aiohttp
from basic import request_simple

app = Flask(__name__)

db = SQL("sqlite:///database.db")

RECIPES = {}
SUG = {}
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/kitchen", methods=["GET", "POST"])
def kitchen():
    return render_template("kitchen.html")

@app.route("/recipes")
def recipes():
    return redirect("/apology")

@app.route("/favorite")
def favorite() :
    return redirect("/apology")


@app.route("/apology")
def apology():
    return render_template("apology.html", code="404", message="This page is not available")

@app.route("/api/data", methods=["POST"])
async def get_data():
    global RECIPES

    endpoints = {
        "ingredients" : "recipes/findByIngredients",
        "nutrients" : "recipes/findByNutrients",
        "cuisine" : "recipes/complexSearch"
    }

    if request.content_type == "application/json":

        data = request.get_json()

        for key, value in data.items():
            if value:
                RECIPES = await request_simple({key : value}, endpoint=endpoints[key])

        return jsonify(RECIPES=RECIPES)
    
@app.route("/api/auto-complete", methods=["POST"])
async def get_completion():
    global SUG

    if request.content_type == "application/json":
        # TODO
        input = request.get_json()

        for key, value in input.items():
            if input.get(key) and key == "ingredients":
                SUG[key] = await request_simple({key : value}, endpoint="/food/ingredients/autocomplete")
            elif input.get(key) and key == "cuisine":
                SUG[key] = await request_simple({key : value}, endpoint="/recipes/autocomplete")

        return jsonify(SUG=SUG)
