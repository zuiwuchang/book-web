package angular

import (
	"book-web/app/module/configure"
	"gitlab.com/king011/king-go/angular"
	"log"
)

var routers *angular.Routers

// Init 初始化 路由
func Init(basePath string) {
	routers = angular.NewRouters(
		"/angular",
		basePath+"/angular",
	)
	// 增加語言
	cnf := configure.Get()
	for i := 0; i < len(cnf.Locale); i++ {
		id := cnf.Locale[i].ID
		if id != "" {
			log.Println("add locale", id)
			routers.Add(id)
		}
	}
	//	routers.Add("zh-Hant")
}

// Filepath .
func Filepath(requestURL string) (filepath string, e error) {
	return routers.Filepath(requestURL)
}
