from layout import ViewLayout,JSONLayout,MainLayout
from blp_backend import Getter,PaymentProcessor,Events,Sales,get_day_of_week,send_qr_code,send_mail_to_user
from functions import get_config,get_cities
import datetime
from blp_app.home.models import *
import hashlib
import json
from django.http.response import HttpResponse
import uuid

def solve(s):
   return re.sub(r'(\d)(st|nd|rd|th)', r'\1', s)
def get_post_data(request):
   request_key = request.POST.keys()
   return json.loads(request_key[0])
def get_current_user():
   pass

def _setsession(request):
  dataObj = get_post_data( request )
  qty = dataObj['quantityVal']
  selected_date = dataObj['reservationDate']
  dd = dataObj['reservationDate'].split("-")
  selected_date1 = dd[1]+'-'+dd[2]+'-'+dd[0]
  request.session['reservation_qty'] = qty
  request.session['reservation_selected_date'] = selected_date
  request.session['reservation_selected_date1'] = selected_date1
  return True

def singleView(request):
  venue =  int(request.GET['venue_id'])
  config = get_config()
  try:
    if 'reservation_selected_date' in request.session:
      qty = request.session['reservation_qty']
      qty = qty[:1]
      if qty == 'g':
        qty = 1
      else:
        qty = qty
      selected_date = request.session['reservation_selected_date']
      selected_date1 = request.session['reservation_selected_date1']

      converteddate = datetime.datetime.strptime(selected_date, "%Y-%m-%d").date()
      #print converteddate
      today_day = converteddate.strftime("%w")
    #  print today_day + ' is day no'
    #  print qty+' is session qty'
    else:
      qty = int('1')
      now = datetime.datetime.now()
      selected_date = now.strftime("%Y-%m-%d")
      selected_date1 = now.strftime("%m-%d-%Y")
      today_day = now.strftime("%w")
      #print qty+' is not in session qty & date' + selected_date+ ' name of day' + today_day
  except Exception as e:
    qty = int('1')
    now = datetime.datetime.now()
    selected_date = now.strftime("%Y-%m-%d")
    selected_date1 = now.strftime("%m-%d-%Y")
    today_day = now.strftime("%w")
    #print qty+' is not in session qty & date' + selected_date+ ' name of day' + today_day



  try:
    merchantInfo =  Merchant_Event.objects.get(blp_merchant_event_date= selected_date, blp_merchant_id = venue)
    result = Merchant.objects.get(id=venue)
    similarVenuesResults = Merchant.objects.filter(blp_merchant_city=result.blp_merchant_city)
    similarVenues = similarVenuesResults.exclude(id=result.id)
    for similarVenuesResult in similarVenues:
      vid = int(similarVenuesResult.id)
      similarVenuesResultPicture = Merchant_Photo.objects.filter(blp_merchant_id=vid)[:1]
      for similarVenuesResultp in similarVenuesResultPicture:
        similarVenuesResult.picture = similarVenuesResultp.blp_merchant_photo_filename_thumbnail
    picsresult = Merchant_Photo.objects.filter(blp_merchant_id=merchantInfo.blp_merchant_id)
    mainLayout = MainLayout()
    totalprice = float(qty) *  float(merchantInfo.blp_merchant_event_unit_pricing)
    return  mainLayout.render_template(request, "listings/singleview.html", {
     "venue":venue,
      "listings": result,
      "qty" : qty,
      "picsresults" : picsresult,
      "similarVenues" : similarVenues,
      "totalqty" : merchantInfo.blp_merchant_event_qty_total,
      "price" : merchantInfo.blp_merchant_event_unit_pricing,
      "totalprice" : totalprice,
      "selected_date":selected_date,
      "selected_date1":selected_date1,
      "special" : True,
      "url" : config['root_url'],
      "default_img" : config['default_photo_path'],
      "facebook_app_id" : config['facebook_app_id']
    })
  except Merchant_Event.DoesNotExist:
    try:
      result = Merchant.objects.get(id=venue)
      picsresult = Merchant_Photo.objects.filter(blp_merchant_id=result.id)
      similarVenuesResults = Merchant.objects.filter(blp_merchant_city=result.blp_merchant_city)
      similarVenues = similarVenuesResults.exclude(id=result.id)
      for similarVenuesResult in similarVenues:
        vid = int(similarVenuesResult.id)
        similarVenuesResultPicture = Merchant_Photo.objects.filter(blp_merchant_id=vid)[:1]
        for similarVenuesResultp in similarVenuesResultPicture:
          similarVenuesResult.picture = similarVenuesResultp.blp_merchant_photo_filename_thumbnail


      price = ''
      #print today_day
      if today_day == '0':
        price = result.blp_merchant_sunday_unit_pricing
      if today_day == '1':
        price = result.blp_merchant_monday_unit_pricing
      if today_day == '2':
        price = result.blp_merchant_tuesday_unit_pricing
      if today_day == '3':
        price = result.blp_merchant_wednesday_unit_pricing
      if today_day == '4':
        price = result.blp_merchant_thursday_unit_pricing
      if today_day == '5':
        price = result.blp_merchant_friday_unit_pricing
      if today_day == '6':
        price = result.blp_merchant_saturday_unit_pricing
      mainLayout = MainLayout()
      totalprice = float(qty) *  float(price)
      config = get_config();
      return  mainLayout.render_template(request, "listings/singleview.html", {
  	   "venue":venue,
  	    "listings": result,
        "picsresults" : picsresult,
        "similarVenues" : similarVenues,
        "qty":qty,
        "price" :price,
        "totalprice" : totalprice,
        "selected_date":selected_date,
        "selected_date1":selected_date1,
        "special" : False,
        "url" : config['root_url'],
        "default_img" : config['default_photo_path'],
        "facebook_app_id" : config['facebook_app_id']
      })
    except Exception as e:
      mainLayout = MainLayout()
      return  mainLayout.render_template(request, "listings/not_found.html", {
  	   "venue":venue
       })




