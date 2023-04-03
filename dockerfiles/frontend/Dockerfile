FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y --fix-missing
RUN apt-get upgrade -y
RUN apt-get install -y libapache2-mod-php
RUN apt-get install -y nano
RUN apt-get install -y lsof
RUN apt-get install -y iputils-ping

COPY ./public/.htaccess /etc/apache2/.htaccess
COPY ./apache2.conf /etc/apache2/apache2.conf
COPY ./config/freeunmat.conf /etc/apache2/sites-available/freeunmat.conf

RUN rm -rfv ./config/*.conf

RUN a2dissite 000-default.conf
RUN a2ensite freeunmat.conf
#Для CORS и связи сайта с сервером
RUN a2enmod headers
RUN a2enmod rewrite

CMD apachectl -D FOREGROUND

EXPOSE 80