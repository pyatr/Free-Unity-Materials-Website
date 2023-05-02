service mysql start
#Infinite waiting because tty: true is just not good enough for docker to keep container running
sh -c tail -f /dev/null