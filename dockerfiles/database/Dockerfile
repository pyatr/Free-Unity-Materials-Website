FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y --fix-missing
RUN apt-get upgrade -y
RUN apt-get install -y nano
RUN apt-get install -y lsof
RUN apt-get install -y mysql-client
RUN apt-get install -y mysql-server
RUN apt-get install -y iputils-ping

RUN usermod -d /var/lib/mysql/ mysql

#TODO: complete database start with commented code
#CMD service mysql start
#alt
#ENTRYPOINT ["service", "mysql", "start"]

#RUN mysql -u root -p root
#RUN mysql CREATE DATABASE PrimaryDatabase;
#alt:
#RUN /etc/init.d/mysql start

EXPOSE 3306
EXPOSE 9906