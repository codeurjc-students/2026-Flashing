docker run --rm \
  -e MYSQL_ROOT_PASSWORD=root_local \
  -e MYSQL_DATABASE=flashing \
  -e MYSQL_USER=flashing \
  -e MYSQL_PASSWORD=flashing_local \
  -p 3306:3306 \
  -d mysql:9.6