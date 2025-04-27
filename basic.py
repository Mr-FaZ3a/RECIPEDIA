import aiohttp, requests

ApiKey = "a75d490085ff4cc6a54b797c2e925e8e"
URL = "https://api.spoonacular.com/"

async def request_simple(*args, **kwargs):
    data = args[0]
    endpoint = kwargs.get("endpoint")

    if "autocomplete" in endpoint:  
        return await auto_complete(*args, **kwargs)
    else :
        return await request_recipe(*args, **kwargs)
        
def handleErrorRequest(func):
    async def wrapper(*args, **kwargs):
        data = args[0]
        endpoint = kwargs.get("endpoint")
        title = None

        for key in data.keys():
            data[key] = phrasify(data[key])
            
            title = key 

            if key == "nutrients" :
                data[key] = stringify(data[key])

        try : return await func(data, title, endpoint)
        except requests.RequestException as e : print("Error 1:", e)
        except (KeyError, TypeError, ValueError) as e : print("Error 2:", e)
        except Exception as e : print("Error 3:", e)

        return {}
    
    return wrapper

@handleErrorRequest
async def request_recipe(data, title, endpoint):
    param = dict() 

    match (title) :
        case "nutrients" :
            param = {**data[title]}
        case "cuisine" : 
            param["query"] = data[title]
        case "ingredients" : 
            param = {**data}

    param["apiKey"] = ApiKey
    param["number"] = 3
    
    async with aiohttp.ClientSession() as session:
        async with session.get(URL + endpoint, params=param) as response:
            response.raise_for_status() 

            return await response.json()

@handleErrorRequest
async def auto_complete(data, title, endpoint):
    input = data[title].split(",")[-1]
     
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
