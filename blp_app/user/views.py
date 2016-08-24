from blp_app.home.models import *
from blp_backend import Getter,Venue,User
#from blp_backend import
from django.http import HttpResponseRedirect, HttpResponse
from functions import get_config
from layout import UserLayout,BackendLayout,UserLayout
from django.core import serializers
import hashlib
import json
import datetime

def get_post_data(request):
  request_data = request.POST.keys()[0]
  print "Incoming data is: %s" % (request_data)
  return json.loads(request_data)

def get_current_user(request):
  if 'user' in request.session.keys():
    return request.session['user']
  return False
def get_current_venue(request):
  if 'venue' in request.session.keys():
    return request.session['venue']
  return False

def update_venue_description(request):
    print request.POST.get('venueDescription',False)
    currentVenue = get_current_venue(request)
    if currentVenue:
      #return HttpResponse(request_data['old_password'])
      venueObj = Merchant.objects.filter(id=currentVenue[0]['pk'])
      if not venueObj:
        return HttpResponse(False)
      else:
        try:
          Merchant.objects.filter(id=currentVenue[0]['pk']).update(
            blp_merchant_description=request.POST.get('venueDescription',False)
          )
        except Exception:
          return HttpResponse(False)
        return HttpResponse(True)

    return HttpResponseRedirect("/home/index")


def change_pass(request):
  userLayout = UserLayout()
  currentUser = get_current_user(request)
  currentVenue = get_current_venue(request)
  if currentUser:
    return userLayout.render_template(request, "home/index.html", {})
  return HttpResponseRedirect("/home/index")
def check_old_password(request):
  currentUser = get_current_user(request)
  if currentUser:
    request_data = get_post_data(request)
    #print request_data['old_password']
    #return HttpResponse(request_data['old_password'])
    customerObj = Customer.objects.filter(id=currentUser[0]['pk'], blp_customer_password=hashlib.md5( request_data['old_password'] ).hexdigest())
    if not customerObj:
      return HttpResponse(False)
    else:
      Customer.objects.filter(id=currentUser[0]['pk']).update(blp_customer_password=hashlib.md5( request_data['new_password'] ).hexdigest())
      return HttpResponse(True)

  return HttpResponseRedirect("/home/index")

def check_venue_old_password(request):
  currentVenue = get_current_venue(request)
  if currentVenue:
    request_data = get_post_data(request)
    #print request_data['old_password']
    #return HttpResponse(request_data['old_password'])
    merchantObj = Merchant.objects.filter(id=currentVenue[0]['pk'], blp_merchant_password=hashlib.md5( request_data['old_password'] ).hexdigest())
    if not merchantObj:
      return HttpResponse(False)
    else:
      Merchant.objects.filter(id=currentVenue[0]['pk']).update(blp_merchant_password=hashlib.md5( request_data['new_password'] ).hexdigest())
      return HttpResponse(True)

  return HttpResponseRedirect("/home/index")

def login(request):
  config= get_config()
  userLayout = UserLayout()
  currentUser = get_current_user(request)
  currentVenue = get_current_venue(request)
  if not currentUser and not currentVenue:
    return userLayout.render_template(request, "home/index.html", config)
  return HttpResponseRedirect("/home/index")
def register(request):
  config= get_config()
  userLayout = UserLayout()
  currentUser = get_current_user(request)
  currentVenue = get_current_venue(request)
  if not currentUser and not currentVenue:
    return userLayout.render_template(request, "user/register.html", config)
  return HttpResponseRedirect("/home/index")
def register_venue(request):
  config= get_config()
  userLayout = UserLayout()
  currentVenue = get_current_venue(request)
  currentUser = get_current_user(request)
  if currentUser:
    return HttpResponseRedirect("/home/index")
  if not currentVenue:
    return userLayout.render_template(request, "user/register_venue.html", config)
  return HttpResponseRedirect("/user/manage_details")



def login_venue(request):
  userLayout = UserLayout()
  currentVenue =  get_current_venue(request)
  currentUser = get_current_user(request)


  if currentUser:
    return HttpResponseRedirect("/home/index")
  if not currentVenue:
    return userLayout.render_template(request, "home/index.html", {})
  return HttpResponseRedirect("/user/manage_details")
