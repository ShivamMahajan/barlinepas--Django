import os
if __name__ == "__main__":
  os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

  from django.core.management import execute_from_command_line
  from blp_app.home.models import *


  ## create events and logic
  firstMerchant=Merchant(blp_merchant_name="Testing First Merchant", blp_merchant_city="Edmonton")
  secondMerchant=Merchant(blp_merchant_name="Testing Second Merchant", blp_merchant_city="Montreal")
  thirdMerchant=Merchant(blp_merchant_name="Testing Third Merchant", blp_merchant_city="Montreal")
  firstMerchant.save()
  secondMerchant.save()
  thirdMerchant.save()
  firstMerchantEvent = Merchant_Event(blp_merchant_id=firstMerchant.id, blp_merchant_event_name="Testing First Merchant Event", blp_merchant_event_description="Testing first merchant description",blp_merchant_event_unit_pricing="20.00", blp_merchant_event_qty_total=200, blp_merchant_event_qty=200, blp_merchant_event_date="2016-01-25 00:00:00")

  secondMerchantEvent =Merchant_Event(blp_merchant_id=secondMerchant.id, blp_merchant_event_name="Testing Second Merchant Event", blp_merchant_event_description="Testing second merchant description", blp_merchant_event_unit_pricing="30.00", blp_merchant_event_qty_total=300, blp_merchant_event_qty=10, blp_merchant_event_date="2016-01-27 00:00:00")
  thirdMerchantEvent=Merchant_Event(blp_merchant_id=firstMerchant.id, blp_merchant_event_name="Testing Third Merchant Event",  blp_merchant_event_description="Testing third merchant description", blp_merchant_event_unit_pricing="40.00", blp_merchant_event_qty_total=10, blp_merchant_event_qty=0, blp_merchant_event_date="2016-01-30 00:00:00")
  firstMerchantEvent.save()
  secondMerchantEvent.save()
  thirdMerchantEvent.save()

