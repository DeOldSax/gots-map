import glob
import json
from bs4 import BeautifulSoup

company_map = {}

with open("all_data.json") as f:
	companies = json.load(f)["data"]

for company in companies:
	company_map[company["id"]] = dict(name=company["company"], country=company["country"], categories=company["product_categories"])

def get_details(company_id):
	result = dict(operations=[])

	with open(f"details/{company_id}.html") as f:
		content = f.read()

		try:
			soup = BeautifulSoup(content, "html.parser")
			cand = soup.select("span#xFormText-5")
			if cand:
				operations = cand[0].text.replace(" ", "").split(",")
				result["operations"] = operations
		except Exception as e:
			pass

	result["name"] = company_map[company_id]["name"]
	result["country"] = company_map[company_id]["country"]
	result["categories"] = company_map[company_id]["categories"]

	return result


path = "geodata/*.json"
files = glob.glob(path)

datapoints = []

for detail in files:
	with open(detail, "r") as df:
		content = json.loads(df.read())
		try:
			coord = content["results"][0]["geometry"]["location"]
			company_id = detail.replace(".json", "").replace("geodata/", "")
			details = get_details(company_id)
			datapoints.append(dict(
						coords=coord,
						company_id=company_id,
						details=details
						))
		except Exception as e:
			pass

with open("web/data.json", "w") as f:
	f.write(json.dumps(datapoints, indent=4))