def manage_venue(request):
  backendLayout = BackendLayout()
  currentVenue =  get_current_venue(request)
  currentUser =get_current_user(request)
  if currentVenue:
    totalTicketsSold = Getter.get_total_sold_tickets(request.session['venue'][0]['pk'])
    totalTicketsScanned = Getter.get_total_scanned_tickets(request.session['venue'][0]['pk'])
    totalTicketsAvailable = Getter.get_total_available_tickets(request.session['venue'][0]['pk'])
    soldTicketsList = Getter.get_sold_tickets(request.session['venue'][0]['pk'])
    return backendLayout.render_template(request, "user/manage_details.html", {
      "totalTicketsSold": totalTicketsSold,
      "totalTicketsScanned": totalTicketsScanned,
      "totalTicketsAvailable": totalTicketsAvailable,
      "soldTicketsList": soldTicketsList
      })
  return HttpResponseRedirect("/home/index")
def manage_user_details(request):
  backendLayout = BackendLayout()
  currentUser = get_current_user(request)
  if currentUser:
    return backendLayout.render_template(request, "user/manage_user_details.html", {})
  return HttpResponseRedirect("/home/index")

def get_user_details(request):
  backendLayout = BackendLayout()
  currentUser =  get_current_user(request)
  if currentUser:
    user_details = User.get_user_details(request.session['user'][0]['pk'])
    user_details = json.dumps({
        "id":user_details.id,
        "blp_customer_username":user_details.blp_customer_username,
        "blp_customer_first_name":user_details.blp_customer_first_name,
        "blp_customer_last_name":user_details.blp_customer_last_name,
        "blp_customer_email":user_details.blp_customer_email,
        "blp_customer_phone_number":user_details.blp_customer_phone_number,
        "blp_customer_active":user_details.blp_customer_active,
        "blp_customer_created_at":user_details.blp_customer_created_at.strftime("%b %d %Y")
      })
    return HttpResponse(user_details)
  return HttpResponseRedirect(False)
def get_sales_details(request):
  backendLayout = BackendLayout()
  currentUser =  get_current_user(request)
  if currentUser:
    request_data = get_post_data(request)
    soldTicketsList = Getter.get_sold_tickets_list(request.session['user'][0]['pk'],request_data['sale_parent_id'])
    booking_details = serializers.serialize("json",soldTicketsList)
    return HttpResponse(booking_details)
  return HttpResponseRedirect(False)

def get_venue_sales_details(request):
  backendLayout = BackendLayout()
  currentUser =  get_current_venue(request)
  if currentUser:
    request_data = get_post_data(request)
    soldTicketsList = Getter.get_venue_sold_tickets_list(request.session['venue'][0]['pk'],request_data['sale_parent_id'])
    booking_details = serializers.serialize("json",soldTicketsList)
    return HttpResponse(booking_details)
  return HttpResponseRedirect(False)

def manage_details(request):
  backendLayout = BackendLayout()
  currentVenue =  get_current_venue(request)
  if currentVenue:
    totalTicketsSold = Getter.get_total_sold_tickets(request.session['venue'][0]['pk'])
    totalTicketsScanned = Getter.get_total_scanned_tickets(request.session['venue'][0]['pk'])
    totalTicketsAvailable = Getter.get_total_available_tickets(request.session['venue'][0]['pk'])
    soldTicketsList = Getter.get_sold_tickets(request.session['venue'][0]['pk'])
    finalData = {}
    # if soldTicketsList != "":
    #   for soldTicket in soldTicketsList:
    #     finalData = json.dumps({
    #       "id":soldTicket.id
    #       })
    # return HttpResponse(finalData)

    return backendLayout.render_template(request, "user/manage_details.html", {
      "totalTicketsSold": totalTicketsSold,
      "totalTicketsScanned": totalTicketsScanned,
      "totalTicketsAvailable": totalTicketsAvailable,
      "soldTicketsList": soldTicketsList
    })
    #return backendLayout.render_template(request, "user/manage_details.html", {})
  return HttpResponseRedirect("/")

