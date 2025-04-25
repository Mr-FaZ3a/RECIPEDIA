import aiohttp, requests

ApiKey = "f2e9be5579ec4a5e82bd7845b377fa0b"

URL = "https://api.spoonacular.com/"

async def request_simple(*args, **kwargs):
    data = args[0]
    endpoint = kwargs.get("endpoint")

    if "autocomplete" in endpoint :  
        return await auto_complete(*args, **kwargs)
    if data.get("nutrients"):
        return await request_nutrients(*args, **kwargs)
    if data.get("ingredients"):
        return await request_ingredients(*args, **kwargs)
    if data.get("cuisine"):
        return await request_cuisine(*args, **kwargs)

#   if data.get("nutrients"):
#       return await request_nutrients(*args, **kwargs)
#   elif data.get("ingredients"):
#       return await request_ingredients(*args, **kwargs)
#   elif data.get("cuisine"):
#       return await request_cuisine(*args, **kwargs)
#   else:
#       return await auto_complete(*args, **kwargs)
        
def handleErrorRequest(func):
    async def wrapper(*args, **kwargs):
        data = args[0]
        endpoint = kwargs.get("endpoint")

        keys = list(data.keys())
        values = list(data.values())

        title = keys[0].title()

        data[keys[0]] = phrasify(data[keys[0]])

        try : return await func(data, title, endpoint)
        except requests.RequestException as e : print("Error 1:", e)
        except (KeyError, TypeError, ValueError) as e : print("Error 2:", e)
        except Exception as e : print("Error 3:", e)

        return {}
    
    return wrapper

@handleErrorRequest
async def request_ingredients(data, title, endpoint):
    param = dict(
        apiKey=ApiKey,
        **data,
        number=10
    )

    async with aiohttp.ClientSession() as session:
        async with session.get(URL + f"findBy{title}", params=param) as response:
            response.raise_for_status() 

            return await response.json()

@handleErrorRequest
async def request_nutrients(data, title, endpoint):
    data = stringify(data["nutrients"])

    param = dict(
        apiKey=ApiKey,
        **data,
        number=10
    )

    async with aiohttp.ClientSession() as session:
        async with session.get(URL + f"/recipes/findBy{title}", params=param) as response:
            response.raise_for_status()

            return await response.json()

@handleErrorRequest
async def request_cuisine(data, title, endpoint): 
    param = dict(
        apiKey=ApiKey,
        **data,
        number=10
    )
    
    async with aiohttp.ClientSession() as session:
        async with session.get(URL + f"/recipes/complexSearch", params=param) as response:
            response.raise_for_status()

            return await response.json()
        
@handleErrorRequest
async def auto_complete(data, title, endpoint):
    input = data[title.lower()].split(",")[-1]
     
    param = dict(
        apiKey=ApiKey,
        query=input,
        number=5
    )

    async with aiohttp.ClientSession() as session:
        async with session.get(URL + endpoint, params = param) as response : 
            response.raise_for_status()

            return await response.json()

def phrasify(input):
    input = input.replace(" ", ",").replace(",,", ",").replace(",,", ",").replace(", ", ",") 
    
    return input

def stringify(value):
    d = value.split(",")
    handle = {
        "=" : "min",
        "<" : "max",
        ">" : "min",
    }
    
    data = {}
    for i in range(len(d)):
        eq = [d[i].find(j) for j in "=<>"]
        p = 1
        
        for j in eq : p *= j
        eq = p
        
        try : assert eq != -1
        except AssertionError : raise ValueError("Invalid input")

        key = handle[d[i][eq]] + d[i][:eq].title()
        data[key] = int(d[i][eq+1:])

    return data


if __name__ == "__main__":
    pass
