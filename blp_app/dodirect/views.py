from django.shortcuts import render
import paypalrestsdk
from django.http import HttpResponse
#[5:08:28 PM] Shivam Mahajan: data["cmd"] = "_notify-validate"




def make_payment(request):
    state = 'BarLinePass'
    return render(request, 'paypal_payment.html',{'state':state})


def paypal_thanks(request):
    state = 'Payment Successful'

    my_api = paypalrestsdk.configure({
      'mode': 'sandbox',
      'client_id': 'ATeKh0y9ZkYvRZrCLSm1BpyXcjEA5mz2hFt_ogxC8H7O0kZkExmqOaRjc51uh9T2N_5AKIbYMhVQHvIq',
      'client_secret': 'ECLz3U_cun51YEM6V5P8bWyUyrDCz6SS_bhq8zjtqzhEWaoyDFTC7rBj4p0yDJP3XOD7YUsMASE_kBc8'
    })

    my_data = {
                "intent": "sale",
                "payer": {
                  "payment_method": "credit_card",
                  "funding_instruments": [{
                    "credit_card":{
                      "type": "visa",
                      "number": "4032035324343573",
                      "expire_month": "08",
                      "expire_year": "2021",
                      "cvv2": "774",
                      "first_name": "RAHUL",
                      "last_name": "SHARMA" }
                      }]
                    },
                "transactions": [{
                  "amount": {
                    "total": "1",
                    "currency": "USD" },
                  "description": "creating a direct payment with credit card" }]
              }

    payment = paypalrestsdk.Payment(my_data, api=my_api)          

    if payment.create():
      print "Successful"
      state = "Payment is Successful"
      payment_json = str(payment)
      fo = open("payment.txt", "a")
      fo.write("\n");
      fo.write("-----------------------------------------------------------------------------");
      fo.write(payment_json);
      fo.close()


      return render(request, 'paypal_thanks.html',{'state':state})
    else:
      print(payment.error) 
      state = 'Payment Cancelled'
      payment_error = payment.error
      fo = open("payment.txt", "a")
      fo.write("\n");
      fo.write("-----------------------------------------------------------------------------");
      fo.write(payment_error);
      fo.close()
      return render(request, 'paypal_payment.html',{'state':state})
   # print"SSSSSSSSSSSSSSSSSSSSSSSS",paypalrestsdk.Payment.find(payment.id)               

    # print"AAAAAAAAAAAAAAAAAAAAAAAAAA",paypalrestsdk
    # print"BBBBBBBBBBBBBBBBBBBBBBBBBB",request          

    # payment = paypalrestsdk.Payment(my_data, api=my_api)
    # print"PAYMENTCCCCCCCCCCCCCCCCCCCCCCCCCCCCPAYMENT",payment
    # payment.create()
    # print"DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",paypalrestsdk.Payment.all({"count": 1})



def ipn_check(request):
  ipn_req=str(request.POST)
  print"KKKKKKKKKKKKKKKKKKKKKKKKK",ipn_req
  fo = open("ipn.txt", "a")
  fo.write("\n");
  fo.write("-----------------------------------------------------------------------------");
  fo.write(ipn_req);
  fo.close()

  return HttpResponse('')


