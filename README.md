# book-web

book-web 是一個在線的 個人資料整理 web 以書爲單位 每種類型的 資料 作爲一本書 使用 markdown 進行編寫 以html 呈現內容

[book.king011.com](https://book.king011.com) 是我使用此項目 部署的一個 在線web 你可以在此查看 book-web 的 一些效果

# Why

人類的記憶既弱又不可靠 我很早就發現了 在網路時代 最好的記憶神器就是 web 於是早前開發了一個網站用於 編輯查看資料 你現在依然可以訪問她 [doc.king011.com](https://doc.king011.com) 其[源碼](https://gitlab.com/king011/king-document-build)同樣是以GPL3開源 不過其文檔是以純html編寫 現在看來 比較愚笨

最近使用了下 gitbook 感覺 使用 markdown編寫文檔 比較方便 同時便於 git 保存
然 gitbook 官網 打開實在太慢 而且 遇到了問題 提問也沒人解答 於是 自己決定開發一個 替代工具 故有此項目 

# Install

對於 linux-amd64 和 windows-amd64 的用戶 你可以直接下載 編譯好的項目 或者參照Build的說明自行編譯 對於 其它平臺 只能參照 Build 自行編譯

下文以 linux-amd64 進行說明
1. 下載最新的 最新的 Releases 版本 得到 book-web.tar.gz
2. 解壓 mkdir book-web && tar -zxvf book-web.tar.gz -C book-web
4. 最新 book-web/run.sh 運行項目 *(windows 需要運行 book-web/run.sh)*

# Build

此項目 網頁 由 angular2 編寫 後端服務 用 golang revel 編寫 故需要分別 編譯

## 編譯 前端網頁
1. 自行安裝好 node 環境 和 angular2 框架
2. 下載 源碼 git clone git@gitlab.com:king011/book-web.git && cd book-web/src/view && npm install
3. 運行 編譯 腳本 ./build-zh-Hant.sh

## 編譯 後端服務器
1. 自行配置好 golang環境 和 revel 框架
2. 下載 源碼 git clone git@gitlab.com:king011/book-web.git
3. 配置 環境 變量 export GOPATH=$GOPATH:`pwd`/book-web
4. 編譯 revel package book-web prod 得到 book-web.tar.gz


# Configure
## app.conf
book-web/src/book-web/conf/app.conf 是revel 的框架 配置 檔案 用來指定 http 如果工作 請自行參考 [revel 官網說明](https://revel.github.io/manual/appconf.html)

## app.jsonnet
book-web/src/book-web/conf/app.jsonnet 是 book-web 項目一些定義 如下
```jsonnet
{
    // 檔案夾定義
    FileRoot:"fileroot",
    // 管理員定義
    Root:{
        // 登入 用戶名
        Name:"king",
        // 顯示昵稱
        Nickname:"king",
        // 密碼
        //Password:"cerberus is an idea",
        // 密碼是否爲hash值
        //PasswordSha512:false,
        // 密碼
        Password:"6ef9fa16dc05ed44ca6f2890c61b9caacbb97f48ee7006d10d5151a5183bf54c08b1c4fe227e36f3cd01512643953d16753f63e92fd5698ef4af51a1651c70cb",
        // 密碼是否爲hash值
        PasswordSha512:true,
    },
    // 定義支持的語言
    Locale:[
        {
            // 語言 id 和 angular 檔案夾名 對應
            ID:"zh-Hant",
            // 正則規則 匹配成功的 全部作爲 此語言顯示
            Rules:[
                ".*"
            ],
        },
    ],
}
```

通常你只需要 需要 FileRoot 指定 編輯文檔的 儲存位置 以及 Root.Name Root.Password 指定 管理員 用戶名 密碼 即可正常工作
FileRoot 如果不在全路徑 則 檔案會被 保存到 book-web/src/book-web/ + FileRoot