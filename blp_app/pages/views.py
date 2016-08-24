from functions import get_config
from django.http import HttpResponseRedirect
from layout import PagesLayout
from functions import get_doc

def help(request):
  pagesLayout = PagesLayout()
  doc = get_doc("help.html")

  return  pagesLayout.render_template(request,"pages/help.html",{
    "text": doc
  })
def faq(request):
  config= get_config()
  pagesLayout = PagesLayout()
  doc = get_doc("faq.html")
  return  pagesLayout.render_template(request,"pages/faq.html", {
    "text": doc,
    "facebook_app_id":config['facebook_app_id']
  })
def privacy_policy(request):
  config= get_config()
  pagesLayout = PagesLayout()
  doc = get_doc("policy.html")
  return pagesLayout.render_template(request, "pages/policy.html", {
    "text": doc ,
    "facebook_app_id":config['facebook_app_id']
  })
def terms(request):
  config= get_config()
  pagesLayout = PagesLayout()
  doc = get_doc("terms.html")
  return pagesLayout.render_template(request, "pages/terms.html", {
     "text": doc,
    "facebook_app_id":config['facebook_app_id']
   })
def venues(request):
  pagesLayout = PagesLayout()
  doc = get_doc("venues.html")
  # moved to login_venue until added
  # 2/11/2016
  return HttpResponseRedirect("user/login_venue")
  #return pagesLayout.render_template(request, "pages/venues.html", {
  #  "text": doc 
  #})
def contact_us(request):
  pagesLayout = PagesLayout()
  doc = get_doc("contact_us.html")
  return pagesLayout.render_template(request, "pages/contact_us.html", {
     "text": doc 
   })

