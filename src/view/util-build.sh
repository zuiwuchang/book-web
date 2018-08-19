#!/bin/bash
#Program:
#       發佈 angular 項目 到 revel 目錄
#History:
#       2018-07-18 king first release
#Email:
#       zuiwuchang@gmail.com

# $locale 傳入 參數 設置要 發佈的 區域

# 發佈目錄
root=../book-web/angular

# 判斷 語言參數 是否正確
case $locale in
	'en-US')
		echo build $locale
	;;
 
	'zh-Hant')
		echo build $locale
	;;
 
	'zh-Hans')
		echo build $locale
	;;
 
	*)	#相當於 default
        echo "not support locale : $locale"
		exit 1
	;;
esac

# 檔案夾不存在 創建
if [ ! -d "$root" ];then
    mkdir $root
    ok=$?
    if [ "$ok" != 0 ] ;then
		exit $ok
	fi
fi

# 發佈 項目
ng build --output-path $root/$locale --prod --base-href /angular/$locale/ --aot --i18n-locale $locale --i18nFile src/locale/$locale.xlf --i18nFormat xlf
ok=$?
if [ "$ok" == 0 ] ;then
    echo success output to $root/$locale
fi
exit $ok