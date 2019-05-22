#!/bin/bash
project=book-web
dir=`cd $(dirname $BASH_SOURCE) && pwd`

MkDir(){
	mkdir -p "$1"
	if [ "$?" != 0 ] ;then
		exit 1
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
function CheckError(){
	if [[ $1 != 0 ]];then
		exit $1
	fi
}
function ShowHelp(){
	echo "help        : show help"
	echo "v/vendor    : go mod vendor"
	echo "o/open      : open project"
	echo "dev         : run as dev"
	echo "prod        : run as prod"
	echo "p/package   : package revel"
}
function CreateGoVersion(){
	MkDir $dir/app/version
	filename="$dir/app/version/version.go"
	package="version"

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
	NewFile $filename	"package $package"
	WriteFile $filename	''
	WriteFile $filename	'// Tag git tag'
	WriteFile $filename	"const Tag = \`$tag\`"
	WriteFile $filename	'// Commit git commit'
	WriteFile $filename	"const Commit = \`$commit\`"
	WriteFile $filename	'// Date build datetime'
	WriteFile $filename	"const Date = \`$date\`"
}

case $1 in
	v|vendor)
		# vendor
		`cd $dir && go mod vendor`
		CheckError $?
		export GO111MODULE=on
		if [ -d "$dir/tmps/source/src" ];then
			rm "$dir/tmps/source/src" -rf
		else
			mkdir "$dir/tmps/source" -p
		fi
		CheckError $?

		# revel source
		array=($(echo $GOPATH | tr ':' '\n'))
		for str in ${array[@]}
		do
			if [ -f "$str/src/github.com/revel/revel/README.md" ];then
				cp "$str/src/github.com/revel/revel/templates" "$dir/vendor/github.com/revel/revel/templates" -r
				cp "$str/src/github.com/revel/revel/conf" "$dir/vendor/github.com/revel/revel/conf" -r
				break
			fi
		done

		# mv
		mv "$dir/vendor" "$dir/tmps/source/src"
	;;

	o|open)
		CreateGoVersion

		gopath=`cd $dir/../../ && pwd`
		export GOPATH=$dir/tmps/source:$gopath
		code $dir
	;;

	dev)
		CreateGoVersion

		gopath=`cd $dir/../../ && pwd`
		export GOPATH=$dir/tmps/source:$gopath

		revel run $project
	;;

	prod)
		CreateGoVersion

		gopath=`cd $dir/../../ && pwd`
		export GOPATH=$dir/tmps/source:$gopath


		revel run $project prod
	;;

	p|package)
		CreateGoVersion

		gopath=`cd $dir/../../ && pwd`
		export GOPATH=$dir/tmps/source:$gopath

		revel package $project prod
	;;

	help)
		ShowHelp
	;;

	*)
		ShowHelp
		exit 1
	;;
esac