def get_venue_details(request):
  backendLayout = BackendLayout()
  currentVenue =  get_current_venue(request)
  if currentVenue:
    venue_details = Venue.get_venue_details(request.session['venue'][0]['pk'])
    merchants = json.dumps({
        "id":venue_details.id,
        "blp_merchant_name":venue_details.blp_merchant_name,
        "blp_merchant_city":venue_details.blp_merchant_city,
        "blp_merchant_description":venue_details.blp_merchant_description,
        "blp_merchant_email":venue_details.blp_merchant_email,
        "blp_merchant_address":venue_details.blp_merchant_address,
        "blp_merchant_state":venue_details.blp_merchant_state,
        "blp_merchant_zip":venue_details.blp_merchant_zip,
        "blp_merchant_phone_number":venue_details.blp_merchant_phone_number,
        "blp_merchant_active":venue_details.blp_merchant_active,
        "blp_merchant_created_at":venue_details.blp_merchant_created_at.strftime("%b %d %Y")
      })
    return HttpResponse(merchants)
  return HttpResponseRedirect(False)
def update_venue_details(request):
  currentVenue = get_current_venue(request)
  if currentVenue:
    request_data = get_post_data(request)
    print request_data
    #return HttpResponse(request_data['old_password'])
    venueObj = Merchant.objects.filter(id=currentVenue[0]['pk'])
    if not venueObj:
      return HttpResponse(False)
    else:
      try:
        Merchant.objects.filter(id=currentVenue[0]['pk']).update(
          blp_merchant_name=request_data['venueName'],
          blp_merchant_phone_number=request_data['venuePhoneNumber'],
          blp_merchant_city=request_data['venueCity'],
          blp_merchant_state=request_data['venueState'],
          blp_merchant_zip=request_data['venueZip'],
          blp_merchant_address=request_data['venueAddress'],
          #blp_merchant_description=request_data['venueDescription'],
          blp_merchant_email=request_data['venueEmail'],
        )
      except Exception:
        return HttpResponse('EmailFalse')
      return HttpResponse(True)

  return HttpResponseRedirect("/home/index")

def update_customer_details(request):
  currentCustomer = get_current_user(request)
  if currentCustomer:
    request_data = get_post_data(request)
    print request_data
    #return HttpResponse(request_data['old_password'])
    customerObj = Customer.objects.filter(id=currentCustomer[0]['pk'])
    if not customerObj:
      return HttpResponse(False)
    else:
      try:
        Customer.objects.filter(id=currentCustomer[0]['pk']).update(
          blp_customer_first_name=request_data['firstName'],
          blp_customer_last_name=request_data['lastName'],
          blp_customer_phone_number=request_data['phoneNumber'],
          blp_customer_email=request_data['email']
        )
        return HttpResponse(True)
      except Exception:
        return HttpResponse('EmailFalse')
      return HttpResponse(True)

  return HttpResponseRedirect("/home/index")

def forgot(request):
  config= get_config()
  userLayout=UserLayout()
  currentUser = get_current_user(request)
  currentVenue = get_current_venue(request)
  if not currentUser and not currentVenue:
    return userLayout.render_template(request, "user/forgot.html", config)
  return HttpResponseRedirect("/home/index")
def forgot_venue(request):
  config= get_config()
  userLayout=UserLayout()
  currentUser = get_current_user(request)
  currentVenue = get_current_venue(request)
  if not currentUser and not currentVenue:
    return userLayout.render_template(request, "user/forgot_venue.html", config)
  return HttpResponseRedirect("/home/index")
def reset(request):
  userLayout = UserLayout()
  currentUser = get_current_user(request)
  currentVenue = get_current_venue(request)
  if not currentUser and not currentVenue:
    return userLayout.render_template(request, "user/reset.html", {})
  return HttpResponseRedirect("/home/index")
def reset_venue(request):
  userLayout = UserLayout()
  currentUser = get_current_user(request)
  currentVenue = get_current_venue(request)
  if not currentUser and not currentVenue:
    return userLayout.render_template(request, "user/reset_venue.html", {})
  return HttpResponseRedirect("/home/index")






def logout(request):
  if 'venue' in request.session.keys() :
    del request.session['venue']
  if 'user' in request.session.keys()  :
    del request.session['user']
  request.session.modified = True
  return HttpResponseRedirect("https://htpdemo.servehttp.com/home/index")


def activate(request):
  if 'mid' in request.GET:
    try:
      Merchant.objects.filter(blp_merchant_random_string=request.GET['mid']).update(
        blp_merchant_active=1
        )
    except Exception:
      print Exception
  elif 'cid' in request.GET:
    try:
      Customer.objects.filter(blp_customer_random_string=request.GET['cid']).update(
        blp_customer_active=1
        )
    except Exception:
      print Exception
  else:
    print 'nooo'
  return HttpResponseRedirect("/home/index")
