from django.db import models
import datetime
from django import forms

class Merchant(models.Model):
  id=models.AutoField(primary_key=True)
  blp_merchant_name=models.CharField(max_length=50)
  blp_merchant_city=models.CharField(max_length=50)
  blp_merchant_description=models.TextField()
  blp_merchant_email=models.CharField(max_length=50)
  blp_merchant_address=models.CharField(max_length=50)
  blp_merchant_state=models.CharField(max_length=50)
  blp_merchant_zip=models.CharField(max_length=50)
  blp_merchant_active=models.SmallIntegerField(3)
  blp_merchant_phone_number=models.CharField(max_length=50)
  blp_merchant_password=models.CharField(max_length=50)
  blp_merchant_monday_unit_pricing=models.CharField(max_length=50)
  blp_merchant_tuesday_unit_pricing=models.CharField(max_length=50)
  blp_merchant_wednesday_unit_pricing=models.CharField(max_length=50)
  blp_merchant_thursday_unit_pricing=models.CharField(max_length=50)
  blp_merchant_friday_unit_pricing=models.CharField(max_length=50)
  blp_merchant_saturday_unit_pricing=models.CharField(max_length=50)
  blp_merchant_sunday_unit_pricing=models.CharField(max_length=50)
  blp_merchant_monday_qty_total=models.SmallIntegerField(3)
  blp_merchant_monday_qty=models.SmallIntegerField(3)
  blp_merchant_tuesday_qty_total=models.SmallIntegerField(3)
  blp_merchant_tuesday_qty=models.SmallIntegerField(3)
  blp_merchant_wednesday_qty_total=models.SmallIntegerField(3)
  blp_merchant_wednesday_qty=models.SmallIntegerField(3)
  blp_merchant_thursday_qty_total=models.SmallIntegerField(3)
  blp_merchant_thursday_qty=models.SmallIntegerField(3)
  blp_merchant_friday_qty_total=models.SmallIntegerField(3)
  blp_merchant_friday_qty=models.SmallIntegerField(3)
  blp_merchant_saturday_qty_total=models.SmallIntegerField(3)
  blp_merchant_saturday_qty=models.SmallIntegerField(3)
  blp_merchant_sunday_qty_total=models.SmallIntegerField(3)
  blp_merchant_sunday_qty=models.SmallIntegerField(3)
  blp_merchant_created_at=models.DateTimeField(max_length=50)
  blp_merchant_random_string=models.TextField()
  def natural_key(self):
    merchantObj = {}
    merchantObj['name'] = self.blp_merchant_name
    merchantObj['blp_merchant_monday_unit_pricing'] = self.blp_merchant_monday_unit_pricing
    merchantObj['blp_merchant_tuesday_unit_pricing'] = self.blp_merchant_tuesday_unit_pricing
    merchantObj['blp_merchant_wednesday_unit_pricing'] = self.blp_merchant_wednesday_unit_pricing
    merchantObj['blp_merchant_thursday_unit_pricing'] = self.blp_merchant_thursday_unit_pricing
    merchantObj['blp_merchant_friday_unit_pricing'] = self.blp_merchant_friday_unit_pricing
    merchantObj['blp_merchant_saturday_unit_pricing'] = self.blp_merchant_saturday_unit_pricing
    merchantObj['blp_merchant_sunday_unit_pricing'] =  self.blp_merchant_sunday_unit_pricing
    return (merchantObj)


class Merchant_Event(models.Model):
  id=models.AutoField(primary_key=True)
  blp_merchant_event_date=models.DateField(max_length=50)
  blp_merchant_event_name=models.CharField(max_length=50)
  blp_merchant_event_description=models.CharField(max_length=250)
  #blp_merchant_event_img_src=models.CharField(max_length=100)
  #blp_merchant_event_img_width=models.CharField(max_length=4)
  blp_merchant_event_qty=models.SmallIntegerField(3)
  blp_merchant_id=models.SmallIntegerField(3)
  blp_merchant_event_qty_total=models.SmallIntegerField(3)
  #blp_merchant_event_qty_remaining=models.SmallIntegerField(3)
  blp_merchant_event_unit_pricing=models.CharField(max_length=50)
