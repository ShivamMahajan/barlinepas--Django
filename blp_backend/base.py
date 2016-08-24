from  blp_app.home.models import *
from settings.default import *
import paypalrestsdk
from paypalrestsdk import Payment
from django.core import serializers
from datetime import datetime
from functions import get_config
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.db.models import Q
from email.mime.image import MIMEImage
from urllib import quote_plus
import requests
import smtplib
import re
import time
import json
import hashlib
import uuid
from django.http.response import HttpResponse

def default_photo():
   config = get_config()
   return  config['default_photo_path']

def get_timesplit_day( days_ahead ):
   #datetime.par
   timesplit = time.time() + (days_ahead*(3600*24))
   datetimeDateObject = datetime.fromtimestamp(timesplit)
   return datetimeDateObject
def get_day_of_week( dateObject, days_ahead=0 ):
   #datetime.par
   #timesplit = time.time() + (days_ahead+(3600*24))
   dateTimeNow = datetime.now()
   datetimeobj  = dateTimeNow.strptime(dateObject, "%Y-%m-%d %H:%M:%S")
   dayofweek = datetimeobj.strftime("%A")
   return dayofweek.lower()
def get_date_obj(dateString):
   dateTimeNow = datetime.now()
   datetimeobj = dateTimeNow.strptime(dateObject, "%Y-%m-%d")
   return datetimeobj
def two_decimal(input_str):
   return "%.2f"%(float(input_str))
def render_email_template(template,replacements):
   current_template = template
   for i in  replacements.keys():
     current_template = re.sub(r"""\{""" + i + r"""\}""", replacements[i], current_template)
   return current_template
def render_text_template(template,replacements):
   return template

## get the subject
## of the email
## TODO: extend when more emails are added
def get_email_subject( emailTemplateType ):
    emailSubjects = dict(
         QR="BarlinePass Event QRCode",
         FORGOT="BarlinePass Password Reset",
         REGISTRATION="BarlinePass Registration"
       )

    return emailSubjects[emailTemplateType]

def get_email_template( emailTemplateType ):
   config = get_config()
   email_template = open(config['root_dir']+"/emails/"+emailTemplateType, "r+").read()
   return email_template

def send_qr_code(uuuid,saletype,customer,merchant, event_sale_date,qrNumber,saleId, sale_qty):
   qr_code = get_qr_code(uuuid)
   status = False
   if qr_code:
     status = email_qrcode_venue(qr_code,saletype,customer,merchant,event_sale_date,qrNumber,saleId, sale_qty)
   return status

def send_mail_to_user(bulkMails):
   try:
     config = get_config()
     #img_data = open(replacements, 'rb').read()
     
     s = smtplib.SMTP(config['smtp_host'], int(config['smtp_port']))
     s.ehlo()
     s.starttls()
     s.ehlo()
     s.login(config['smtp_username'], config['smtp_password'])

     for mail in bulkMails:
      msg =MIMEMultipart('alternative')
      msg['From'] = config['app_email_fromname']
      msg['Subject']=mail['subject']
      msg['To'] = mail['blp_customer_email']
      part1 =  MIMEText(mail['customertexttemplate'],'plain')
      part2 = MIMEText(mail['customerhtmltemplate'], 'html')
      msg.attach(part1)
      msg.attach(part2)
      s.sendmail(config['app_email_from'], mail['blp_customer_email'], msg.as_string())
     s.quit()
     return True
   except Exception, e:
     return False

def get_qr_code(uuuid):

   config = get_config()
   url =  config['root_url']+"listings/validate_qrhash?hash={0}".format(uuuid)
   # id for the code
   qr_code_api_base = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+quote_plus( url )
   fileName = "QR-CODE-{0}.png".format(uuuid)
   try:
     content = requests.get( qr_code_api_base).content
     #print "QR Code response data was: %s" %(content)
     config = get_config()
     newfile = open( config['root_dir'] + "/third/media/{0}".format( fileName ), 'wb+' )
     newfile.write(content)
     newfile.close()
     return_data = dict(src="{0}".format(fileName), width=150, height=150,
                url=config['root_url']+"media/{0}".format(fileName)
                )

     print "Rendered QR Code %s" % ( return_data.__str__() )
     return return_data
   except Exception, e:
     print "Could not fetch QR code for reason %s"%(e.__str__())
     return False

