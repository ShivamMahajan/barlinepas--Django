import os
import logging
import httplib2
from googleapiclient.discovery import build
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from oauth2client import xsrfutil
from oauth2client.client import flow_from_clientsecrets
from oauth2client.django_orm import Storage
from gx_processor import get_config,get_api_config
import settings.default

config = get_config()


# CLIENT_SECRETS, name of a file containing the OAuth 2.0 information for this
# application, including client_id and client_secret, which are found
# on the API Access tab on the Google APIs
# Console <http://code.google.com/apis/console>
#CLIENT_SECRETS = os.path.join(os.path.dirname(__file__), '..', 'client_secrets.json')


def get_flow():
  CLIENT_SECRETS = get_api_config()
  FLOW = flow_from_clientsecrets(
    CLIENT_SECRETS,
    scope="https://spreadsheets.google.com/feeds https://docs.google.com/feeds",
    redirect_uri=config['root_url'] + "home/auth_return"
)
  return FLOW

@csrf_exempt
def authorize(request):
  FLOW = get_flow()
  credential = None
  if credential is None or credential.invalid == True:
    #FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY,
    #                                               request.user)
    authorize_url = FLOW.step1_get_authorize_url()
    return HttpResponseRedirect(authorize_url)
  else:
    http = httplib2.Http()
    http = credential.authorize(http)
    service = build("plus", "v1", http=http)
    activities = service.activities()
    activitylist = activities.list(collection='public',
                                   userId='me').execute()
    #logging.info(activitylist)

@csrf_exempt
def auth_return(request):
  FLOW = get_flow()
  #if not xsrfutil.validate_token(settings.default.SECRET_KEY, request.REQUEST['state'],
  #                               request.user):
  #  return  HttpResponseBadRequest()
  credential = FLOW.step2_exchange(request.REQUEST)
  json_credentials = credential.to_json()
  fileobj = open("/usr/local/gx_processor/credentials.json", "w")
  fileobj.write(json_credentials)
  return HttpResponseRedirect("/")
