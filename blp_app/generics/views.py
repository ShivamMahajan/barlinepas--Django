from blp_app.home import models
from django.http.request import build_request_repr
from functions import get_config
from blp_backend import Getter,Events,User,Venue,send_user_reset_link,send_venue_reset_link,send_venue_registration_email,send_user_registration_email , sort_by_index ,send_qr_code,send_mail_to_user
from blp_app.home.models import *
from layout import JSONLayout
from django.core import serializers
from datetime import datetime,timedelta
from urllib import urlencode,quote_plus
from PIL import Image
from django.db.models import Q
from django.shortcuts import render
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import smtplib
import re
import hashlib
import math
import requests
import base64
import uuid
import os
import time
import json
from django.http.response import HttpResponse

import paypalrestsdk
from django.http import HttpResponse
from django import forms
from blp_app.home.models import pmt_summary
from dateutil import parser
from layout import MainLayout,JSONLayout,HomeLayout
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
import urllib


def get_post_data(request):
  request_data = request.POST.keys()[0]
  return json.loads(request_data)

def _current_user(request):
  current_user = False
  type_of_user = ""
  jsonLayout = JSONLayout()

  if 'venue' in request.session.keys() and request.session['venue']:
    current_user =request.session['venue'][0]
    type_of_user = "venue"
    venue = Merchant.objects.get(id=current_user['pk'])
    current_user = json.loads(serializers.serialize("json", [venue]))
    current_user = current_user[0]
    return jsonLayout.render_template( request, "generics/_current_user.html", {
          "response": json.dumps({
                  "status": "OK",
                  "data": current_user,
                  "type": type_of_user
          })
       })


  elif  'user' in request.session.keys() and request.session['user']:
    current_user = request.session['user'][0]
    type_of_user = "user"
    user = Customer.objects.get(id=current_user['pk'])
    current_user = json.loads(serializers.serialize("json", [user]))
    current_user = current_user[0]
    return jsonLayout.render_template( request, "generics/_current_user.html", {
          "response": json.dumps({
                  "status": "OK",
                  "data": current_user,
                  "type": type_of_user
          })
       })
  return jsonLayout.render_template(request, "generics/_current_user.html", {
         "response": json.dumps({
                "status":"OK",
                "data": current_user,
                "type": ""
                })
   })


def _home_video(request):
  #homeVideo = HomeVideo.get()
  config = get_config()
  homeVideo = json.loads(open(config['root_dir']+"/needed/video.json", "r").read())
  jsonLayout= JSONLayout()
  return jsonLayout.render_template(request, "generics/_home_video.html", {
	"response": json.dumps(homeVideo)
  })
def _filter_options(request):
  config = get_config()
  filterOptions = json.loads(open(config['root_dir']+"/needed/fields.json", "r").read())
  jsonLayout = JSONLayout()
  return  jsonLayout.render_template(request, "generics/_filter_options.html", {
	 "response": json.dumps(filterOptions)
   })
def _nav_menu(request):
  config = get_config()
  navOptions = json.loads(open(config['root_dir']+"/needed/nav.json","r").read())
  jsonLayout = JSONLayout()
  return jsonLayout.render_template(request, "generics/_nav_menu.html", {
	 "response": json.dumps(navOptions)
   })
def get_city(json_obj, city_name):
   for i in json_obj['options']:
      if  i['value']==city_name:
         return i

def _get_pricing(request):
  request = json.loads(request.body)
  price = Events.get_pricing( request['id'],  int(request['qty']), date=None)
  jsonLayout = JSONLayout()
  return jsonLayout.render_template(request, "generics/_get_pricing.html", {
	"response": json.dumps({
		"price": price
	 })
	})


def _get_cities(request):
  config = get_config()
  fields = json.loads(open(config['root_dir']+"/needed/fields.json","r").read())
  jsonLayout = JSONLayout()
  for i in fields:
    if i['name'] == "city":
      return jsonLayout.render_template(request,"generics/_get_cities.html", {
                "response": json.dumps({
                        "status": "OK",
                        "data": i['options']
                })
        })
  return jsonLayout.render_template(request, "generics/_get_cities.html", {
                "response": json.dumps({
                        "status": "ERROR",
                        })
        })



def _get_bar_listings(request):
  get_request = request.GET
  config = get_config()
  fields = json.loads(open(config['root_dir']+"/needed/fields.json","r").read())
  for i in fields:
    if i['name'] == "city":
      cityObject = get_city(i,get_request['city'])
      bars = ''
      if cityObject is not None:
        bars =  Getter.get_bar_listings_by_city(cityObject)
      jsonLayout = JSONLayout()
      return jsonLayout.render_template(request, "generics/_get_city_and_listings.html", {
        "response": json.dumps({
        "bars": bars
        })
      })


def _get_city_and_listings(request):
  get_request = request.GET
  config = get_config()
  fields = json.loads(open(config['root_dir']+"/needed/fields.json","r").read())
  for i in fields:
    if i['name'] == "city":
      timeDelta =  int(config['time_delta_events'])
      #dateStart = get_request['dateStart'] if  'dateStart' in get_request.keys()  else None
      #dateEnd = get_request['dateEnd'] if 'dateEnd' in get_request.keys() else None
      dateTimeNow =  datetime.now()
      dateStart=dateTimeNow.strftime("%Y-%m-%d %H:%M:%S")
      dateTimeAfter = datetime.fromtimestamp( time.time() + timeDelta )
      dateEnd = dateTimeAfter.strftime("%Y-%m-%d %H:%M:%S")
      merchantId =   get_request['merchant_id'] if 'merchant_id' in get_request.keys() else False
      cityObject = get_city(i,get_request['city'])
      bars = ''
      if cityObject is not None:
        bars =  Getter.get_listings_by_city(cityObject,  dateStart,dateEnd)
      ##events =  json.loads(serializers.serialize("json", Getter.get_events_by_merchant(  merchantId )))
      jsonLayout = JSONLayout()
      return jsonLayout.render_template(request, "generics/_get_city_and_listings.html", {
        "response": json.dumps({
        "cities":  i['options'],
        "city": cityObject,
        "bars": bars
        #"events": events
        })
      })
def _login_vendors(request):
   config = get_config()
   VENDORS =  {
	 "FACEBOOK": {
		"app_id": config['facebook_app_id'],
		"scope": config['facebook_scope']
	},
	 "GOOGLE": {
		"app_id": config['google_app_id'],
		"scope": config['google_scope']
	},
	"TWITTER": {
		"app_id": config['twitter_app_id'],
		"scope": config['twitter_scope']
	},
	"EMAIL": {}
    }
   jsonLayouts = JSONLayout()
   return jsonLayouts.render_template(request,"generics/_login_vendors", {
		"response" : json.dumps(VENDORS)
	 })