## one object for both email replacements
def get_replacements(customer,merchant):
   return dict(
         blp_merchant_name=merchant.blp_merchant_name,
         blp_customer_username=customer.blp_customer_username,
         blp_customer_email=customer.blp_customer_email,
         blp_customer_first_name=customer.blp_customer_first_name,
         blp_customer_last_name=customer.blp_customer_last_name
    )

def email_qrcode_venue(qr_code, saletype, customer,merchant,event_sale_date,qrNumber,saleId,sale_qty):
    #get_qr_code = gen_qr_code_url( saleid,eventidormerchantid)
    result = False
    #venue = Venue.get(
    if qr_code:
       replacements = get_replacements(customer,merchant)
       merchanttemplate = get_email_template("QR-MERCHANT")
       customertemplate = get_email_template("QR-CUSTOMER")
       subject = "BarlinePass QR Code for "+merchant.blp_merchant_name
       #subject = get_email_subject("QR")

       replacements['qrcode'] = qr_code['url']
       replacements['event_sale_date']=event_sale_date
       replacements['qrNumber']=str(qrNumber)
       replacements['saleId']=str(saleId)
       replacements['saleQty']=str(sale_qty)


       #result = send_mail(merchant.blp_merchant_email,merchanttemplate, replacements)

       customerhtmltemplate = render_email_template(customertemplate,replacements)
       customertexttemplate = render_text_template(customertemplate,replacements)
       #result = send_email(customer.blp_customer_email, subject, customertexttemplate, customerhtmltemplate, replacements)
       result = dict(
         blp_customer_email=customer.blp_customer_email,
         subject=subject,
         customertexttemplate=customertexttemplate,
         customerhtmltemplate=customerhtmltemplate,
         replacements=replacements
        )
       #print "Sending mail to: %s,\n%s" % (customer.blp_customer_email, customerhtmltemplate)
    return result


def send_email(to,subject,texttemplate,htmltemplate,replacements):
   try:
     config = get_config()
     #img_data = open(replacements, 'rb').read()
     msg =MIMEMultipart('alternative')
     msg['Subject']=subject
     msg['From'] = config['app_email_fromname']
     msg['To'] = to
     part1 =  MIMEText(texttemplate,'plain')
     part2 = MIMEText(htmltemplate, 'html')
     msg.attach(part1)
     msg.attach(part2)
     #image = MIMEImage(img_data, name=os.path.basename(replacements))
     #msg.attach(image)
     s = smtplib.SMTP(config['smtp_host'], int(config['smtp_port']))
     s.ehlo()
     s.starttls()
     s.ehlo()
     s.login(config['smtp_username'], config['smtp_password'])
     s.sendmail(config['app_email_from'], to, msg.as_string())
     s.quit()
     return True
   except Exception, e:
     return False

def send_user_reset_link(user):
    config = get_config()
    hash_key =Getter.get_user_hash(user)
    replacements = dict(
         blp_customer_email=user.blp_customer_email,
         blp_customer_first_name=user.blp_customer_first_name,
         blp_customer_last_name=user.blp_customer_last_name,
         url=config['root_url'],
         hash=hash_key
     )
    text = get_email_template("FORGOT-CUSTOMER")
    subject = get_email_subject("FORGOT")
    emailtemplate = render_email_template( text, replacements )
    texttemplate = render_text_template( text,  replacements )
    return send_email(user.blp_customer_email, subject, texttemplate, emailtemplate, replacements)
