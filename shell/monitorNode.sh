#!/bin/sh
# 获取当前文件所在目录的绝对路径
filepath=$(cd "$(dirname "$0")"; pwd)
while true;do
    count=`ps -ef|grep node|grep -v grep`
    if [ "$?" != "0" ];then
		date
		echo  ">>>>no node, run it"
		nohup node $filepath/../src/server.js &
	fi
sleep 1h
done