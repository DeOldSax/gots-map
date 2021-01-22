import json
from requests import post


params = "?task=xforms_get_items&context=search"
url = "https://www.global-standard.org/find-suppliers-shops-and-inputs/certified-suppliers/database/search"
cookies = {}
payload = {'condition': '', 'order': '', 'limit': 0, 'page': 0, 'pageChanged': 'true'}  

r = post(url+params, data=payload, cookies=cookies)
print(json.dumps(json.loads(r.text), indent=4))

