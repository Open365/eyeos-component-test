#!/bin/sh
cd component-test

mkdir ../logs/
docker-compose ps -q | while read line ; do
   NAME=$(sudo docker inspect --format "{{ .Name }}" $line)
   NAME=${NAME:1}
   docker logs $NAME &> ../logs/$NAME.log
done

docker-compose kill
