
CONTACT_EMAIL="contact@infinitet3ch.com"
if [  -d  /usr/local/ ] ; then
  mkdir /usr/local/blp_app/  
  sudo ln -s ./config.json /usr/local/blp_app/config.json
  sudo ln -s ./needed/fields.json /usr/local/blp_app/fields.json 
  sudo ln -s ./needed/video.json /usr/local/blp_app/video.json
  sudo ln -s ./needed/nav.json /usr/local/blp_app/nav.json
  sudo ln -s ./docs  /usr/local/blp_app/docs
  sudo ln -s ./backend/blp_backend blp_backend
  sudo touch /usr/local/blp_app/blp.db
  sudo chmod 755 /usr/local/blp_app/blp.db
  sudo pip install -r requirements.txt 
  sudo python ./manage.py syncdb
  sudo python ./json_files.py
  echo "Setup process should be completed if you encountered errors please contact, "
  echo ${CONTACT_EMAIL}
else 
  echo "Please use a proper Linux distribute, could not find /usr/local/"
fi