def send_venue_reset_link(venue):
   config=get_config()
   hash_key = Getter.get_venue_hash(venue)
   replacements =dict(
         blp_merchant_email=venue.blp_merchant_email,
         blp_merchant_name=venue.blp_merchant_name,
         url=config['root_url'],
         hash=hash_key
   )
   text = get_email_template("FORGOT-MERCHANT")
   subject = get_email_subject("FORGOT")
   emailtemplate = render_email_template(text,replacements)
   texttemplate = render_text_template(text, replacements)
   return send_email(venue.blp_merchant_email, subject, texttemplate, emailtemplate,replacements)
def send_venue_registration_email(venue):
   config = get_config()
   replacements = dict(
         blp_merchant_email=venue.blp_merchant_email,
         blp_merchant_name=venue.blp_merchant_name,
         url=config['root_url'],
         blp_merchant_random_string=venue.blp_merchant_random_string
   )
   text = get_email_template("REGISTRATION-MERCHANT")
   subject = 'BarLinePass Venue Verification'
   emailtemplate = render_email_template(text,replacements)
   texttemplate = render_text_template(text,replacements)
   return send_email( venue.blp_merchant_email, subject, texttemplate, emailtemplate, replacements)
def send_user_registration_email(customer):
   config = get_config()
   replacements = dict(
         blp_customer_email=customer.blp_customer_email,
         blp_customer_first_name=customer.blp_customer_first_name,
         blp_customer_last_name=customer.blp_customer_last_name,
         url=config['root_url'],
         blp_customer_random_string=customer.blp_customer_random_string
   )
   text = get_email_template("REGISTRATION-CUSTOMER")
   subject = 'BarLinePass User Verification'
   emailtemplate = render_email_template(text, replacements)
   texttemplate = render_text_template(text,replacements)
   return send_email( customer.blp_customer_email, subject, texttemplate, emailtemplate, replacements)

def sort_by_index(pictures):
   photos = []
   index= 0
   while len(photos)!=len(pictures):
     for i in pictures:
        if i.blp_merchant_photo_index==index:
           photos.append(
                i
            )
           index+=1
           break
   return photos