def session_post(request, boolean, viewName, sessionKey, sessionObject):
  jsonLayout = JSONLayout()
  if 'venue' in  request.session.keys():
    del request.session['venue']
  if 'user' in request.session.keys():
    del request.session['user']
  request.session.modified=True

  if boolean:
    serializedObject = json.loads(serializers.serialize("json", [sessionObject]))
    request.session[sessionKey] =serializedObject
    dictObj = dict()
    dictObj['status']="OK"
    return jsonLayout.render_template( request, viewName, { "response": json.dumps(dictObj) } )
  dictObj = dict()
  dictObj['status'] = "ERROR"
  return jsonLayout.render_template(request, viewName, { "response": json.dumps( dictObj ) } )

## login venues and users
##
##
def _login_user(request):
  post_request = get_post_data(request)
  checkLogin = User.login(post_request['username'], post_request['password'])
  jsonLayouts = JSONLayout()
  return  session_post(request,checkLogin,"generics/_login_user.html", "user", checkLogin)
def _login_venue(request):
   post_request = get_post_data(request)
   checkVenue = Venue.login(post_request['username'], post_request['password'])
   return session_post(request,checkVenue, "generics/_login_venue.html", "venue", checkVenue)


def  _register_user(request):
   jsonLayout = JSONLayout()
   post_request = get_post_data(request)
   try:
     registeredUser = User.register(post_request)
     if registeredUser:
       send_user_registration_email( registeredUser )
     #return session_post(request, registeredUser, "generics/_register_user.html", "user", registeredUser)
       dictObj = dict()
       dictObj['status']="OK"
       jsonLayout = JSONLayout()
       #return jsonLayout.render_template( request, "generics/_register_user.html", { "response": json.dumps(dictObj) } )
       return session_post(request, registeredUser, "generics/_register_user.html", "user", registeredUser)
     else:
       return HttpResponse('')
   except Exception:
    return HttpResponse('')

def _register_venue(request):
   post_request = get_post_data(request)
   registeredVenue = Venue.register(post_request)
   if registeredVenue:
     send_venue_registration_email(registeredVenue)

   #return session_post(request, registeredVenue, "generics/_register_venue.html", "venue", registeredVenue)
     dictObj = dict()
     dictObj['status']="OK"
     jsonLayout = JSONLayout()
     #return jsonLayout.render_template( request, "generics/_register_venue.html", { "response": json.dumps(dictObj) } )
     return session_post(request, registeredVenue, "generics/_register_venue.html", "venue", registeredVenue)
   else:
      return HttpResponse('')

def _login_social(request):
  post_request = get_post_data(request)
  checkLogin = User.social_login(post_request['username'], post_request['socialUserFirstName'], post_request['socialUserLastName'])
  return session_post(request, checkLogin, "generics/_login_social.html", "user", checkLogin )

def _forgot_user(request):
   post_request = get_post_data(request)
   jsonLayout = JSONLayout()
   if post_request['username']:
      user = Customer.objects.filter(blp_customer_email=post_request['username'])
      if user:
         user = user[0]
         reset = send_user_reset_link( user )
         if reset:
            return jsonLayout.render_template(request, "generics/_forgot_user.html", {
                        "response": json.dumps({
                                "status": "OK",
                                "msg": "Reset instructions were sent"
                        })
               })
         else:
            return jsonLayout.render_template(request, "generics/_forgot_user.html", {
                        "response": json.dumps({
                                "status": "ERROR",
                                "msg": "Could not reset user"
                        })
             })

   return jsonLayout.render_template(request, "generics/_forgot_user.html", {
     "response": json.dumps({
                "status": "ERROR",
                "msg": "User does not exist"
                })
   })


def _forgot_venue(request):
   post_request = get_post_data(request)
   jsonLayout = JSONLayout()
   if post_request['username']:
     venue = Merchant.objects.filter(blp_merchant_email=post_request['username'])
     if venue:
       venue = venue[0]
       reset = send_venue_reset_link( venue )
       if  reset:
          return jsonLayout.render_template(request, "generics/_forgot_venue.html", {
                "response": json.dumps({
                        "status": "OK",
                        "msg": "Reset instructions were sent"
                       })
                })
       else:
          return jsonLayout.render_template(request, "generics/_forgot_venue.html", {
                "response": json.dumps({
                        "status": "ERROR",
                        "msg": "Could not reset the password"
                })
            })
   return jsonLayout.render_template(request, "generics/_forgot_venue.html", {
                "response": json.dumps({
                        "status": "ERROR",
                        "msg": "Venue email does not exist"
                })
            })



def _reset_user(request):
   post_request = get_post_data(request)
   jsonLayout = JSONLayout()
   if post_request['hash']:
      user = Getter.get_user_by_hash( post_request['hash'] )
      if user:
         user.blp_customer_password=hashlib.md5(post_request['password']).hexdigest()
         user.save()
         json_obj = json.loads(serializers.serialize("json", [user]))

         return jsonLayout.render_template(request, "generics/_reset_user.html", {
                "response": json.dumps({
                        "status": "OK",
                        "user": json_obj[0],
                        "msg": "Reset password successfully"
                })
         })
      else:
         return jsonLayout.render_template(request, "generics/_reset_user.html", {
                "response": json.dumps({
                        "status": "ERROR",
                        "msg": "Could not reset the user account"
                })
         })
def _reset_venue(request):
  post_request = get_post_data(request)
  jsonLayout = JSONLayout()
  if post_request['hash']:
     venue = Getter.get_venue_by_hash( post_request['hash'] )
     if venue:
       venue.blp_merchant_password=hashlib.md5(post_request['password']).hexdigest()
       venue.save()
       json_obj = json.loads(serializers.serialize("json", [venue]))
       return jsonLayout.render_template(request, "generics/_reset_venue.html", {
                "response": json.dumps({
                        "status": "OK",
                        "user": json_obj[0],
                        "msg": " Reset venue password"
                })
        })
     else:
       return jsonLayout.render_template(request, "generics/_reset_venue.html", {
                "response": json.dumps({
                        "status": "ERROR",
                        "msg": "could not reset venue password"
                })
        })


## venues

def _get_current_merchant(request):
   jsonLayout = JSONLayout()
   if  'venue' in  request.session.keys():
        merchant = json.loads(serializers.serialize("json", [Merchant.objects.get(id=request.session['venue'][0]['pk'])] ))
	merchant = merchant[0]
        print "Current merchant data is: %s" % ( merchant )

   	return  jsonLayout.render_template(request, "generics/_get_current_merchant.html", {
		"response": json.dumps({
		"status": "OK",
		"data":  merchant
		})
	 })
   return jsonLayout.render_template(request, "generics/_get_current_merchant.html", {
		"response": json.dumps({
		"status": "ERROR",
		"data": False
		})
	})