def view(request):
  city = request.GET['city']
  if 'qty' in request.GET:
    qty = request.GET['qty']
  else:
    qty = 1
  if 'date' in request.GET:
    selected_date = request.GET['date']
    dd = request.GET['date'].split("-")
    selected_date1 = dd[1]+'-'+dd[2]+'-'+dd[0]
  else:
    now = datetime.datetime.now()
    selected_date = now.strftime("%Y-%m-%d")
    selected_date1 = now.strftime("%m-%d-%Y")
  config = get_config()
  cities = get_cities()
  mainLayout = MainLayout()
  request.session['reservation_qty'] = qty
  request.session['reservation_selected_date'] = selected_date
  request.session['reservation_selected_date1'] = selected_date1
  return  mainLayout.render_template(request, "listings/view.html", {
    "city":city,
	  "cities":cities,
    "qty" : qty,
    "selected_date": selected_date,
    "selected_date1": selected_date1,
    "facebook_app_id": config['facebook_app_id'],
	 #"listings": results
  })
def browse(request):
  city = request.GET['city']
  qty = 1
  now = datetime.datetime.now()
  selected_date = now.strftime("%Y-%m-%d")
  selected_date1 = now.strftime("%m-%d-%Y")

  config = get_config()
  cities = get_cities()
  mainLayout = MainLayout()
  request.session['reservation_qty'] = qty
  request.session['reservation_selected_date'] = selected_date
  request.session['reservation_selected_date1'] = selected_date1
  return  mainLayout.render_template(request, "listings/browse.html", {
    "city":city,
    "cities":cities,
    "qty" : qty,
    "selected_date": selected_date,
    "selected_date1": selected_date1,
    "facebook_app_id": config['facebook_app_id'],
   #"listings": results
  })