class Getter(object):
  @staticmethod
  def get_bars_by_city(cityObj):
    results = []
    objects=Merchant.objects.filter(blp_merchant_city=cityObj['value'])
    for i  in objects:
        merchant_photos = Getter.get_merchant_photos(i)
        this_merchant = dict(merchant=Getter.get_serialized_merchant(i),photos=dict(
                        photos=  merchant_photos,
                        mainPhoto=merchant_photos[0]['fields']['blp_merchant_photo_filename'] if len(merchant_photos)>0 else default_photo()
                ))
        results.append(this_merchant)
    return results

  @staticmethod
  def get_merchants_by_city(cityObj,startDate,endDate):
	## {"merchant": {}, "photos":{}, "listings"[{ "type": "daily" }, {"type": "special" }]
	##
     results = []
     day_of_week = get_day_of_week( startDate )
     print 'good'
     print "Getting Listing Date for date: %s, on %s"%(startDate,day_of_week)
     objects=Merchant.objects.filter(blp_merchant_city=cityObj['value'])
     price_check = "blp_merchant_"+day_of_week+"_unit_pricing"
     quantity_check1 = "blp_merchant_"+day_of_week+"_qty_total"
     quantity_check2  = "blp_merchant_"+day_of_week+"_qty"
     for i  in objects:
        merchant_photos = Getter.get_merchant_photos(i)
        this_merchant = dict(merchant=Getter.get_serialized_merchant(i),listings=[],photos=dict(
                        photos=  merchant_photos,
                        mainPhoto=merchant_photos[0]['fields']['blp_merchant_photo_filename'] if len(merchant_photos)>0 else default_photo()
                ))


        datetimenow = datetime.now()
        if Getter.day_of_week_check( i, price_check ):
	   this_merchant['listings'].append(Getter.generate_daily_event( i, price_check, quantity_check1, quantity_check2, day_of_week, datetimenow ) )
        for num in range(1, 28):

           listing_of_date_obj =  get_timesplit_day(num)
           listing_of_date = listing_of_date_obj.strftime("%A").lower()
           quantity_check1_1 = "blp_merchant_"+listing_of_date+"_qty_total"
           quantity_check1_2 = "blp_merchant_"+listing_of_date+"_qty"
           price_check1 = "blp_merchant_"+listing_of_date+"_unit_pricing"

           if Getter.day_of_week_check( i, price_check1 ):
             this_merchant['listings'].append(Getter.generate_daily_event( i, price_check1, quantity_check1_1, quantity_check1_2, listing_of_date,listing_of_date_obj))
        #objects2 = Merchant_Event.objects.get(blp_merchant_id=i.id, blp_merchant_event_date__gte=dateStart,blp_merchant_event_date__lte=dateEnd)
    	objects2 = Merchant_Event.objects.filter(blp_merchant_id=i.id)

        if len(objects2)>0:
          for j in objects2:
             this_merchant['listings'].append(Getter.generate_special_event( i, j ) )
        results.append(this_merchant)

     return results
  @staticmethod
  def day_of_week_check( merchantData, dayOfWeek ):
    if getattr(merchantData,dayOfWeek)!="0.00":
      return True
    return False
  @staticmethod
  def get_serialized_merchant(merchant):
     merchants = json.loads(serializers.serialize("json",[merchant]))
     return merchants[0]

  @staticmethod
  def get_merchant(id):
      merchant = Merchant.objects.get(id=id)
      return merchant
  @staticmethod
  def get_merchant_by_event(eventid):
      event = Merchant_Event.objects.get(id=eventid)
      merchant = Merchant.Objects.get(id=event.blp_merchant_id)
      return merchant
  @staticmethod
  def generate_daily_event(merchant_data, price_check, qty_check1, qty_check2, day_of_week, date_obj):
      event_data = dict()
      photos = Getter.get_merchant_photos(merchant_data)
      event_data['unit_price']=two_decimal(getattr(merchant_data,price_check))
      event_data['quantity']=getattr(merchant_data,qty_check1)
      event_data['quantity_remaining']=getattr(merchant_data,qty_check2)
      event_data['merchant']= Getter.get_serialized_merchant(merchant_data)
      event_data['photos']=photos
      event_data['mainPhoto']= photos[0]['fields']['blp_merchant_photo_filename'] if len(photos)>0 else default_photo()
      datetimenow = datetime.now()
      event_data['listing'] = dict(
	   	type="daily",
		id=None,
	 	date=date_obj.strftime("%Y-%m-%d"),
	  	unit_price=event_data['unit_price'],
		merchant_id=event_data['merchant']['pk'],
		quantity=getattr(merchant_data,qty_check1),
		quantity_remaining=getattr(merchant_data,qty_check2),
		day=day_of_week,
		title="Daily Listing For {0}".format(day_of_week),
		event_name="Bought BLP to "+merchant_data.blp_merchant_name+" for "+date_obj.strftime("%m-%d-%Y"),
    description="Listing for daily on {0}. Posted by {1}".format(
			day_of_week,
			 merchant_data.blp_merchant_name
			)

	 )
      return event_data
  @staticmethod
  def generate_special_event(merchant_data, event_data_given):
     event_data = dict()
     photos = Getter.get_merchant_photos(merchant_data)
     event_data['unit_price']=two_decimal(event_data_given.blp_merchant_event_unit_pricing)
     event_data['merchant']= Getter.get_serialized_merchant(merchant_data)
     event_data['photos'] =photos
     event_data['mainPhoto']= photos[0]['fields']['blp_merchant_photo_filename'] if  len(photos) > 0 else default_photo()
     event_data['listing'] = dict(
	id=event_data_given.id,
	 unit_price=event_data['unit_price'],
	 merchant_id=event_data['merchant']['pk'],
	 type="special",
	 date=event_data_given.blp_merchant_event_date.strftime("%Y-%m-%d"),
	 quantity=event_data_given.blp_merchant_event_qty_total,
    	 quantity_remaining=event_data_given.blp_merchant_event_qty,
	 title=event_data_given.blp_merchant_event_name,
   event_name="Bought BLP to "+merchant_data.blp_merchant_name+" for "+event_data_given.blp_merchant_event_date.strftime("%m-%d-%Y"),
	 description=event_data_given.blp_merchant_event_description
    )
     return event_data

  @staticmethod
  def get_special_event_by_sale(sale):

    merchant = Merchant.objects.get(id=sale.blp_merchant_id)
    event_data = Merchant_Event.objects.get(id=sale.blp_merchant_event_id)
    return Getter.generate_special_event(merchant,event_data)
  @staticmethod
  def get_daily_event_by_sale(sale):
    merchant = Merchant.objects.get(id=sale.blp_merchant_id)

    date_obj = sale.blp_merchant_event_sale_date
    date_of_week = date_obj.strftime("%A").lower()
    #day_of_week = sale.blp_merchant_sale_day
    price_check = "blp_merchant_"+date_of_week+"_unit_pricing"
    qty_check = "blp_merchant_"+date_of_week+"_qty"
    qty_check1 = "blp_merchant_"+date_of_week+"_qty_total"

    return Getter.generate_daily_event(merchant, price_check, qty_check, qty_check1, date_of_week, date_obj)


  @staticmethod
  def get_merchant_photos(merchant_data):
     photos= sort_by_index(Merchant_Photo.objects.filter(blp_merchant_id=merchant_data.id))
     return json.loads(serializers.serialize("json", photos))

  @staticmethod
  def get_sale_by_qrhash(hash_key):
     saleRecord = Merchant_Event_Sale.objects.filter(blp_merchant_event_sale_scan_hash=hash_key)
     if saleRecord:
        return saleRecord[0]
     return False

  @staticmethod
  def get_total_sold_tickets(blp_merchant_id):
     totalSold = Merchant_Event_Sale.objects.filter(~Q(blp_merchant_event_sale_parent_id = 0),blp_merchant_id=blp_merchant_id).count()
     if totalSold:
        return totalSold
     return 0

  @staticmethod
  def get_total_scanned_tickets(blp_merchant_id):
     totalScanned = Merchant_Event_Sale.objects.filter(~Q(blp_merchant_event_sale_parent_id = 0),blp_merchant_id=blp_merchant_id,blp_merchant_event_sale_scan_status='CHECKED').count()
     if totalScanned:
        return totalScanned
     return 0


  @staticmethod
  def get_total_available_tickets(blp_merchant_id):
     totalAvailable = Merchant_Event_Sale.objects.filter(~Q(blp_merchant_event_sale_parent_id = 0),blp_merchant_id=blp_merchant_id,blp_merchant_event_sale_scan_status='PENDING').count()
     if totalAvailable:
        return totalAvailable
     return 0

  @staticmethod
  def get_sold_tickets(blp_merchant_id):
     soldTickets = Merchant_Event_Sale.objects.filter(blp_merchant_id=blp_merchant_id,  blp_merchant_event_sale_parent_id=0).select_related('blp_merchant','blp_customer')
     if soldTickets:
        return soldTickets
     return False

  @staticmethod
  def get_sold_tickets_list(blp_customer_id, sale_parent_id):
     soldTicketDetails = Merchant_Event_Sale.objects.filter(blp_customer_id=blp_customer_id,  blp_merchant_event_sale_parent_id=sale_parent_id).select_related('blp_merchant','blp_customer')
     if soldTicketDetails:
        return soldTicketDetails
     return False

  @staticmethod
  def get_venue_sold_tickets_list(blp_merchant_id, sale_parent_id):
     soldTicketDetails = Merchant_Event_Sale.objects.filter(blp_merchant_id=blp_merchant_id,  blp_merchant_event_sale_parent_id=sale_parent_id).select_related('blp_merchant','blp_customer')
     if soldTicketDetails:
        return soldTicketDetails
     return False

  @staticmethod
  def get_user_hash(userObj):
    hash_key1 = hashlib.md5(userObj.blp_customer_email+userObj.blp_customer_password).hexdigest()
    return hash_key1
  @staticmethod
  def get_venue_hash(venueObj):
    hash_key1 = hashlib.md5(venueObj.blp_merchant_email+venueObj.blp_merchant_password).hexdigest()
    return hash_key1

  @staticmethod
  def get_user_by_hash(hash_key):
     allCustomers = Customer.objects.filter()
     for i in allCustomers:
        hash_key1 = hashlib.md5(i.blp_customer_email+i.blp_customer_password).hexdigest()
        if  hash_key1 == hash_key:
            return i
     return None
  @staticmethod
  def get_venue_by_hash(hash_key):
     allVenues = Merchant.objects.filter()
     for i in allVenues:
       hash_key1 = Getter.get_venue_hash(i)
       if hash_key1==hash_key:
           return i
     return None



  @staticmethod
  def  get_listings_by_city(cityObj,dateStart,dateEnd):
    print cityObj
    merchants=Getter.get_merchants_by_city(cityObj,dateStart,dateEnd)
    #merchantEvents=Merchant_Event.objects.filter(blp_merchant_event_date__gte=dateStart,blp_merchant_event_date__lte=dateEnd,