def _get_listings(request):
  sessioncheck = request.session['venue'] if 'venue' in  request.session.keys()  else False
  jsonLayout = JSONLayout()

  if sessioncheck:
     id = request.session['venue'][0]['pk']
     listings =  json.loads(serializers.serialize("json", Getter.get_events_by_merchant(int(request.session['venue'][0]['pk']))))

     return jsonLayout.render_template(request, "generics/_get_listings.html", {
		"response":  json.dumps({
		"status": "OK",
		"data": listings
		})
	 })
  return jsonLayout.render_template(request, "generics/_get_listings.html", {
		"response": json.dumps({
		"status": "ERROR"
		})
	})
def  _edit_listing(request):
   request_data = get_post_data(request)
   get_request = request.GET
   resultEdit = Event.edit_listing(get_request['id'],request_data)
   if resultEdit:
 	return jsonLayout.render_template(request, "generics/_edit_listing.html", {
		"response": json.dumps({
		"status": "OK"
		})
	})
   return jsonLayout.render_template(request, "generics/_edit_listing.html", {
		"response": json.dumps({
		"status": "ERROR"
		})
	 })

def _save_listing(request):
   request_data = get_post_data(request)
   jsonLayout = JSONLayout()
   merchantId = request.session['venue'][0]['pk']
   new_listing = Events.save_listing(merchantId, request_data)

   if new_listing:
      return jsonLayout.render_template(request, "generics/_save_listing.html", {
		"response": json.dumps({
		"status": "OK"
		})
	})
   return jsonLayout.render_template(request, "generics/_save_listing.html", {
	"response": json.dumps({
	 "status": "ERROR"
	})
   })
def number_or_zero(given_number):
  return str(given_number)


def update_merchant_unit_prices(request,data,merchant):
   days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
   updated_days = []
   notupdated_days = []
   updated_status = True
   args = dict()

   return_status = True
   for i in days:
      check1 = re.sub("\.","", data[i+"_pricing"]).isnumeric()
      check2 =  data[i+"_qty"].isnumeric()
      check3 =   math.fabs(int(check1)) == int(check1)
      check4 =  math.fabs(check2) ==int(check2)
      if  check1 and check2 and check3 and check4:
        pricekey = "blp_merchant_"+i+"_unit_pricing"
        args[pricekey]= data[i+"_pricing"]
        qtykey = "blp_merchant_"+i+"_qty_total"
        qtykey1= "blp_merchant_"+i+"_qty"
        args[qtykey] = int(data[i+"_qty"])
        args[qtykey1]= int(data[i+"_qty"])
        updated_days.append(  i  )
      else:
        notupdated_days.append(  i )

      #setattr(merchant,key,data[i])

   return [ updated_days, notupdated_days, args ]


def _get_listing_data(request):

  request_data = get_post_data(request)
  print request_data['date_selected']
  print request_data['day_selected']
  day_selected = request_data['day_selected']
  merchant_name = request_data['merchant_name']
  print request_data
  print "merchant_name",merchant_name


  jsonLayout = JSONLayout()
  try:
    merchantInfo =  Merchant_Event.objects.get(blp_merchant_event_date= request_data['date_selected'], blp_merchant_id= merchant_name)
    ret = json.dumps({
      "status": "OK",
      "qty" : merchantInfo.blp_merchant_event_qty,
      "totalqty" : merchantInfo.blp_merchant_event_qty_total,
      "price" : merchantInfo.blp_merchant_event_unit_pricing,
      "special" : True
    })
  except Merchant_Event.DoesNotExist:
    merchantInfo =  Merchant.objects.get(pk= request_data['merchant_name'])
    blp_merchant_event_unit_pricing = ''
    if day_selected == 'Monday':
      blp_merchant_event_unit_pricing = merchantInfo.blp_merchant_monday_unit_pricing
      blp_merchant_event_qty = merchantInfo.blp_merchant_monday_qty
      blp_merchant_event_qty_total = merchantInfo.blp_merchant_monday_qty_total
    elif day_selected == 'Tuesday':
      blp_merchant_event_unit_pricing = merchantInfo.blp_merchant_tuesday_unit_pricing
      blp_merchant_event_qty = merchantInfo.blp_merchant_tuesday_qty
      blp_merchant_event_qty_total = merchantInfo.blp_merchant_tuesday_qty_total
    elif day_selected == 'Wednesday':
      blp_merchant_event_unit_pricing = merchantInfo.blp_merchant_wednesday_unit_pricing
      blp_merchant_event_qty = merchantInfo.blp_merchant_wednesday_qty
      blp_merchant_event_qty_total = merchantInfo.blp_merchant_wednesday_qty_total
    elif day_selected == 'Thursday':
      blp_merchant_event_unit_pricing = merchantInfo.blp_merchant_thursday_unit_pricing
      blp_merchant_event_qty = merchantInfo.blp_merchant_thursday_qty
      blp_merchant_event_qty_total = merchantInfo.blp_merchant_thursday_qty_total
    elif day_selected == 'Friday':
      blp_merchant_event_unit_pricing = merchantInfo.blp_merchant_friday_unit_pricing
      blp_merchant_event_qty = merchantInfo.blp_merchant_friday_qty
      blp_merchant_event_qty_total = merchantInfo.blp_merchant_friday_qty_total
    elif day_selected == 'Saturday':
      blp_merchant_event_unit_pricing = merchantInfo.blp_merchant_saturday_unit_pricing
      blp_merchant_event_qty = merchantInfo.blp_merchant_saturday_qty
      blp_merchant_event_qty_total = merchantInfo.blp_merchant_saturday_qty_total
    elif day_selected == 'Sunday':
      blp_merchant_event_unit_pricing = merchantInfo.blp_merchant_sunday_unit_pricing
      blp_merchant_event_qty = merchantInfo.blp_merchant_sunday_qty
      blp_merchant_event_qty_total = merchantInfo.blp_merchant_sunday_qty_total

    ret = json.dumps({
      "status": "error",
      "price" : blp_merchant_event_unit_pricing,
      "qty" : blp_merchant_event_qty,
      "totalqty" : blp_merchant_event_qty_total,
      "special" : False
    })

  return HttpResponse(ret)

