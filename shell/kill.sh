#！ /bin/bash

# kill monitorNode进程先，然后再kill node

ps -efww|grep -w 'monitorNode'|grep -v grep|cut -c 9-15 | xargs kill -9;

ps -efww|grep -w 'node'|grep -v grep|cut -c 9-15 | xargs kill -9;