#		blp_merchant_id__in=merchants
#		)
    return merchants

  @staticmethod
  def get_bar_listings_by_city(cityObj):
    merchants=Getter.get_bars_by_city(cityObj)
    return merchants

  @staticmethod
  def get_events_by_merchant(merchantId=None):
    merchant_events = Merchant_Event.objects.filter(blp_merchant_id=merchantId)
    return merchant_events

  @staticmethod
  def get_ids(dataList):
    ids = []
    for i in dataList:
      ids.append(i.id)
    return ids
  def get_cities(self):
    pass

class QRCodes(object):
  pass

class Events(object):
  @staticmethod
  def is_available(event,qty,startDate=None,endDate=None):
    if  event['listing']['type']=="special":
      merchantEvent = Merchant_Event.objects.get(id=event['listing']['id'])
      if  (merchantEvent.blp_merchant_event_qty- qty)>=0:
	return True
      return False
    else:
      merchant= Merchant.objects.get(id=event['merchant']['pk'])
      day_key="blp_merchant_"+event['listing']['day']+"_qty"
      if (getattr(merchant,day_key)-qty)>=0:
        return True
      return False

  @staticmethod
  def get_pricing(listing, quantity,date=None):
    if listing['type'] == "special":
      MerchantEventData = Merchant_Event.objects.get( id=int(event_id) )
      if MerchantEventData:
	 unitPrice = float(MerchantEventData.blp_merchant_event_unit_pricing)
	 return float("%.2f"%(unitPrice*quanitity))
      return 0.00
    else:
      merchant = Merchant.objects.get(id=event['merchant']['pk'])
      unitPrice =  getattr(merchant,"blp_merchant_"+listing['day']+"_unit_pricing")
      return float("%.2f"%(unitPrice*quantity))


  @staticmethod
  def get_event(event_id):
    MerchantEventData = Merchant_Event.objects.get( id=event_id )
    return MerchantEventData
  @staticmethod
  def save_listing(merchant_id,event_data):
    try:
      new_event = Merchant_Event(blp_merchant_event_name=event_data['name'],
		blp_merchant_event_description=event_data['description'],
		blp_merchant_event_unit_pricing=event_data['unit_price'],
		blp_merchant_event_date=event_data['date'],
		blp_merchant_event_qty_total=int(event_data['qty']),
		blp_merchant_event_qty=int(event_data['qty']),
		blp_merchant_id=int(merchant_id)

	)
      new_event.save()
      return True
    except Exception, e:
      print "Unable to add listing:  %s" % (e.__str__())
      return False

