local Millisecond = 1;
local Second = 1000 * Millisecond;
local Minute = 60 * Second;
local Hour = 60 * Minute;
local Day = 24 * Hour;
{
	Logger:{
		// zap http
		//HTTP:"localhost:20000",
		// log name
		//Filename:"logs/book-web.log",
		// MB
		MaxSize:    100, 
		// number of files
		MaxBackups: 3,
		// day
		MaxAge:     28,
		// level : debug info warn error dpanic panic fatal
		Level :"debug",
		// 是否要 輸出 代碼位置
        Caller:true,
	},
}