def thanks(request):
  mainLayout = MainLayout()
  session_customer = request.session['user'][0]
  merchant_id = ""
  merchant_event_id = ""
  get_data = request.GET
  paymentId = get_data['paymentId']
  token = get_data['token']
  PayerID = get_data['PayerID']
  sale_type = get_data['type']
  event_sale_date = get_data['date']
  sale_qty = int(get_data['qty'])
  price = get_data['price']
  unitPrice = (float(price)/float(sale_qty))
  if session_customer:
    try:
      if paymentId:
        PaymentProcessor.execute_payment(paymentId, PayerID)
    except Exception, e:
      raise e
    customer = Customer.objects.get(id=session_customer['pk'])
    if  get_data['type'] == "daily":
       day_selected = get_data['day']
       merchant_id = get_data['merchant_id']
       merchant = Merchant.objects.get(id=merchant_id)
       day_key="blp_merchant_"+get_data['day']+"_qty"
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
       merchant.save()
       print getattr(merchant,day_key)
    else:
       merchant_event = Merchant_Event.objects.get(
                  id=get_data['event_id']
          )
       newqty = merchant_event.blp_merchant_event_qty - sale_qty
       print newqty
       merchant_event.blp_merchant_event_qty = newqty
       merchant_event.save()
       merchant_id = merchant_event.blp_merchant_id
       merchant_event_id = merchant_event.id
       merchant = Merchant.objects.get(id=merchant_id)

    datetimeobj = datetime.datetime.now()
    datetimeobj1 = datetimeobj.strptime(event_sale_date, "%Y-%m-%d")
    dateToEmail = datetimeobj1.strftime("%B %d")
    day = datetimeobj.strftime("%A").lower()
    unique_id_for_qr_code = hashlib.md5(str(merchant_id)+str(customer.id)+str(merchant_event_id)+day).hexdigest()
    ## add new sale record
    MerchantSaleRecord = Merchant_Event_Sale(
           blp_customer_id=customer.id,
           blp_merchant_id=merchant_id,
           blp_merchant_event_id=merchant_event_id,
           blp_merchant_event_sale_type=sale_type,
           blp_merchant_event_sale_payment_status="OK",
           blp_merchant_event_sale_payment_date=datetimeobj.strftime("%Y-%m-%d %H:%M:%S"),
           blp_merchant_event_sale_scan_status="PENDING",
           blp_merchant_event_sale_scan_hash=unique_id_for_qr_code,
           blp_merchant_event_sale_date=event_sale_date,
           blp_merchant_event_sale_qty=sale_qty,
           blp_merchant_event_sale_amount=price,
           blp_merchant_event_sale_unit_price=unitPrice,
           blp_merchant_event_sale_parent_id=0,
           blp_merchant_event_sale_qty_number="0"
     )
    MerchantSaleRecord.save()
    bulkMails = []
    for qty in range(0,sale_qty):
      newqty = qty+1
      randString = uuid.uuid4().hex[:6].upper()
      qty_unique_id_for_qr_code = hashlib.md5(str(merchant_id)+str(customer.id)+str(merchant_event_id)+day+str(qty)+str(randString)).hexdigest()
      MerchantQtyRecord = Merchant_Event_Sale(
           blp_customer_id=customer.id,
           blp_merchant_id=merchant_id,
           blp_merchant_event_id=merchant_event_id,
           blp_merchant_event_sale_type=sale_type,
           blp_merchant_event_sale_payment_status="OK",
           blp_merchant_event_sale_payment_date=datetimeobj.strftime("%Y-%m-%d %H:%M:%S"),
           blp_merchant_event_sale_scan_status="PENDING",
           blp_merchant_event_sale_scan_hash=qty_unique_id_for_qr_code,
           blp_merchant_event_sale_date=event_sale_date,
           blp_merchant_event_sale_qty=1,
           blp_merchant_event_sale_amount=price,
           blp_merchant_event_sale_unit_price=unitPrice,
           blp_merchant_event_sale_parent_id=MerchantSaleRecord.id,
           blp_merchant_event_sale_qty_number=(int(qty)+1)
     )
      MerchantQtyRecord.save()
      bulkMails.append(send_qr_code(qty_unique_id_for_qr_code,sale_type,customer, merchant, dateToEmail,newqty,MerchantSaleRecord.id,sale_qty))
    #return HttpResponse(bulkMails)
    sendMails = send_mail_to_user(bulkMails)
    # for mail in bulkMails:
    #   return HttpResponse(mail['blp_customer_email'])
    return mainLayout.render_template(request,"listings/thanks.html", {"barName":merchant.blp_merchant_name})


