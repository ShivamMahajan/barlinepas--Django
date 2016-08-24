BarlinePass setting the application env
================================================================

Requirements
----------------------------------------------------------------
  + Python 2.7
  + PIP
  + Django 1.8
  + Linux (tested on CentOS 6)

Application Setup
----------------------------------------------------------------

   Note: 
   The application can use any database, it is currently using an SQLite
   instance located in a directory, to first configure this to MySQL or
   another RBDMS please change:
   ./settings/default.py
   with your database settings in DATABASES =  
   for Django 1.8 database settings please goto:

   https://docs.djangoproject.com/en/1.9/ref/databases/ 

   Next:
   open  config.json
   please edit the directory and urls to point to the appropriate area. As well
   as any other information

   0.  These commands / settings are required for AWS / Amazon Linuz
   sudo yum -y update
   sudo yum -y install libffi-devel
   sudo yum -y install openssl-devel
   sudo yum -y install libjpeg-devel
   pip install Django==1.8

  ln -s ~/barlinepass/config.json  /usr/local/blp_app/config.json
	ln -s ~/barlinepass/needed/nav.json  	 /usr/local/blp_app/nav.json
	ln -s ~/barlinepass/needed/fields.json  /usr/local/blp_app/fields.json
	ln -s ~/barlinepass/needed/video.json   /usr/local/blp_app/video.json
	ln -s ~/barlinepass/docs  		 /usr/local/blp_app/docs
    ln -s ~/backend/blp_backend 	~/blp_backend
	python json_files.py
	#delete old database 
	#rm -rf /usr/local/blp_app/blp.db
    python manage.py syncdb

   
   1. run this command:
      make  

   2. Open ./third/static-assets/app.js
   edit the facebook  app id
   found under app id for the blpApp.defaults variable

   3. run this command:
     python ./manage.py runserver {ip}:{port}


#Raj Comments
#You just take the update of code from GIT and meke few changes which I have put bellow:-


Requirements Applications

  + Python 2.7
  + PIP
  + Django 1.8
...........................

Requirements Extentions/Packages

Pillow==2.2.1
paypalrestsdk==1.11.5
facebook-sdk==0.4.0
django==1.8.1
django-admin-tools==0.7.1
django-extensions==1.5.9
django-compressor==1.6.0
django-bootstrap3==6.2.2
requests==1.0.0
............................


"barlinepass" is a base directory of project
Need to change in "barlinepass/config.json"

"root_dir": "/opt/lampp/htdocs/barlinepass/"
"video_file": "/opt/lampp/htdocs/barlinepass/needed/video.json",
"filter_file": "/opt/lampp/htdocs/barlinepass/needed/fields.json",
"nav_file": "/opt/lampp/htdocs/barlinepass/needed/nav.json",
"db_file": "/opt/lampp/htdocs/barlinepass/needed/blp.db",
.................................................

Database :-
create "barlinepass" DB in MySql RBDMS (code is exist into this "/setting/default.py")

after that please create DB with the help of "migrate" command, open project root directory (I mean base directory of project) and open the terminal for these commands

1.) python manage.py migrate
2.) python manage.py {IP}:{port}