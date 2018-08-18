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
        //Password:"Cerberus is an idea",
        // 密碼是否爲hash值
        //PasswordSha512:false,
        // 密碼
        Password:"892B6A8F81D852177DAE8A0CFE7A489D2A4965D8AC9EF4DA9F50E5071D30DEC0D2020EC64FC61FC7C806FB0CCCE5F4510C9A2A348BA171EFCF5D8843AE39A63D",
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
                "^zh",
                ""
            ],
        },
    ],
}