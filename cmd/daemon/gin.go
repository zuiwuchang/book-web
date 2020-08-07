package daemon

import (
	"book-web/web"
	"book-web/web/api"

	"github.com/gin-gonic/gin"
)

func newGIN() (router *gin.Engine) {
	router = gin.Default()
	rs := []web.IHelper{
		api.Helper{},
	}
	for _, r := range rs {
		r.Register(&router.RouterGroup)
	}
	return
}
