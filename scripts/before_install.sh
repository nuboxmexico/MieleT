#!/bin/bash
# scripts/before_install.sh aqui puedes poner todos aquellos comandos a 
# usar para instalar lo que necesitas previo al despliegue.
echo "Running before_install hook"


[ -d /var/www/html/miele_tickets/shared/log   ] && sudo rm -R /var/www/html/miele_tickets/shared/log  
[ -d /var/www/html/miele_tickets/shared/vendor ] && sudo rm -R /var/www/html/miele_tickets/shared/vendor

[ -d /var/www/html/miele_tickets/current/log ] &&  sudo cp -r /var/www/html/miele_tickets/current/log/*  /var/www/html/miele_tickets/shared/log/
[ -d /var/www/html/miele_tickets/current/vendor ] &&  sudo cp -r /var/www/html/miele_tickets/current/vendor  /var/www/html/miele_tickets/shared/vendor/

[ -d /var/www/html/miele_tickets/current/log   ] && sudo rm -R /var/www/html/miele_tickets/current/log  
[ -d /var/www/html/miele_tickets/current/vendor ] && sudo rm -R /var/www/html/miele_tickets/current/vendor
[ -d /var/www/html/miele_tickets/current/tmp/cache ] && sudo rm -R /var/www/html/miele_tickets/current/tmp/cache
[ -d /var/www/html/miele_tickets/current ] && sudo rm -R /var/www/html/miele_tickets/current

echo "Finish before_install hook"

