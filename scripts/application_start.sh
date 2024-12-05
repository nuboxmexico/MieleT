#!/bin/bash
echo "Running application_start hook"
# Source RVM
source ~/.rvm/bin/rvm

cd /var/www/html/miele_tickets/current

# Set folder permissions
sudo chown -R www-data:www-data /var/www/html/miele_tickets/current
sudo chown -R ubuntu:ubuntu /var/www/html/miele_tickets/current
sudo chmod -R 755 /var/www/html/miele_tickets/current
sudo chown -R ubuntu:ubuntu /var/www/html/miele_tickets/current/log
sudo chmod -R 750 /var/www/html/miele_tickets/current/log
sudo mkdir -p /var/www/html/miele_tickets/current/tmp/{sockets,pids}
sudo chown -R ubuntu:ubuntu /var/www/html/miele_tickets/current/tmp
sudo chmod -R 770 /var/www/html/miele_tickets/current/tmp
sudo chown -R ubuntu:ubuntu /var/www/html/miele_tickets/current/public/uploads
sudo chmod -R 750 /var/www/html/miele_tickets/current/public/uploads
sudo chown -R ubuntu:ubuntu /var/www/html/miele_tickets/current/.bundle
sudo chmod -R 755 /var/www/html/miele_tickets/current/.bundle

# bundle
bundle install --deployment --without development test
bundle exec rake assets:precompile RAILS_ENV=$DEPLOYMENT_GROUP_NAME

if [ "$DEPLOYMENT_GROUP_NAME" == "production" ]
then
    bundle exec rake assets:sync RAILS_ENV=$DEPLOYMENT_GROUP_NAME # Synchronize assets using asset_sync
fi

bundle exec rake db:migrate RAILS_ENV=$DEPLOYMENT_GROUP_NAME


echo miele_tickets_puma_$DEPLOYMENT_GROUP_NAME


sudo service nginx reload

if [ "$DEPLOYMENT_GROUP_NAME" != "staging" ]
then
    echo Restarting miele core production
    echo miele_tickets_puma_$DEPLOYMENT_GROUP_NAME

    sudo service nginx restart && systemctl --user restart miele_tickets_puma_$DEPLOYMENT_GROUP_NAME # Synchronize assets using asset_sync
    systemctl --user daemon-reload
fi

sudo systemctl restart sidekiq