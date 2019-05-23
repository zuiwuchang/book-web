#!/bin/bash
#Program:
#       發佈 美語 項目
#History:
#       2018-07-18 king first release
#Email:
#       zuiwuchang@gmail.com

export locale=en-US
dir=`cd $(dirname $BASH_SOURCE) && pwd`

"$dir/util-build.sh"