class Sales(object):
  @staticmethod
  def insert_sale(user, details, pricing):
    newSaleEvent = Merchant_Event_Sale(**details)
    return newSaleEvent.save()

class PaymentProcessor(object):
  @staticmethod
  def connect_auth():
    config=get_config()
    if config['paypal_mode'] == 'sandbox' :
	    paypalrestsdk.configure({
		"mode":"sandbox",
		"client_id": config['paypal_sandbox_client_id'],
		"client_secret": config['paypal_sandbox_client_secret']
	})
    else:
	    paypalrestsdk.configure({
		"mode": "live",
		"client_id": config['paypal_live_client_id'],
		"client_secret": config['paypal_live_client_secret']
	})


  @staticmethod
  def get_special_return_url(event,qty,pricing):
    config = get_config()
    return_url = config['root_url']+"listings/thanks?event_id={0}&type={1}&date={2}&qty={3}&price={4}".format(event['listing']['id'], event['listing']['type'],event['listing']['date'],qty,pricing)
    return return_url
  @staticmethod
  def get_daily_return_url(event,qty,pricing):
    config = get_config()
    return_url = config['root_url']+"listings/thanks?merchant_id={0}&type={1}&day={2}&date={3}&qty={4}&price={5}".format(event['merchant']['pk'], event['listing']['type'], event['listing']['day'], event['listing']['date'], qty, pricing )
    return return_url
  @staticmethod
  def get_return_url(event,qty, pricing):
    #payment_salt = uuid.uuid4()
    config = get_config()
    #id = event['merchant']['pk'] if event['listing']['type'] =="daily" else event['listing']['id']
    if event['listing']['type']=="daily":
       return PaymentProcessor.get_daily_return_url( event,qty, pricing )
    #return_url = config['root_url']+"listings/thanks?event_id={0}&type={1}".format(id, event['listing']['type'])
    else:
       return PaymentProcessor.get_special_return_url( event, qty,pricing )
    return return_url
  @staticmethod
  def get_cancel_url(event,pricing):
    config = get_config()
    id = event['merchant']['pk'] if event['listing']['type'] =="daily" else event['listing']['id']
    cancel_url = config['root_url']+"listings/error?event_id={0}&type={1}".format(id,event['listing']['type'])
    return cancel_url


  @staticmethod
  def execute_payment(paymentId, PayerID):
     config = get_config()
     PaymentProcessor.connect_auth()
     payment = Payment.find(paymentId)
     payment.execute({ "payer_id": PayerID })

  
  @staticmethod
  def process_payment(pricing, event, quantity):
     config = get_config()
     PaymentProcessor.connect_auth()
     return_url = PaymentProcessor.get_return_url(event,quantity,pricing)
     cancel_url = PaymentProcessor.get_cancel_url(event,pricing)
     payment = Payment({
    "intent": "sale",

    # Payer
    # A resource representing a Payer that funds a payment
    # Payment Method as 'paypal'
    "payer": {
        "payment_method": "paypal"},

    # Redirect URLs
    "redirect_urls": {
        "return_url": return_url,
        "cancel_url": cancel_url},

    # Transaction
    # A transaction defines the contract of a
    # payment - what is the payment for and who
    # is fulfilling it.
    "transactions": [{

        # ItemList
        "item_list": {
            "items": [{
                "name": event['listing']['event_name'],
                "sku": "item",
                "price": event['unit_price'],
                "currency": "USD",
                "quantity": quantity}]},

        # Amount
        # Let's you specify a payment amount.
        "amount": {
            "total":  pricing,
            "currency": "USD"},
        "description": event['listing']['description']}] })
     try:
       if payment.create():
          for link in payment.links:
            print "PayPal Payment Link is: %s\n"%(link.href)
            if link.method == "REDIRECT":
              return str(link.href)
       else:
            print "PayPal Payment Error: %s\n"%(payment.error)
            return False
     except Exception, e:
       raise e