def _get_listing_days(request):

  request_data = get_post_data(request)
  print request_data['date_selected']
  session_merchant = request.session['venue'][0]
  jsonLayout = JSONLayout()
  try:
    merchantInfo =  Merchant_Event.objects.get(blp_merchant_event_date= request_data['date_selected'], blp_merchant_id = session_merchant['pk'])
    ret = json.dumps({
      "status": "OK",
      "qty" : merchantInfo.blp_merchant_event_qty,
      "price" : merchantInfo.blp_merchant_event_unit_pricing,
      "name" : merchantInfo.blp_merchant_event_name,
      "description" : merchantInfo.blp_merchant_event_description,
      "id" : merchantInfo.id,
      "msg": "Returning Data"
    })
  except Merchant_Event.DoesNotExist:
    ret = json.dumps({
      "status": "error",
      "msg": "No data"
    })

  return HttpResponse(ret)

def _delete_listing_days(request):
  request_data = get_post_data(request)
  session_merchant = request.session['venue'][0]
  print request_data['date_selected']
  print session_merchant['pk']
  jsonLayout = JSONLayout()
  try:
    merchantInfo =  Merchant_Event.objects.get(blp_merchant_event_date= request_data['date_selected'], blp_merchant_id = session_merchant['pk'])
    merchantInfo.delete()
    ret = json.dumps({
      "status": "OK",
      "msg": "Deleted"
    })
  except Merchant_Event.DoesNotExist:
    ret = json.dumps({
      "status": "error",
      "msg": "No data"
    })
  return HttpResponse(ret)



def _save_single_listing(request):
  request_data = get_post_data(request)
  session_merchant = request.session['venue'][0]
  print request_data['addSingleDay_id']
  eid = request_data['addSingleDay_id']
  if eid == '':
    eid = 0
  print session_merchant['pk']
  try:
    try:
      try:
        merchantInfo =  Merchant_Event.objects.get(~Q(id=eid) ,blp_merchant_event_date= request_data['addSingleDay_date'], blp_merchant_id = session_merchant['pk'])
        jsonLayout = JSONLayout()
        return jsonLayout.render_template(request, "generics/_save_listing_days.html", {
          "response": json.dumps({
          "status": "alreadyExist",
          "msg": "Record already exist"
          })
        })
      except Exception:
        print Exception
        print 'nothing found'

        merchantInfo =  Merchant_Event.objects.get(id=eid,blp_merchant_event_date= request_data['addSingleDay_date'], blp_merchant_id = session_merchant['pk'])
        #print merchantInfo.blp_merchant_event_qty
        #merchantInfo.blp_merchant_event_date = request_data['addSingleDay_date']
        merchantInfo.blp_merchant_event_name = request_data['addSingleDay_name']
        merchantInfo.blp_merchant_event_description = request_data['addSingleDay_description']
        merchantInfo.blp_merchant_event_qty = request_data['addSingleDay_quantity']
        #merchantInfo.blp_merchant_id = int(session_merchant['pk']),
        merchantInfo.blp_merchant_event_qty_total = request_data['addSingleDay_quantity']
        merchantInfo.blp_merchant_event_unit_pricing = request_data['addSingleDay_price']
        merchantInfo.save()
        jsonLayout = JSONLayout()
        return jsonLayout.render_template(request, "generics/_save_listing_days.html", {
          "response": json.dumps({
          "status": "OK",
          "msg": "Updated all unit prices"
          })
        })
    except Merchant_Event.DoesNotExist:
      merchant =  Merchant.objects.get(id=int(session_merchant['pk']))
      #data = update_merchant_single_date(request, request_data,merchant)
      merchantEvent = Merchant_Event(
        blp_merchant_event_date = request_data['addSingleDay_date'],
        blp_merchant_event_name = request_data['addSingleDay_name'],
        blp_merchant_event_description = request_data['addSingleDay_description'],
        blp_merchant_event_qty = request_data['addSingleDay_quantity'],
        blp_merchant_id = int(session_merchant['pk']),
        blp_merchant_event_qty_total = request_data['addSingleDay_quantity'],
        blp_merchant_event_unit_pricing = request_data['addSingleDay_price']
      )
      merchantEvent.save()

      #Model Merchant_Event
      #return request
      jsonLayout = JSONLayout()
      return jsonLayout.render_template(request, "generics/_save_listing_days.html", {
            "response": json.dumps({
         "status": "OK",
         "msg": "Updated unit price"
            })
         })
  except Exception, e:
    jsonLayout = JSONLayout()
    print e
    print "Could not update merchant for reason: %s" % (e.__str__())
    return jsonLayout.render_template(request, "generics/_save_listing_days.html", {
      "response": json.dumps({
      "status": "ERROR"
      })
    })

def _save_listing_days(request):
   request_data = get_post_data(request)
   session_merchant = request.session['venue'][0]
   try:
     merchant =  Merchant.objects.get(id=int(session_merchant['pk']))
     jsonLayout = JSONLayout()
     data = update_merchant_unit_prices(request, request_data,merchant)
     save_status = Merchant.objects.filter(id=int(session_merchant['pk'])).update(**data[2])
     request.session['venue']=json.loads(serializers.serialize("json",[merchant]))
     request.session.modified=True

     if len( data[1] ) == 0: ## everything updated
       return jsonLayout.render_template(request, "generics/_save_listing_days.html", {
            "response": json.dumps({
         "status": "OK",
          "msg": "Updated all unit prices"
            })
         })
     else:
       return jsonLayout.render_template(request, "generics/_save_listing_days.html", {
          "response": json.dumps({
                "status": "WARNING",
                 "msg": "One or more unit prices could not be updated",
                 "days": data[1]
                })
          }
         )

   except Exception, e:
     print "Could not update merchant for reason: %s" % (e.__str__())
     return jsonLayout.render_template(request, "generics/_save_listing_days.html", {
	"response": json.dumps({
	 "status": "ERROR"
	})
	})


def _delete_listing(request):
   request_data = get_post_data(request)
   get_request = request.GET
   resultDelete = Event.delete_listing(get_request['id'])
   if resultDelete:
	 return jsonLayout.render_template(request, "generics/_delete_listing.html", {
	    "status": "OK"
	 })
   return jsonLayout.render_template(request, "generics/_delete_listing.html", {
	 "status": "ERROR"
   })
def gen_qr_code_url(id_event):
   config = get_config()
   base_url = config['root_url']+"/home/index?merchant_id={0}".format(id_event)
   return base_url
