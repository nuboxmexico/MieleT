#!/bin/bash
# scripts/before_install.sh aqui puedes poner todos aquellos comandos a 
# usar para instalar lo que necesitas previo al despliegue.
echo "Running validate_service hook"

[ -d /var/www/html/miele_tickets/shared/log ] && sudo cp -r /var/www/html/miele_tickets/shared/log/* /var/www/html/miele_tickets/current/log/  

echo "Finish validate_service hook"
