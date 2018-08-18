package angular

import (
	"gitlab.com/king011/king-go/angular"
)

var routers *angular.Routers

// Init 初始化 路由
func Init(basePath string) {
	routers = angular.NewRouters(
		"/angular",
		basePath+"/angular",
	)
	// 組件語言
	routers.Add("zh-Hant")
}

// Filepath .
func Filepath(requestURL string) (filepath string, e error) {
	return routers.Filepath(requestURL)
}