class Merchant_Event_Days(models.Model):
  id=models.AutoField(primary_key=True)
  blp_merchant_id=models.SmallIntegerField(3)
  blp_merchant_event_day=models.CharField(max_length=10)
  blp_merchant_event_unit_pricing=models.CharField(max_length=10)
class Merchant_Photo(models.Model):
  id=models.AutoField(primary_key=True)
  blp_merchant_id=models.SmallIntegerField(3)
  blp_merchant_photo_index=models.SmallIntegerField(3)
  blp_merchant_photo_filename=models.CharField(max_length=255)
  blp_merchant_photo_filename_thumbnail=models.CharField(max_length=255)
  blp_merchant_photo_filename_large=models.CharField(max_length=255)

class Customer_Photo(models.Model):
  id=models.AutoField(primary_key=True)
  blp_customer_id=models.SmallIntegerField(3)
  blp_customer_photo_index=models.SmallIntegerField(3)
  blp_customer_photo_filename=models.CharField(max_length=255)
  blp_customer_photo_filename_thumbnail=models.CharField(max_length=255)
  blp_customer_photo_filename_large=models.CharField(max_length=255)

class Customer(models.Model):
  id=models.AutoField(primary_key=True)
  blp_customer_username=models.CharField(max_length=50)
  blp_customer_first_name=models.CharField(max_length=50)
  blp_customer_last_name=models.CharField(max_length=50)
  blp_customer_phone_number=models.CharField(max_length=50)
  blp_customer_email=models.CharField(max_length=50)
  blp_customer_password=models.CharField(max_length=50)
  blp_customer_active=models.SmallIntegerField(3)
  blp_customer_created_at=models.DateTimeField(max_length=50,default=datetime.datetime.now)
  blp_customer_random_string=models.TextField()

class Merchant_Event_Sale(models.Model):
  blp_merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE)
  blp_customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
  id=models.AutoField(primary_key=True)
  blp_merchant_event_sale_payment_date=models.DateTimeField(max_length=50)
  blp_merchant_event_sale_payment_status=models.CharField(max_length=50)
  blp_merchant_event_sale_scan_date=models.DateTimeField(max_length=50, null=True, blank=True)
  blp_merchant_event_sale_scan_status=models.CharField(max_length=50)
  blp_merchant_event_sale_scan_hash=models.CharField(max_length=50)
  blp_merchant_event_sale_qty=models.SmallIntegerField(3)
  blp_merchant_event_sale_amount=models.CharField(max_length=50,default=0)
  blp_merchant_event_sale_unit_price=models.CharField(max_length=50,default=0)
  blp_merchant_event_sale_type=models.CharField(max_length=50)
  blp_merchant_event_sale_date=models.DateTimeField(null=True, blank=True)
  #blp_customer_id=models.SmallIntegerField(3)
  blp_merchant_event_id=models.CharField(max_length=50)
  blp_merchant_event_sale_parent_id=models.IntegerField(default=0)
  blp_merchant_event_sale_qty_number=models.CharField(max_length=50)
  #blp_merchant_id=models.SmallIntegerField(3)


class pmt_summary(models.Model):
  id=models.AutoField(primary_key=True)
  # quantity_val = models.IntegerField(default=0)
  # invoice_id = models.CharField(max_length=50)
  # merchant_id = models.IntegerField(default=0)
  # reservation_city = models.CharField(max_length=50)
  # event_id = models.IntegerField(default=0)
  # event_address = models.CharField(max_length=100)
  # one_unit_price = models.IntegerField(default=0)
  # reservation_total_amt = models.IntegerField(default=0)
  # customer_name = models.CharField(max_length=50)
  # customer_email = models.CharField(max_length=50)
  # customer_mobile = models.CharField(max_length=50)
  # reservation_date = models.DateTimeField(max_length=50, null=True, blank=True)
  # payment_status = models.CharField(max_length=100)
  # email_status = models.CharField(max_length=50)
  # paypal_txn_id = models.CharField(max_length=100)
  # paypal_respons100= models.TextField()

  parent_id=models.IntegerField(default=0)
  transaction_id=models.CharField(max_length=100)
  ipn_status = models.CharField(max_length=100)
  text_paypal_payload = models.TextField()
  date = models.DateTimeField(max_length=50, null=True, blank=True)
  status = models.CharField(max_length=100)