class User(object):
  @staticmethod
  def register( user_data ):
     found_results = Customer.objects.filter(blp_customer_email=user_data['registerEmail'])
     status = False
     if len(found_results)==0:

       customer = Customer(
                      blp_customer_first_name=user_data['registerFirstName'],
		blp_customer_last_name=user_data['registerLastName'],
		blp_customer_email=user_data['registerEmail'],
		blp_customer_password=hashlib.md5(  user_data['registerPassword'] ).hexdigest(),
		blp_customer_active=1,
    blp_customer_created_at= datetime.now(),
    blp_customer_random_string= str(uuid.uuid4())
	 )
       status = customer.save()
       return customer
     return False
  @staticmethod
  def login( username,  password ):
    found_results = Customer.objects.filter(blp_customer_email=username, blp_customer_password=hashlib.md5( password ).hexdigest() )

    if len(found_results) > 0:
      userLoggedIn = "user"
      return found_results[0]
    return False
  @staticmethod
  def social_login(email_address, socialUserFirstName="", socialUserLastName=""):
    found_results =Customer.objects.filter(blp_customer_email=email_address)
    if len(found_results) > 0:
      userLoggedIn = "user"
      return found_results[0]
    else:
      ## generate  a custom uuid password for the moment
      newSocialCustomer = Customer(blp_customer_email=email_address, blp_customer_password=hashlib.md5( str(uuid.uuid4()) ),
		blp_customer_username=email_address, blp_customer_first_name=socialUserFirstName, blp_customer_last_name=socialUserLastName, blp_customer_active=1)
      newSocialCustomer.save()
      userLoggedIn = "user"
      return newSocialCustomer
  @staticmethod
  def get_user_details(user_id):
    found_results =Customer.objects.filter(pk=user_id)
    if len(found_results)>0:
      return found_results[0]
    return False