def _get_qr_code(request):
   request_data = request.GET
   qr_code_api_base = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+quote_plus(gen_qr_code_url(
	request.session['venue'][0]['pk']))
   fileName = "QR-CODE-{0}.png".format(request.session['venue'][0]['pk'])
   try:
     content = requests.get( qr_code_api_base).content
     #print "QR Code response data was: %s" %(content)
     config = get_config()
     newfile = open( config['root_dir'] + "/third/media/{0}".format( fileName ), 'wb+' )
     newfile.write(content)
     newfile.close()
     return_data = dict(src="{0}".format(fileName), width=150, height=150)
     jsonLayout = JSONLayout()
     return jsonLayout.render_template(request, "generics/_get_qr_code.html", {
	  "response": json.dumps({
		  "status": "OK",
		  "data": return_data
		  })
	  })
   except Exception, e:
     print "Could not fetch QR code for reason %s"%(e.__str__())
     return jsonLayout.render_template(request,"generics/_get_qr_code.html", {
	 "response": json.dumps({
		"status": "ERROR"
		})
	})




def _get_merchant_photos(request):
   get_request = request.GET
   session_id = request.session['venue'][0]['pk']
   Photos = Merchant_Photo.objects.filter(blp_merchant_id=session_id).order_by('-id')
   print Photos
   jsonLayout = JSONLayout()
   if len(Photos)==0 or len(Photos)>0:
      json_data = json.loads(serializers.serialize("json", Photos))
      return jsonLayout.render_template(request, "generics/_get_merchant_photos.html", {
	"response": json.dumps({
		"data": json_data,
		"status": "OK"
		})
	})
   return jsonLayout.render_template(request, "generics/_get_merchant_photos.html", {
		"response": json.dumps({
		"status": "ERROR"
		})
	})

def _get_customer_photos(request):
  get_request = request.GET
  session_id = request.session['user'][0]['pk']
  Photos = Customer_Photo.objects.filter(blp_customer_id=session_id).order_by('-id')[:1]
  jsonLayout = JSONLayout()
  if len(Photos)==0 or len(Photos)>0:
    json_data = json.loads(serializers.serialize("json", Photos))
    return jsonLayout.render_template(request, "generics/_get_customer_photos.html", {
  "response": json.dumps({
    "data": json_data,
    "status": "OK"
    })
  })
  return jsonLayout.render_template(request, "generics/_get_customer_photos.html", {
    "response": json.dumps({
      "status": "ERROR"
      })
    })

def _get_customer_bookings(request):
  get_request = request.GET
  session_id = request.session['user'][0]['pk']
  bookings = Merchant_Event_Sale.objects.filter(blp_customer_id=session_id, blp_merchant_event_sale_parent_id=0).select_related('blp_merchant').order_by('-id')
  jsonLayout = JSONLayout()
  if len(bookings)==0 or len(bookings)>0:
    # allData = bookings.to_json(path_or_buf = None, orient = 'records', date_format = 'epoch', double_precision = 10, force_ascii = True, date_unit = 'ms', default_handler = None)
    # print (allData)
    json_data = json.loads(serializers.serialize("json",bookings,use_natural_foreign_keys=True))
    return jsonLayout.render_template(request, "generics/_get_customer_bookings.html", {
  "response": json.dumps({
    "data": json_data,
    "status": "OK"
    })
  })
  return jsonLayout.render_template(request, "generics/_get_customer_bookings.html", {
    "response": json.dumps({
      "status": "ERROR"
      })
    })

def _change_photo_order(request):
   post_request = get_post_data(request)
   Photo = Merchant_Photo.objects.get(id=post_request['photo_id'])
   Photo.blp_merchant_photo_index=post_request['index']
   updateStatus = Photo.save()
   jsonLayout = JSONLayout()
   if updateStatus:
      return jsonLayout.render_template(request, "generics/_change_photo_order.html", {
                "response": json.dumps({
                        "data": None,
                        "status": "OK"
                })
       })
   return jsonLayout.render_template(request, "generics/_change_photo_order.html", {
                "response": json.dumps({
                        "data": None,
                        "status": "ERROR"
                })
        })



def scale_dimensions(width, height, max_width):
    if width > max_width:
        ratio = max_width*1./width
        return (int(width*ratio), int(height*ratio))
    return (width, height)

def _upload_photo(request):
   jsonLayout = JSONLayout()
   get_request = request.GET
   request_data = base64.b64decode(request.body)
   extension =  ("."+get_request['ext']) if  'ext' in  get_request.keys() else ""
   config = get_config()
   fileName = "IMG-"+str(uuid.uuid4())+extension
   fileNameThumb = "IMG-"+str(uuid.uuid4())+"-THUMB"+extension
   fileNameLarge = "IMG-"+str(uuid.uuid4())+"-LARGE"+extension
   session_id = int(request.session['venue'][0]['pk'])
   new_file = open(config['root_dir']+"third/media/{0}".format(fileName), 'wb+')
   new_file.write( request_data )
   new_file.close()
   new_file_check = open(config['root_dir']+"third/media/{0}".format(fileName),"rb").read()

   #Merchant_Photo.objects.filter( blp_merchant_id=session_id ).delete()

   fileOpened = Image.open(config['root_dir']+"third/media/{0}".format(fileName))
   fileOpened2 = Image.open(config['root_dir']+"third/media/{0}".format(fileName))
   fileOpenedWidth= scale_dimensions(fileOpened.size[0], fileOpened.size[1], config['photo_thumbnail_width'])
   newFileThumbnail = fileOpened.resize(fileOpenedWidth)
   fileOpenedWidth2 = scale_dimensions(  fileOpened2.size[0],fileOpened.size[1], config['photo_thumbnail_width'])
   newFileLarge = fileOpened2.resize(fileOpenedWidth2)
   fileOpened.save(config['root_dir']+"third/media/{0}".format(fileNameThumb))
   fileOpened2.save(config['root_dir']+"third/media/{0}".format(fileNameLarge))
   Photos = Merchant_Photo.objects.filter( blp_merchant_id=session_id )


   if new_file_check:
      Photo =  Merchant_Photo(
		blp_merchant_id=session_id,
		blp_merchant_photo_filename=fileName,
		blp_merchant_photo_filename_thumbnail=fileNameThumb,
		blp_merchant_photo_filename_large=fileNameLarge,
                blp_merchant_photo_index=len(Photos)
	)
      Photo.save()
      return jsonLayout.render_template(request, "generics/_upload_photo.html", {
		"response": json.dumps({
		"status": "OK"
		})
	})
   return jsonLayout.render_template(request, "generics/_upload_photo.html", {
		"response": json.dumps({
		"status": "ERROR"
		})
	})
