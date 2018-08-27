#!/bin/bash
#Program:
#       更新 版本信息
#History:
#       2018-08-27 king first release

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


CreateNGVersion(){
	# 返回 git 信息 時間
	tag=`git describe`
	if [ "$tag" == '' ];then
		tag="[unknown tag] "
	else
		tag="$tag "
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
	NewFile $1	"const version = '$tag'"
	WriteFile $1	"const commit = '$commit'"
	WriteFile $1	"const date = '$date'"
	WriteFile $1	'export function Version() {'
	WriteFile $1	'    return {'
	WriteFile $1	'        Version: version,'
	WriteFile $1	'        Commit: commit,'
	WriteFile $1	'        Date: date,'
	WriteFile $1	'    }'
	WriteFile $1	'}'
}

# 自動 創建 version.ts 代碼
CreateNGVersion src/app/app/version.ts
