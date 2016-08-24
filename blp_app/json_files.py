import os


files =  [ 
    '_view_all',
    '_view_one',
    '_upload',
    '_download',
    '_list',
    '_finish',
    '_authenticate',
]

json_string = """
  {%  autoescape off %}
  {{=json.loads(response)}}
  {% endautoescape %}
"""

for i  in  files:
  newfile = open("./gx-app/home/templates/main/{0}.html".format(i), "w")
  newfile.write(json_string)
  newfile.close()