def validate_qrhash(request):
  mainLayout = MainLayout()
  hashKey = request.GET['hash']
  sale = Getter.get_sale_by_qrhash(hashKey)
  event = None

  if 'venue' in request.session.keys() and request.session['venue']:
    nnow = datetime.datetime.now()
    if sale:
      if request.session['venue'][0]['pk'] == sale.blp_merchant_id:
        qtyRemaining = '';
        if sale.blp_merchant_event_sale_type == "daily":
          listing = Getter.get_daily_event_by_sale(  sale  )
          date_of_week = sale.blp_merchant_event_sale_date.strftime("%A").lower()
          qty_check = "blp_merchant_"+date_of_week+"_qty"
          merchantObj = Merchant.objects.get(pk=sale.blp_merchant_id)
          if date_of_week == 'monday':
			 qtyRemaining = merchantObj.blp_merchant_monday_qty
          elif date_of_week == 'tuesday':
			 qtyRemaining = merchantObj.blp_merchant_tuesday_qty
          elif date_of_week == 'wednesday':
			 qtyRemaining = merchantObj.blp_merchant_wednesday_qty
          elif date_of_week == 'thursday':
			 qtyRemaining = merchantObj.blp_merchant_thursday_qty
          elif date_of_week == 'friday':
			 qtyRemaining = merchantObj.blp_merchant_friday_qty
          elif date_of_week == 'saturday':
			 qtyRemaining = merchantObj.blp_merchant_saturday_qty
          elif date_of_week == 'sunday':
			 qtyRemaining = merchantObj.blp_merchant_sunday_qty
          print qtyRemaining

        else:
          listing =  Getter.get_special_event_by_sale( sale )
          merchantEventObj = Merchant_Event.objects.get( pk=sale.blp_merchant_event_id)
          #print merchantEventObj.values()
          qtyRemaining = merchantEventObj.blp_merchant_event_qty

        customer = Customer.objects.get(id=sale.blp_customer_id)
        #PENDING
        if sale.blp_merchant_event_sale_scan_status == "PENDING":
          sale.blp_merchant_event_sale_scan_status = "CHECKED"
          sale.blp_merchant_event_sale_scan_date=nnow.strftime("%Y-%m-%d %H:%M:%S")
          sale.save()

          totalTicketsSold = Getter.get_total_sold_tickets(request.session['venue'][0]['pk'])
          totalTicketsScanned = Getter.get_total_scanned_tickets(request.session['venue'][0]['pk'])
          totalTicketsAvailable = Getter.get_total_available_tickets(request.session['venue'][0]['pk'])
          saleDate =  datetime.datetime.strptime(listing['listing']['date'],"%Y-%m-%d")
          return mainLayout.render_template(request,"listings/validate_qrhash.html", {
            "status": "OK",
            "sale": sale,
            "customer": customer,
            "listing":  listing,
            "totalTicketsSold": totalTicketsSold,
            "totalTicketsScanned": totalTicketsScanned,
            "totalTicketsAvailable": totalTicketsAvailable,
            "qtyRemaining": qtyRemaining,
            "msg": "This QR code is good to go!",
            "saleDate":saleDate,
            "response": "confirm"
          })
        else:
          return mainLayout.render_template(request, "listings/validate_qrhash.html", {
            "status": "OK",
            "sale": sale,
            "customer": customer,
            "listing": listing,
            "msg": "Could not check the QR Code. As it was already checked",
            "response": "waiting"
          })


      else:
        return mainLayout.render_template(request, "listings/validate_qrhash.html", {
          "status": "OK",
          "msg": "This QR Code is not our venue",
          "response": "waiting"
        })
    else:
      return mainLayout.render_template(request, "listings/validate_qrhash.html", {
          "status": "OK",
          "msg": "Sorry!, Sale not found",
          "response": "waiting"
        })
  elif  'user' in request.session.keys() and request.session['user']:
    return mainLayout.render_template(request, "listings/validate_qrhash.html", {
      "status": "OK",
      "msg": "Welcome User, you conld not scan QR code",
      "response": "waiting"
    })
  else:
    return mainLayout.render_template(request, "listings/validate_qrhash.html", {
      "status": "OK",
      "msg": "Please Login",
      "response": "waiting"
    })


def error(request):
  mainLayout = MainLayout()
  return mainLayout.render_template(request,"listings/error.html", {})

def _book(request):
  request = get_post_data( request )
  qty = int(request['qtySelected'])
  totalPrice = request['totalPrice']
  listing = request['listing']
  return_payment = ""
  jsonLayout = JSONLayout()
  if listing:
    print "LLLLLLLLLLLLLLLLLLLLLLLL",listing
    check1 = Events.is_available(listing,qty)
    if check1:
      # return_payment = PaymentProcessor.process_payment(totalPrice, listing, qty)
      return_payment=True
      print " return_payment ",return_payment
    if return_payment:
      return jsonLayout.render_template(request,"listings/_book.html",{
        "response": json.dumps({
        "status": "OK",
        "data": return_payment
        })
      })
    else:
      return jsonLayout.render_template(request,"listings/_book.html",{
        "response": json.dumps({
        "status": "ERROR",
        "message": "Unable to process payment please try again"
        })
      })
  else:
    return jsonLayout.render_template(request, "listings/_book.html", {
  		"response": json.dumps({
  			"status": "ERROR",
  			"message": "Event unavailable at this date for the posted quantity"
  		})
	  })



#def _list(request):