def _upload_user_photo(request):
   jsonLayout = JSONLayout()
   get_request = request.GET
   request_data = base64.b64decode(request.body)
   extension =  ("."+get_request['ext']) if  'ext' in  get_request.keys() else ""
   config = get_config()
   fileName = "IMG-"+str(uuid.uuid4())+extension
   fileNameThumb = "IMG-"+str(uuid.uuid4())+"-THUMB"+extension
   fileNameLarge = "IMG-"+str(uuid.uuid4())+"-LARGE"+extension
   session_id = int(request.session['user'][0]['pk'])
   new_file = open(config['root_dir']+"third/media/customer_profile/{0}".format(fileName), 'wb+')
   new_file.write( request_data )
   new_file.close()
   new_file_check = open(config['root_dir']+"third/media/customer_profile/{0}".format(fileName),"rb").read()

   Customer_Photo.objects.filter( blp_customer_id=session_id ).delete()

   fileOpened = Image.open(config['root_dir']+"third/media/customer_profile/{0}".format(fileName))
   fileOpened2 = Image.open(config['root_dir']+"third/media/customer_profile/{0}".format(fileName))
   fileOpenedWidth= scale_dimensions(fileOpened.size[0], fileOpened.size[1], config['photo_thumbnail_width'])
   newFileThumbnail = fileOpened.resize(fileOpenedWidth)
   fileOpenedWidth2 = scale_dimensions(  fileOpened2.size[0],fileOpened.size[1], config['photo_thumbnail_width'])
   newFileLarge = fileOpened2.resize(fileOpenedWidth2)
   fileOpened.save(config['root_dir']+"third/media/customer_profile/{0}".format(fileNameThumb))
   fileOpened2.save(config['root_dir']+"third/media/customer_profile/{0}".format(fileNameLarge))
   Photos = Customer_Photo.objects.filter( blp_customer_id=session_id )


   if new_file_check:
      Photo =  Customer_Photo(
    blp_customer_id=session_id,
    blp_customer_photo_filename=fileName,
    blp_customer_photo_filename_thumbnail=fileNameThumb,
    blp_customer_photo_filename_large=fileNameLarge,
                blp_customer_photo_index=len(Photos)
  )
      Photo.save()
      return jsonLayout.render_template(request, "generics/_upload_user_photo.html", {
    "response": json.dumps({
    "status": "OK"
    })
  })
   return jsonLayout.render_template(request, "generics/_upload_user_photo.html", {
    "response": json.dumps({
    "status": "ERROR"
    })
  })

def _remove_photo(request):
   jsonLayout = JSONLayout()
   request_data = request.GET
   try:
     currentVenue = request.session['venue'][0]
     photoCheck = Merchant_Photo.objects.get(id=int(request_data['id']))

     if photoCheck.blp_merchant_id==currentVenue['pk']:
       fileName = photoCheck.blp_merchant_photo_filename
       idx = photoCheck.blp_merchant_photo_index
       Merchant_Photo.objects.filter(id=int(request_data['id'])).delete()
       AllPhotos = Merchant_Photo.objects.filter(blp_merchant_id=currentVenue['pk'])
       config = get_config()
       os.remove(config['root_dir']+"/third/media/{0}".format(fileName))
       for i in  AllPhotos:
         if i.blp_merchant_photo_index >  idx:
           i.blp_merchant_photo_index -= 1
           i.save()
       return jsonLayout.render_template(request, "generics/_remove_photo.html", {
                "response": json.dumps({
                "status": "OK"
                })
        })
   except Exception, e:
     print "Unable to delete photo: %s"%(e.__str__())

     return jsonLayout.render_template(request, "generics/_remove_photo.html", {
	  "response": json.dumps({
	   "status": "ERROR"
	  })
     })

   return jsonLayout.render_template(request, "generics/_remove_photo.html", {
	"response": json.dumps({
	  "status": "ERROR"
       })
      })


def _insert_sale(request):
   jsonLayout = JSONLayout()
   data = request.GET
   current_user = request.session['customer'][0]
   Event = Getter.get_event( data['id'] )
   new_sale = Sale.insert_new( current_user,  Event)
   if new_sale:
      return jsonLayout.render_template(request, "generics/_insert_sale.html", {
		"response": json.dumps({
			"status": "OK"
		})
	 })
   else:
      return jsonLayout.render_template(request, "generics/_insert_sale.html", {
		"response": json.dumps({
			"status": "ERROR"
		})
	 })
def _send_cron_notifications(request):
  getAllSales = Merchant_Event_Sale.objects.filter(blp_merchant_event_sale_scan_status='PENDING').select_related("blp_customer")
  dateTimeNow =  datetime.now()
  dateTimeNow = dateTimeNow + timedelta(days=1)
  dateStart=dateTimeNow.strftime("%Y-%m-%d")
  try:
    for sale in getAllSales:
      if dateStart == sale.blp_merchant_event_sale_date.strftime("%Y-%m-%d"):
        print 'starting to send mail'
        config = get_config()
        msg =MIMEMultipart('alternative')
        msg['Subject']="Reminder Mail"
        msg['From'] = config['app_email_fromname']
        msg['To'] =  sale.blp_customer.blp_customer_email
        htmltemplate = "<div>"
        htmltemplate += "<h3>Hello "+sale.blp_customer.blp_customer_first_name+" "+sale.blp_customer.blp_customer_last_name+ ",</h3>"
        htmltemplate += "<h4>You are having an event organized on "+ dateStart + "</h4>"
        htmltemplate += "</div>"
        part1 =  MIMEText(htmltemplate,'plain')
        msg.attach(part1)
        print htmltemplate
        s = smtplib.SMTP(config['smtp_host'], int(config['smtp_port']))
        s.ehlo()
        s.starttls()
        s.ehlo()
        s.login(config['smtp_username'], config['smtp_password'])
        s.sendmail(config['app_email_from'], to, msg.as_string())
        s.quit()
        print 'mail sent'
    return HttpResponse('True')
  except Exception, e:
    print 'going to catch'
    print e
    return HttpResponse('False')
  return HttpResponse('False')

def paypal_payment(request):
    datetimeobj = datetime.now() 
    alldata = request.GET
    reservation_date = alldata.get('reservationDate','') 
    if reservation_date!='':
        reservation_date = datetimeobj.strptime(reservation_date, "%Y-%m-%d")
        reservation_date_read=reservation_date.strftime("%d-%b-%Y")
        reservation_date = reservation_date.strftime("%m-%d-%Y")
    merchant_id = alldata.get('merchantId','')
    quantity_val = alldata.get('quantityVal','')
    merchant=Merchant.objects.get(id=merchant_id)
    merchant_name = merchant.blp_merchant_name
    reservation_city = merchant.blp_merchant_city
    
    selected_date=datetime.strptime(reservation_date,"%m-%d-%Y").date()
   # Calculatng unit Price
    try :
      merchant_event = Merchant_Event.objects.get(
                 blp_merchant_id=merchant_id,blp_merchant_event_date=selected_date
         )
      if merchant_event:
        # merchant_name=merchant_event.blp_merchant_id.blp_merchant_name
        unit_price = merchant_event.blp_merchant_event_unit_pricing
        event_type="True"
        
    except:
      event_type="False"
      selected_day=parser.parse(reservation_date).strftime("%A")
      day_selected =str.lower(selected_day)
      merchant_id = merchant_id
      merchant = Merchant.objects.get(id=merchant_id)
      day_pricing="blp_merchant_"+day_selected+"_unit_pricing"
      unit_price = getattr(merchant,day_pricing) 
    totalprice = float(quantity_val) *  float(unit_price)
    mainLayout = MainLayout()   
    return mainLayout.render_template(request, 'generics/paypal_payment.html',{'reservationDate':reservation_date,'merchantName':merchant_name,'quantityVal':quantity_val,'oneUnitPrice':unit_price,'reservationTotalAmt':totalprice,'merchantId':merchant_id,'reservationCity':reservation_city,'reservation_date_read':reservation_date_read})  

