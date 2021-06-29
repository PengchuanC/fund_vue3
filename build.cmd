@echo off

del dist.tar.gz

start yarn build

pause

tar -cvf dist.tar.gz ./dist/*

scp dist.tar.gz root@10.170.139.10:/home/web/front