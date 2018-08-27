#!/bin/bash
#Program:
#       golang 自動編譯 腳本
#History:
#       2018-03-28 king first release
#Email:
#       zuiwuchang@gmail.com

# 定義的 各種 輔助 函數
MkDir(){
	mkdir -p "$1"
	if [ "$?" != 0 ] ;then
		exit 1
	fi
}
MkOrClear(){
	if test -d "$1";then
		declare path="$1"
		path+="/*"
		rm "$path" -rf
		if [ "$?" != 0 ] ;then
			exit 1
		fi
	else
		MkDir $1
	fi
}
NewFile(){
	echo "$2" > "$1"
	if [ "$?" != 0 ] ;then
		exit 1
	fi
}
WriteFile(){
	echo "$2" >> "$1"
	if [ "$?" != 0 ] ;then
		exit 1
	fi
}


CreateGoVersion(){
	# 返回 git 信息 時間
	tag=`git describe`
	if [ "$tag" == '' ];then
		tag="[unknown tag]"
	fi

	commit=`git rev-parse HEAD`
	if [ "$commit" == '' ];then
		commit="[unknow commit]"
	fi
	
	date=`date +'%Y-%m-%d %H:%M:%S'`

	# 打印 信息
	echo ${tag} $commit
	echo $date


	# 自動 創建 go 代碼
	NewFile $1	"package $2"
	WriteFile $1	''
	WriteFile $1	'// Version git tag'
	WriteFile $1	"const Version = \`$tag\`"
	WriteFile $1	'// Commit git tag commit'
	WriteFile $1	"const Commit = \`$commit\`"
	WriteFile $1	'// Date build datetime'
	WriteFile $1	"const Date = \`$date\`"
}

# 自動 創建 version.go 代碼
CreateGoVersion app/version.go app
