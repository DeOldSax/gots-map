import glob
from requests import get
from bs4 import BeautifulSoup


url = "https://maps.googleapis.com/maps/api/geocode/json?address="
API_KEY = ""

path = "details/*.html"
files = glob.glob(path)

for detail in files:
	with open(detail, "r") as df:
		content = df.read()
		soup = BeautifulSoup(content, "html.parser")

		address = ""

		for index in [21, 23, 25, 28, 29]:
			field = soup.select(f"span#xFormText-{index}")
			if field:
				address += field[0].text.replace(",", "+").replace(" ", "").strip() + "+"
				address = address.replace("++", "+")

		company_id = detail.replace(".html", "").replace("details/", "")
		print(f"{company_id}  {address[:-1]}")

		r = get(f"{url}{address}&key={API_KEY}")

		with open(f"geodata/{company_id}.json", "w") as f:
			f.write(r.text)

