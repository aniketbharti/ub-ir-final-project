#!/bin/bash
sudo service solr stop
sudo rm -r /var/solr
sudo rm -r /opt/solr-8.11.0
sudo rm -r /opt/solr
sudo rm /etc/init.d/solr
sudo deluser --remove-home solr
sudo deluser --group solr
sudo update-rc.d -f solr remove
sudo rm -rf /etc/default/solr.in.sh