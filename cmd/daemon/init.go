package daemon

import (
	"book-web/configure"
	"book-web/logger"

	"go.uber.org/zap"
)

// Run run as deamon
func Run() {
	cnf := configure.Single()
	logger.Logger.Info("daemon running",
		zap.String("level", cnf.Logger.Level),
	)
}
