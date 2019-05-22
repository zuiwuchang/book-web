package logger

import (
	"log"
	"path/filepath"
	"strings"

	"gitlab.com/king011/king-go/log/logger.zap"
	"go.uber.org/zap"
)

// Logger 日誌 單件
var Logger logger.Logger

// JoinFields .
var JoinFields = logger.JoinFields

// Fields 創建 zap.Field 切片
var Fields = logger.Fields

// Init 初始化 日誌
func Init(basePath string, options *logger.Options) (e error) {
	// 格式化 配置
	options.Filename = strings.TrimSpace(options.Filename)
	if options.Filename != "" {
		if !filepath.IsAbs(options.Filename) {
			options.Filename = filepath.Clean(basePath + "/" + options.Filename)
		}
	}
	var zapOptions []zap.Option
	if options.Caller {
		zapOptions = append(zapOptions, zap.AddCaller())
	}

	// 初始化 記錄器
	l := logger.New(options, zapOptions...)

	// 運行 http
	if options.HTTP != "" {
		errHTTP := l.StartHTTP()
		if errHTTP == nil {
			if l.OutFile() {
				log.Println("zap http running", options.HTTP)
			}
			l.Info("zap http",
				zap.String("running", options.HTTP),
			)
		} else {
			if l.OutFile() {
				log.Println("zap http running", errHTTP)
			}
			l.Warn("zap http",
				zap.Error(errHTTP),
			)
		}
	}
	// Attach
	Logger.Attach(l)
	return
}
