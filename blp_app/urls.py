#! /usr/bin/env python2.7
"""{{ project_name }} URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from home.views import index, aboutBlp
from listings.views import browse,view,thanks,error,validate_qrhash,_book, _setsession, singleView
from user.views import get_venue_sales_details,get_sales_details,activate,login,login_venue,manage_details,manage_user_details,get_venue_details,get_user_details,update_venue_details,update_venue_description,update_customer_details,register,check_old_password,check_venue_old_password,register_venue,manage_venue,logout,forgot,forgot_venue,reset,reset_venue,change_pass
from generics.views import _get_customer_bookings,_current_user, _home_video, _filter_options, _get_bar_listings, _get_city_and_listings, _get_pricing,_nav_menu, _login_user, _login_venue, _register_user, _register_venue, _login_social, _get_listings, _edit_listing, _delete_listing, _get_qr_code, _get_current_merchant, _get_merchant_photos,_get_customer_photos, _upload_photo,_upload_user_photo,_remove_photo, _change_photo_order, _save_listing_days,_save_single_listing,_get_listing_days, _delete_listing_days ,_get_listing_data , _save_listing, _insert_sale,_get_cities,_forgot_user,_forgot_venue,_reset_user,_reset_venue,_send_cron_notifications,paypal_payment,ppal_process,ipn_check,paypal_thanks
from pages.views import faq,terms,contact_us,venues,privacy_policy
#from dodirect.views import make_payment,paypal_thanks,ipn_check


urlpatterns = [
    # Homepage
    url(r'^$', index, name='index'),
    url(r'about-blp',  aboutBlp, name='aboutBlp'),
    url(r'home/$',  index, name='index'),
    url(r'home/index$', index, name='index'),
    url(r'listings/view$', view, name='view'),
    url(r'listings/browse$', browse, name='browse'),
    url(r'listing/view$', singleView, name='view'),
    url(r'listings/thanks', thanks, name='thanks'),
    url(r'listings/error', error, name='error'),
    url(r'listings/validate_qrhash', validate_qrhash,name='validate_qrhash'),
    url(r'listings/_book$', _book, name='_book'),
    url(r'listings/_setsession$', _setsession, name='_setsession'),
    url(r'user/login$', login, name='login'),
    url(r'user/login_venue$', login_venue, name='login_venue'),
    url(r'user/register$', register, name='register'),
    url(r'user/register_venue$', register_venue, name='register_venue'),
    url(r'user/manage_venue$', manage_venue, name='manage_venue'),
    url(r'user/manage_details$', manage_details, name='manage_details'),
    url(r'user/manage_user_details$', manage_user_details, name='manage_user_details'),
    url(r'user/get_venue_details$', get_venue_details, name='get_venue_details'),
    url(r'user/get_user_details$', get_user_details, name='get_user_details'),
    url(r'user/get_sales_details$', get_sales_details, name='get_sales_details'),
    url(r'user/get_venue_sales_details$', get_venue_sales_details, name='get_venue_sales_details'),
    url(r'user/update_venue_details$', update_venue_details, name='update_venue_details'),
    url(r'user/update_venue_description$', update_venue_description, name='update_venue_description'),    
    url(r'user/update_customer_details$', update_customer_details, name='update_customer_details'),
    url(r'user/forgot$', forgot, name='forgot'),
    url(r'user/reset$', reset, name='reset'),
    url(r'user/forgot_venue$', forgot_venue, name='forgot_venue'),
    url(r'user/reset_venue$', reset_venue, name='reset_venue'),
    url(r'user/logout$', logout, name='logout'),
    url(r'user/change_pass$', change_pass, name='change_pass'),
    url(r'user/check_old_password$', check_old_password, name='check_old_password'),
    url(r'user/check_venue_old_password$', check_venue_old_password, name='check_venue_old_password'),
    url(r'user/activate$', activate, name='activate'),


    url(r'generics/_get_customer_bookings$', _get_customer_bookings, name='_get_customer_bookings'),
    url(r'generics/_current_user$', _current_user, name='_current_user'),
    url(r'generics/_home_video$',_home_video, name='_home_video'),
    url(r'generics/_filter_options$', _filter_options, name='_filter_options'),
    url(r'generics/_get_city_and_listings$', _get_city_and_listings, name='_get_city_and_listings'),
    url(r'generics/_get_bar_listings$', _get_bar_listings, name='_get_bar_listings'),
    url(r'generics/_get_pricing$', _get_pricing, name='_get_pricing'),
    url(r'generics/_nav_menu$', _nav_menu, name='_nav_menu'),
    url(r'generics/_login_user$', _login_user, name='_login_user'),
    url(r'generics/_login_venue$', _login_venue, name='_login_venue'),
    url(r'generics/_register_user$', _register_user, name='_register_user'),
    url(r'generics/_register_venue$', _register_venue, name='_register_venue'),
    url(r'generics/_login_social$', _login_social, name='_login_social'),
    url(r'generics/_get_listings$', _get_listings, name='_get_listings'),
    url(r'generics/_edit_listing$', _edit_listing, name='_edit_listing'),
    url(r'generics/_delete_listing$', _delete_listing, name='_delete_listing'),
    url(r'generics/_get_qr_code$', _get_qr_code, name='_get_qr_code'),
    url(r'generics/_get_current_merchant$', _get_current_merchant, name='_get_current_merchant'),
    url(r'generics/_get_customer_photos$', _get_customer_photos, name='_get_customer_photos'),
    url(r'generics/_upload_photo$', _upload_photo, name='_upload_photo'),
    url(r'generics/_upload_user_photo$', _upload_user_photo, name='_upload_user_photo'),
    url(r'generics/_remove_photo$', _remove_photo, name='_remove_photo'),
    url(r'generics/_change_photo_order$', _change_photo_order, name='_change_photo_order'),
    url(r'generics/_get_merchant_photos$', _get_merchant_photos, name='_get_merchant_photos'),
    url(r'generics/_save_listing_days$', _save_listing_days, name='_save_listing_days'),
    url(r'generics/_save_single_listing$', _save_single_listing, name='_save_single_listing'),
    url(r'generics/_get_listing_days$', _get_listing_days, name='_get_listing_days'),
    url(r'generics/_delete_listing_days$', _delete_listing_days, name='_delete_listing_days'),
    url(r'generics/_get_listing_data$', _get_listing_data, name='_get_listing_data'),
    url(r'generics/_send_cron_notifications$', _send_cron_notifications, name='_send_cron_notifications'),

    url(r'generics/_save_listing$',  _save_listing, name='_save_listing'),
    url(r'generics/_insert_sale$', _insert_sale, name='_insert_sale'),
    url(r'generics/_get_cities$', _get_cities, name='_get_cities'),
    url(r'generics/_forgot_user$', _forgot_user, name='_forgot_user'),
    url(r'generics/_forgot_venue$', _forgot_venue, name='_forgot_venue'),
    url(r'generics/_reset_user$',  _reset_user, name='_reset_user'),
    url(r'generics/_reset_venue$', _reset_venue, name='_reset_venue'),
    url(r'pages/faq$', faq,  name='faq'),
    url(r'pages/terms$', terms, name='terms'),
    url(r'pages/privacy_policy$', privacy_policy, name='privacy_policy'),
    url(r'pages/contact_us$', contact_us, name='contact_us'),
    url(r'pages/venues$', venues, name='venues'),

 #   url(r'pages/make_payment$', make_payment, name='make_payment'),
 #   url(r'paypal_thanks/',paypal_thanks, name='paypal_thanks'),
 #   url(r'ipn_check/',ipn_check, name='ipn_check'),
    url(r'generics/make_payment$', paypal_payment, name='paypal_payment'),
    url(r'generics/paypal_process$',ppal_process, name='ppal_process'),
    url(r'generics/paypal_thanks/',paypal_thanks, name='paypal_thanks'),
    url(r'ipn_check/',ipn_check, name='ipn_check'),







] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
