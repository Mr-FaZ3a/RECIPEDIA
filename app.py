from flask import Flask, request, jsonify, render_template, redirect
from cs50 import SQL
import requests, aiohttp

app = Flask(__name__)

db = SQL("sqlite:///database.db")

URL = "https://api.spoonacular.com/recipes/"

RECIPES = {}

@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/kitchen")
async def kitchen():
    ingredients = request.args.get("ingredients")
    RECIPES = await requests_by_ingredietns(ingredients)
    return render_template("kitchen.html", RECIPES=RECIPES, type="ingredients")  

async def requests_by_ingredietns(ingredients):
    try : 
        param = { 
            "apiKey": "ca3f41f038834995add29d5032f16a23",
            "ingredients": ingredients,
            "number": 10
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(URL + "findByIngredients", params=param) as response: 
                print(response.json())
                response.raise_for_status() 

                return await response.json()
    
    except requests.RequestException as e : 
        raise e
    except (KeyError, TypeError, ValueError) as e :
        pass
    except Exception as e : 
        print(e)

@app.route("/data/api")
def get_data():
    if request.content_type == "application/json":
        print("HELLLO WORLDDDDDDD")
        return jsonify(RECIPES)