def ipn_check(request):
  alldata = request.POST
  transaction_id = alldata.get('txn_id','')

  try:
    payment_summary = pmt_summary.objects.get(transaction_id=transaction_id)
  except pmt_summary.DoesNotExist:
    payment_summary = None  

  if payment_summary!=None:
    payment_summary.ipn_status += 'Done'
    payment_summary.save()



  ipn_req=str(request.POST)
  fo = open("ipn.txt", "a")
  fo.write("\n");
  fo.write("-----------------------------------------------------------------------------");
  fo.write(ipn_req);
  fo.close()

  return HttpResponse('')


class payment_summary_form(forms.ModelForm):
    class Meta:
        model = pmt_summary
        fields = ('parent_id','transaction_id','ipn_status','text_paypal_payload','date','status')

def ppal_process(request):
    status = ''
    transaction_id = ''
    current_date = datetime.now()
    payment_json = ''
    mainLayout = MainLayout()
    config = get_config()
    state = 'Payment Successful'
    alldata = request.POST
    if request.POST:
      contact_first_name = alldata.get('contact_first_name','')
      contact_last_name = alldata.get('contact_last_name','')
      contact_email = alldata.get('contact_email','')
      contact_mobile = alldata.get('contact_mobile','')
      card_holder_first_name = alldata.get('card_holder_first_name','')
      card_holder_last_name = alldata.get('card_holder_last_name','')
      card_cvv = alldata.get('card_cvv','')
      card_month = alldata.get('card_month','')
      card_year = alldata.get('card_year','')
      card_type = alldata.get('card_type','')
      card_number = alldata.get('card_number','')
      quantity_val = alldata.get('quantity_val','')
      reservation_total_amt = alldata.get('reservation_total_amt','')
      price=alldata.get('price','')
      reservation_city=alldata.get('reservation_city','')
      one_unit_price=alldata.get('one_unit_price','')
      merchantName=alldata.get('merchant_name','')

      reservation_date=alldata.get('reservation_date','')
      merchant_id=alldata.get('merchant_id','')
      quantity_val=alldata.get('quantity_val','')
      reservation_total_amt=alldata.get('reservation_total_amt','')
      reservation_total_amt=float(reservation_total_amt)
      reservation_total_amt=format(reservation_total_amt, '.2f')
      event_type=alldata.get('special','False')
      reservationDate=alldata.get('reservationDate','')

      selected_date=datetime.strptime(reservation_date,"%m-%d-%Y").date()
      try :
        merchant_event = Merchant_Event.objects.get(
                   blp_merchant_id=merchant_id,blp_merchant_event_date=selected_date
           )
        if merchant_event:
          event_type="True"
      except:
        event_type="False"

      try:
          Customerss = Customer.objects.get(blp_customer_email=contact_email)
      except Customer.DoesNotExist:
          Customerss = None  

      if Customerss!=None:
        cust_id = Customerss.id
      else:
          blp_customer_active = 1   
          customer_record = Customer(blp_customer_first_name=contact_first_name,blp_customer_last_name=contact_last_name,blp_customer_phone_number=contact_mobile,blp_customer_email=contact_email,blp_customer_active=blp_customer_active,) 
          customer_record.save()
          cust_id = Customer.objects.get(blp_customer_email=contact_email).id



      my_api = paypalrestsdk.configure({
        'mode': config['paypal_mode'],
        'client_id': config['paypal_live_client_id'],
        'client_secret': config['paypal_live_client_secret']
        
      })


      my_data = {
                  "intent": "sale",
                  "payer": {
                    "payment_method": "credit_card",
                    "funding_instruments": [{
                      "credit_card":{
                        "type": card_type,
                        "number": card_number,
                        "expire_month": card_month,
                        "expire_year": card_year,
                        "cvv2": card_cvv,
                        "first_name": card_holder_first_name,
                        "last_name": card_holder_last_name
                        }
                        }]
                      },
                  "transactions": [{
                    "amount": {
                      "total":reservation_total_amt,
                      "currency": "USD" },
                    "description": "Barlinepass for "+ merchantName+", "+reservation_city }]
                }
    

      payment = paypalrestsdk.Payment(my_data, api=my_api) 
      print payment
      if payment.create():
        state = "Payment is Successful"
        payment_json = str(payment)
        
        fo = open("payment.txt", "a")
        fo.write("\n");
        fo.write("-----------------------------------------------------------------------------");
        fo.write(payment_json);
        fo.close()

        merchant_id =merchant_id
        merchant_event_id = ""

        sale_qty = int(quantity_val)
        price = reservation_total_amt
        unitPrice = (float(price)/float(sale_qty))

        customer = Customer.objects.get(id=cust_id)
        if  event_type == "False":
           sale_type="daily"
           selected_day=parser.parse(reservation_date).strftime("%A")
           day_selected =str.lower(selected_day)
           merchant_id = merchant_id
           merchant = Merchant.objects.get(id=merchant_id)
           day_key="blp_merchant_"+day_selected+"_qty"

           newqty = getattr(merchant,day_key) - sale_qty

           if day_selected == 'monday':
             merchant.blp_merchant_monday_qty = newqty
           elif day_selected == 'tuesday':
             merchant.blp_merchant_tuesday_qty = newqty
           elif day_selected == 'wednesday':
             merchant.blp_merchant_wednesday_qty = newqty
           elif day_selected == 'thursday':
             merchant.blp_merchant_thursday_qty = newqty
           elif day_selected == 'friday':
             merchant.blp_merchant_friday_qty = newqty
           elif day_selected == 'saturday':
             merchant.blp_merchant_saturday_qty = newqty
           elif day_selected == 'sunday':
             merchant.blp_merchant_sunday_qty = newqty
           a=merchant.save()
           if a:
            print "Quantity Successflully Updated ."
           print getattr(merchant,day_key)
        else:
           sale_type="special"
           selected_date=datetime.strptime(reservation_date,"%m-%d-%Y").date()
           merchant_event = Merchant_Event.objects.get(
                      blp_merchant_id=merchant_id,blp_merchant_event_date=selected_date
              )
           newqty = merchant_event.blp_merchant_event_qty - sale_qty
           merchant_event.blp_merchant_event_qty = newqty
           merchant_event.save()
           merchant_id = merchant_event.blp_merchant_id
           merchant_event_id = merchant_event.id
           merchant = Merchant.objects.get(id=merchant_id)

        datetimeobj = datetime.now()

        datetimeobj1 = datetimeobj.strptime(reservation_date, "%m-%d-%Y")
        dateToEmail = datetimeobj1.strftime("%B %d")
        day = datetimeobj.strftime("%A").lower()
        unique_id_for_qr_code = hashlib.md5(str(merchant_id)+str(cust_id)+str(merchant_event_id)+day).hexdigest()

        reservation_date=datetime.strptime(reservation_date,"%m-%d-%Y").date()
        MerchantSaleRecord = Merchant_Event_Sale(
               blp_customer_id=cust_id,
               blp_merchant_id=merchant_id,
               blp_merchant_event_id=merchant_event_id,
               blp_merchant_event_sale_type=sale_type,
               blp_merchant_event_sale_payment_status="OK",
               blp_merchant_event_sale_payment_date=datetimeobj.strftime("%Y-%m-%d %H:%M:%S"),
               blp_merchant_event_sale_scan_status="PENDING",
               blp_merchant_event_sale_scan_hash=unique_id_for_qr_code,
               blp_merchant_event_sale_date=reservation_date,
               blp_merchant_event_sale_qty=sale_qty,
               blp_merchant_event_sale_amount=price,
               blp_merchant_event_sale_unit_price=unitPrice,
               blp_merchant_event_sale_parent_id=0,
               blp_merchant_event_sale_qty_number="0"
         )
        MerchantSaleRecord.save()
        bulkMails = []
        qr_code_url=[]
        for qty in range(0,sale_qty):
          newqty = qty+1
          randString = uuid.uuid4().hex[:6].upper()
          qty_unique_id_for_qr_code = hashlib.md5(str(merchant_id)+str(cust_id)+str(merchant_event_id)+day+str(qty)+str(randString)).hexdigest()
          MerchantQtyRecord = Merchant_Event_Sale(
               blp_customer_id=cust_id,
               blp_merchant_id=merchant_id,
               blp_merchant_event_id=merchant_event_id,
               blp_merchant_event_sale_type=sale_type,
               blp_merchant_event_sale_payment_status="OK",
               blp_merchant_event_sale_payment_date=datetimeobj.strftime("%Y-%m-%d %H:%M:%S"),
               blp_merchant_event_sale_scan_status="PENDING",
               blp_merchant_event_sale_scan_hash=qty_unique_id_for_qr_code,
               blp_merchant_event_sale_date=reservation_date,
               blp_merchant_event_sale_qty=1,
               blp_merchant_event_sale_amount=price,
               blp_merchant_event_sale_unit_price=unitPrice,
               blp_merchant_event_sale_parent_id=MerchantSaleRecord.id,
               blp_merchant_event_sale_qty_number=(int(qty)+1)
         )
          MerchantQtyRecord.save()
          qr_code_url.append(qty_unique_id_for_qr_code)

          bulkMails.append(send_qr_code(qty_unique_id_for_qr_code,sale_type,customer, merchant, dateToEmail,newqty,MerchantSaleRecord.id,sale_qty))
        sendMails = send_mail_to_user(bulkMails)

        status = 'Done'
        if payment.transactions and payment.transactions[0].related_resources and payment.transactions[0].related_resources[0].sale and payment.transactions[0].related_resources[0].sale.id:
          transaction_id = payment.transactions[0].related_resources[0].sale.id
        instance = pmt_summary(text_paypal_payload=payment_json,date=current_date,parent_id=MerchantSaleRecord.id,status=status,transaction_id=transaction_id) 
        instance.save()
        
        blp_merchant_event_sale_parent_id_thanks = str(MerchantSaleRecord.id)

        return HttpResponseRedirect('/generics/paypal_thanks/?%s' % 'state='+state+'&blp_merchant_event_sale_parent_id_thanks='+blp_merchant_event_sale_parent_id_thanks+'&customer_fname='+contact_first_name+'&merchant_name='+merchant.blp_merchant_name+'&error='+'none'+'&url='+config['root_url']+'&blp_date='+dateToEmail)

      else:
        status = 'Error'
        state = 'Payment Cancelled'
        payment_error = str(payment.error)
        print payment_error
        fo = open("payment.txt", "a")
        fo.write("\n");
        fo.write("-----------------------------------------------------------------------------");
        fo.write(payment_error);
        fo.close()

        instance = pmt_summary(text_paypal_payload=payment_error,date=current_date,status=status) 
        instance.save()

      
  
    return HttpResponseRedirect('/generics/paypal_thanks/?%s' % 'state='+state+'&customer_fname='+contact_first_name+'&done='+'none'+'&url='+config['root_url'])


