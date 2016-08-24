from functions import get_config
from models import *
from layout import MainLayout,JSONLayout,HomeLayout

def  index(request):
  config= get_config()
  homeLayout = HomeLayout()
  return homeLayout.render_template(request,"home/index.html", config)

def  aboutBlp(request):
  config= get_config()
  homeLayout = HomeLayout()
  return homeLayout.render_template(request,"home/about-blp.html", config)
