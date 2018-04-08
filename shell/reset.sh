#!/bin/sh
count=`ps -ef|grep monitorNode|grep -v grep`
# 获取当前文件所在目录的绝对路径
filepath=$(cd "$(dirname "$0")"; pwd)
if test ! -n "$count" ;
then
	echo  " >>>> no monitor, start... "
	nohup $filepath/monitorNode.sh &
else
	echo " >>>> monitor is already exist, kill it now ! "
	sh $filepath/kill.sh
	echo " >>>> kill already, start monitorNode... "
	nohup $filepath/monitorNode.sh &
fi