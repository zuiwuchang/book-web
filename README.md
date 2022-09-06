# book-web

* [github](https://github.com/zuiwuchang/book-web)

book-web 是一個在線的 個人資料整理 web 以書爲單位 每種類型的 資料 作爲一本書 使用 markdown 進行編寫 以html 呈現內容

[book.king011.com](https://book.king011.com) 是我使用此項目 部署的一個 在線web 你可以在此查看 book-web 的 一些效果  
[https://gitlab.com/king011/book](https://gitlab.com/king011/book) 是book.king011.com上數據 的開源 git項目地址

# v1

v1 是完全重構的一個版本 其後端和前端都將被完成重寫 但會保持數據的兼容 理想情況下 你只需要更新 可執行的檔案和修改少許配置 即可完成升級 不會破壞任何 已有數據

# Why

人類的記憶既弱又不可靠 我很早就發現了 在網路時代 最好的記憶神器就是 web 於是早前開發了一個網站用於 編輯查看資料 你現在依然可以訪問她 [doc.king011.com](https://doc.king011.com) 其[源碼](https://gitlab.com/king011/king-document-build)同樣是以GPL3開源 不過其文檔是以純html編寫 現在看來 比較愚笨

在使用了 gitbook 後 感覺 使用 markdown編寫文檔 比較方便 同時便於 git 保存
然 gitbook 官網 打開實在太慢 而且 遇到了問題 提問也沒人解答 於是 自己決定開發一個 替代工具 故有此項目 

# 特性

* 以 markdown 編寫 文檔 支持 上傳圖片和附件
* 所有數據都以 文檔 保存到根目錄下 方便使用git
* 支持在網頁操作 簡單的 git 指令 commit push ...
* 支持 http http2 協議

# Install

對於 linux-amd64 和 windows-amd64 的用戶 你可以直接下載 編譯好的項目 或者參照Build的說明自行編譯 對於 其它平臺 只能參照 Build 自行編譯

下文以 linux-amd64 進行說明
1. 下載 最新的 Releases 版本 得到 linux.windows.7z
2. 解壓 linux.windows.7z
4. 執行 book-web daemon 運行項目

# Docker

1. 你可以設置環境變量 PUID/PGID 來設定 book-web 進程使用的用戶
2. 你可以設置環境變量 TZ 來設定容器時區
3. 容器中 /config/.gitconfig 是 git 設定檔案
4. 容器中 /data 是默認的數據存儲路徑
5. 要改變 book-web 設定，爲 /opt/book-web/book-web.jsonnet 設定卷

```
docker run --name book-web\
 -e PUID=1000 \
 -e PGID=1000 \
 -e TZ=Asia/Shanghai \
 -v Your_Git_Config:/config/.gitconfig:ro \
 -v Your_SSH_KEY_Dir:/config/.ssh \
 -v Your_Project_Dir:/data \
 -p 9000:80 \
 -d king011/book-web:v1.1.0
```


docker-compose
```
version: "1"
services:
  main:
    image: king011/book-web:v1.1.0
    restart: always
    ports:
      - 9000:80
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
    volumes:
      - Your_Git_Config:/config/.gitconfig:ro
      - Your_SSH_KEY_Dir:/config/.ssh
      - Your_Project_Dir:/data
```

# Build

此項目 網頁 由 angular2 編寫 後端服務 用 golang gin 編寫 需要先編譯前端 再編譯後端

## 編譯 前端網頁
1. 自行安裝好 node 環境 和 angular2 框架
2. 下載 源碼 git clone https://github.com/zuiwuchang/book-web.git && cd book-web/view
3. 運行 編譯 腳本 ../build.sh view

## 編譯 後端服務器
1. 自行配置好 golang環境 
2. 下載 源碼 https://github.com/zuiwuchang/book-web.git && cd book-web
3. 編譯資源 ./build.sh view -s
4. 編譯可執行程序 ./build.sh go


# Configure

book-web.jsonnet 是 book-web 項目的配置檔案
```jsonnet
local Millisecond = 1;
local Second = 1000 * Millisecond;
local Minute = 60 * Second;
local Hour = 60 * Minute;
local Day = 24 * Hour;
local KB=1024;
local MB=KB * 1024;
local GB=MB * 1024;
{
	// 檔案夾定義
	FileRoot: "fileroot",
	// HTTP 服務器訂閱
	HTTP: {
		// 服務器監聽地址
		Addr: ":9000",
		// 是否使用 http2 協議
		// H2: true,
		// // http 證書 如果配置了證書 將使用 https協議
		// CertFile: "test.pem",
		// KeyFile: "test.key",
		// 設定 http 請求 body 最大尺寸
		// 如果 == 0 使用默認值 32 KB
		// 如果 < 0 不限制
		MaxBytesReader: 5 * MB,
	},
	// 管理員定義
	Root: {
		// 登入 用戶名
		Name: "king",
		// 顯示昵稱
		Nickname: "皇帝",
		// 密碼
		//Password: "cerberus is an idea",
		// 密碼
		Password: "6ef9fa16dc05ed44ca6f2890c61b9caacbb97f48ee7006d10d5151a5183bf54c08b1c4fe227e36f3cd01512643953d16753f63e92fd5698ef4af51a1651c70cb",
		// 密碼是否爲hash值
		PasswordSha512: true,
	},
	Cookie: {
		// Filename:"securecookie.json"
		MaxAge:Day*14,
	},
	// google服務 配置
	Google: {
		// analytics id 如果爲空則不啓用
		Analytics:"",
		// AdSense google 廣告 
		AdSense:{
			// 自動廣告 如果啓用自動廣告則會自動禁用其他廣告
			Auto: "",
			// 頂部廣告 如果 id 或 slot 爲空字符串則不顯示廣告
			Top: {
				ID: "",
				Slot: "",
			},
			// 頂部廣告
			Bottom: {
				ID: "",
				Slot: "",
			},
			// 文章中的 廣告
			Text: {
				ID: "",
				Slot: "",
				// 文章中廣告顯示頻率 值越小 顯示越頻繁 最小值爲0<不顯示>
				Frequency: 3, 
			},
		},
		// Ads 檔案路徑
		Ads:"ads.txt",
	},
	Logger: {
		// zap http
		//HTTP: "localhost:20000",
		// log name
		//Filename: "logs/book-web.log",
		// MB
		MaxSize: 100, 
		// number of files
		MaxBackups: 3,
		// day
		MaxAge: 28,
		// level : debug info warn error dpanic panic fatal
		Level: "debug",
		// 是否要 輸出 代碼位置
		Caller: true,
	},
}
```

通常你 只需要 設置 FileRoot 指定 編輯文檔的 儲存位置 以及 Root.Name Root.Password 指定 管理員 用戶名 密碼 即可正常工作
FileRoot 如果不是全路徑 則 檔案會被 保存到 可執行程序路徑 + FileRoot

# 檔案儲存
所有的數據 都以 markdown 形式儲存爲檔案  
下文 假設 FileRoot 指定爲 /data/book/ 來說明

/data/book/ 下的每個檔案夾 作爲爲一本書 爲單位 來維護 每本書 以相同的方式 處理 （檔案夾名稱 作爲書的識別ID）

/data/book/home 爲 網站 首頁 打開的書 不能刪除 和 修改 路徑 其它書可以任意修改 刪除


每本書下
* 有一個 definition.json 檔案 比如 home/definition.json 其中記錄了書的 名稱 章節
* 有一個 README.md 檔案 是 markdown 形式的 章節正文 取這個名稱 是爲了 讓 保存在 gitlab或github 上的項目 能夠在 gitlab等網頁上直接瀏覽
* 以章節ID爲名稱的 檔案夾 

 
章節檔案夾下會有
* README.md 檔案 儲存了 章節正文
* assets 檔案夾 裏面儲存了 上傳到此章節的 附件 和圖片等資源
