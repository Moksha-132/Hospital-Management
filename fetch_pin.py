import urllib.request
import re

url = "https://www.pinterest.com/pin/873416921482855584"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'property="og:image" content="([^"]+)"', html)
    if not matches:
        matches = re.findall(r'name="og:image" content="([^"]+)"', html)
    if not matches:
        matches = re.findall(r'src="([^"]+)"', html)
        matches = [m for m in matches if 'pinimg.com' in m and '.jpg' in m]
    print(matches[0] if matches else "No image found")
except Exception as e:
    print(e)
