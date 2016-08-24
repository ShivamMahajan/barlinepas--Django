import os
import json

json_files = [
        'generics/templates/generics/_current_user.html',
	'generics/templates/generics/_home_video.html', 'generics/templates/generics/_filter_options.html', 'generics/templates/generics/_get_city_and_listings.html', 'generics/templates/generics/_nav_menu.html',
	'generics/templates/generics/_get_pricing.html', 'listings/templates/listings/_book.html',
	 'generics/templates/generics/_login_user.html',
	 'generics/templates/generics/_login_venue.html',
	 'generics/templates/generics/_register_user.html',
  	'generics/templates/generics/_register_venue.html',
	 'generics/templates/generics/_get_listings.html',
	 'generics/templates/generics/_edit_listing.html',
	'generics/templates/generics/_delete_listing.html',
	 'generics/templates/generics/_get_qr_code.html',
	 'generics/templates/generics/_get_current_merchant.html',
	 'generics/templates/generics/_save_listing_days.html',
	'generics/templates/generics/_upload_photo.html',
   	'generics/templates/generics/_remove_photo.html',
	 'generics/templates/generics/_get_merchant_photos.html',
	 'generics/templates/generics/_login_social.html',
	'generics/templates/generics/_save_listing.html',
	'generics/templates/generics/_insert_sale.html',
	'generics/templates/generics/_book.html',
             'generics/templates/generics/_get_cities.html',
           'generics/templates/generics/_forgot_user.html',
           'generics/templates/generics/_forgot_venue.html',
           'generics/templates/generics/_reset_user.html',
           'generics/templates/generics/_reset_venue.html',
           'generics/templates/generics/_change_photo_order.html'
]
doc_files = [
    'pages/templates/pages/terms.html',
    'pages/templates/pages/faq.html',
    'pages/templates/pages/policy.html',
    'pages/templates/pages/venues.html',
    'pages/templates/pages/contact_us.html'
]


config = json.loads(open("/usr/local/blp_app/config.json").read())

##base_dir =  config['root_dir']+"blp_app/generics/templates/generics/"
content_template1 = """
{% autoescape off %}
{{response}}
{% endautoescape  %}
"""
content_template2 = """
{% autoescape off %}
{{text}}
{% endautoescape  %}
"""

for i in json_files:
  base_dir=config['root_dir']+"blp_app/"+i
  new_file = open(base_dir ,"w+")
  new_file.write(content_template1)
  new_file.close()
for i in doc_files:
  base_dir = config['root_dir']+"blp_app/"+i
  new_file =open(base_dir, "w+")
  new_file.write(content_template2)
  new_file.close()
   

