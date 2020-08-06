local Millisecond = 1;
local Second = 1000 * Millisecond;
local Minute = 60 * Second;
local Hour = 60 * Minute;
local Day = 24 * Hour;
{
	// HTTP 服務器訂閱
	HTTP: {
		// 服務器監聽地址
		Addr: ":9000",
		// 是否使用 http2 協議
		H2: true,
		// http 證書 如果配置了證書 將使用 https協議
		CertFile: "test.pem",
		KeyFile: "test.key",
	},
	// 檔案夾定義
	FileRoot: "fileroot",
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