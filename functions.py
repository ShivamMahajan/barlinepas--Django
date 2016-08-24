import os
import json
def get_config():
  WEBSITE_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__))).replace('\\', '/')
  return json.loads(open(WEBSITE_ROOT+"/barlinepass/config.json","r").read())
def get_doc(docname):
  config =get_config()
  file = open(config['root_dir']+"/docs/"+docname, "r").read()
  return file
 
def get_cities():
  return None

