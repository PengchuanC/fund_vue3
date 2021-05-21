@echo off

del dist.tar.gz

yarn build

tar -cvf dist.tar.gz ./dist/*

scp dist.tar.gz root@10.170.139.10:/home/web/front