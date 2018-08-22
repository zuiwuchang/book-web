{
    // 檔案夾定義
    //FileRoot:"fileroot",
    FileRoot:"/home/king/project/book-web-data",
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