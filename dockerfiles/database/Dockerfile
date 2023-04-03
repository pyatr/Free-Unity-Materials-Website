FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y --fix-missing
RUN apt-get upgrade -y
RUN apt-get install -y nano
RUN apt-get install -y lsof
RUN apt-get install -y mysql-client
RUN apt-get install -y mysql-server
RUN apt-get install -y iputils-ping

#CMD usermod -d /var/lib/mysql/ mysql

#RUN service mysql start

#RUN mysql -u root -p root
#RUN mysql CREATE DATABASE PrimaryDatabase;
#alt:
#RUN /etc/init.d/mysql start

EXPOSE 3306
EXPOSE 9906