class Venue(object):
  @staticmethod
  def register( venue_data ):
     found_results = Merchant.objects.filter(blp_merchant_email=venue_data['venueEmail'])
     status = False
     if len(found_results)==0:
        venue = Merchant()
        venue.blp_merchant_name=venue_data['venueName']
        venue.blp_merchant_password=hashlib.md5( venue_data['venuePassword'] ).hexdigest()
        venue.blp_merchant_email=venue_data['venueEmail']
        venue.blp_merchant_city=venue_data['venueCity']
        venue.blp_merchant_phone_number=venue_data['venuePhoneNumber']
        venue.blp_merchant_active=0
        venue.blp_merchant_monday_unit_pricing="0.00"
        venue.blp_merchant_monday_qty_total=0
        venue.blp_merchant_monday_qty=0
        venue.blp_merchant_tuesday_unit_pricing="0.00"
        venue.blp_merchant_tuesday_qty_total=0
        venue.blp_merchant_tuesday_qty=0
        venue.blp_merchant_wednesday_unit_pricing="0.00"
        venue.blp_merchant_wednesday_qty_total=0
        venue.blp_merchant_wednesday_qty=0
        venue.blp_merchant_thursday_unit_pricing="0.00"
        venue.blp_merchant_thursday_qty_total=0
        venue.blp_merchant_thursday_qty=0
        venue.blp_merchant_friday_unit_pricing="0.00"
        venue.blp_merchant_friday_qty=0
        venue.blp_merchant_friday_qty_total=0
        venue.blp_merchant_saturday_unit_pricing="0.00"
        venue.blp_merchant_saturday_qty=0
        venue.blp_merchant_saturday_qty_total=0
        venue.blp_merchant_sunday_unit_pricing="0.00"
        venue.blp_merchant_sunday_qty=0
        venue.blp_merchant_sunday_qty_total=0
        venue.blp_merchant_created_at= datetime.now()
        venue.blp_merchant_random_string= str(uuid.uuid4())
        venue.save()
        return venue
     return False
  @staticmethod
  def login( venue_email, venue_password):
    found_results =Merchant.objects.filter(blp_merchant_email=venue_email, blp_merchant_password=hashlib.md5(venue_password).hexdigest() )
    if len(found_results)>0:
      return found_results[0]
    return False
  @staticmethod
  def get_venue_details(venue_id):
    found_results =Merchant.objects.filter(pk=venue_id)
    if len(found_results)>0:
      return found_results[0]
    return False
