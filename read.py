import json
from requests import get


with open("all_data.json") as f:
	data = json.load(f)["data"]


for company in data:
	company_id = company["id"]
	details = get(f"https://global-standard.org{company['link_details']}")

	if details.status_code != 200:
		print(f"ERROR STATUS CODE: {details.status_code}")

	with open(f"details/{company_id}.html", "w") as html_file:
		html_file.write(details.text)

