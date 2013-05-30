#Mongo
/home/ec2-user/mongodb-linux-x86_64-2.4.3/bin/mongod --shutdown
/home/ec2-user/mongodb-linux-x86_64-2.4.3/bin/mongod --fork --logpath /var/log/mongodb.log

#Nginx
service nginx restart

#Server
kill -9 `ps aux | grep "node server.js" | grep -v 'grep' | awk '{print $2}'`
NODE_ENV=dev node server.js >> logging/console.log &