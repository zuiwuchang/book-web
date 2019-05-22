{
    // 檔案夾定義
    FileRoot:"fileroot",
    // 管理員定義
    Root:{
        // 登入 用戶名
        Name:"king",
        // 顯示昵稱
        Nickname:"皇帝",
        // 密碼
        //Password:"cerberus is an idea",
        // 密碼是否爲hash值
        //PasswordSha512:false,
        // 密碼
        Password:"6ef9fa16dc05ed44ca6f2890c61b9caacbb97f48ee7006d10d5151a5183bf54c08b1c4fe227e36f3cd01512643953d16753f63e92fd5698ef4af51a1651c70cb",
        // 密碼是否爲hash值
        PasswordSha512:true,
    },
    // 默認語言
    DefaultLocale:"zh-Hant",
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
    // 日誌 配置
    Logger:{
		// 日誌 http 如果爲空 則不啓動 http
		//HTTP:"localhost:20800",
		// 日誌 檔案名 如果爲空 則輸出到控制檯
		//Filename:"logs/kc-cims.log",
		// 單個日誌檔案 大小上限 MB
		//MaxSize:    100, 
		// 保存 多少個 日誌 檔案
		//MaxBackups: 3,
		// 保存 多少天內的 日誌
		//MaxAge:     28,
		// 要 保存的 日誌 等級 debug info warn error dpanic panic fatal
		Level :"debug",
        // 是否要 輸出 代碼位置
    	//Caller:true,
	},
}