def paypal_thanks(request):
    list1 = []
    image_ids = []
    mainLayout = MainLayout()
    alldata = request.GET

    url = alldata.get('url')
    state = alldata.get('state')
    state = urllib.unquote(state)
    customer_fname = alldata.get('customer_fname')
    done = alldata.get('done')
    if done!=None:
      return mainLayout.render_template(request, 'generics/paypal_thanks.html',{'state':state,'customer_fname':customer_fname,'done':done,'url':url})      

    blp_date = alldata.get('blp_date')
    blp_date = urllib.unquote(blp_date)
    img = list(image_ids)
    error = alldata.get('error')
    merchant_name = alldata.get('merchant_name')

    blp_merchant_event_sale_parent_id_thanks = int(alldata.get('blp_merchant_event_sale_parent_id_thanks'))
    try:
      blp_merchant = Merchant_Event_Sale.objects.filter(blp_merchant_event_sale_parent_id=blp_merchant_event_sale_parent_id_thanks)
    except Merchant_Event_Sale.DoesNotExist:
      blp_merchant = None  

    if blp_merchant!=None:
      for val in blp_merchant:
        list1.append(val.blp_merchant_event_sale_scan_hash)
      if list1:
        image_ids = list1  


    return mainLayout.render_template(request, 'generics/paypal_thanks.html',{'state':state,'image_ids':image_ids,'customer_fname':customer_fname,'merchant_name':merchant_name,'error':error,'url':url,'blp_date':blp_date})
  
