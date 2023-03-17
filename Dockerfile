FROM ubuntu:latest
#https://bobcares.com/blog/debian_frontendnoninteractive-docker/
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y apache2 
RUN apt-get install -y php 
RUN apt-get install -y php-dev 
RUN apt-get install -y php-mysql
RUN apt-get install -y libapache2-mod-php 
RUN apt-get install -y php-curl
RUN apt-get install -y php-json 
RUN apt-get install -y php-common 
RUN apt-get install -y php-mbstring 
RUN apt-get install -y php-xdebug

#Для пингования одного контейнера другим (по имени)
#Примерно так: docker exec -it free-unity-mat-con ping FUM-database

RUN apt-get install -y iputils-ping

RUN echo "xdebug.mode=debug" >>              /etc/php/8.1/apache2/conf.d/20-xdebug.ini
RUN echo "xdebug.log=/var/log/xdebug" >>     /etc/php/8.1/apache2/conf.d/20-xdebug.ini
RUN echo "xdebug.idekey=PHPSTORM" >>         /etc/php/8.1/apache2/conf.d/20-xdebug.ini
RUN echo "xdebug.client_host = 172.18.0.1">> /etc/php/8.1/apache2/conf.d/20-xdebug.ini

COPY dist ./
COPY .htaccess /etc/apache2/.htaccess
COPY apache2.conf /etc/apache2/apache2.conf
COPY config /etc/apache2/sites-available

RUN rm -rfv ./config/*.conf

RUN a2dissite 000-default.conf
RUN a2ensite freeunmat.conf
#Для CORS и связи сайта с сервером
RUN a2enmod headers
RUN a2enmod rewrite

CMD apachectl -D FOREGROUND
EXPOSE 80
EXPOSE 8000
EXPOSE 443

#sudo docker exec -t -i free-unity-mat-con /bin/bash