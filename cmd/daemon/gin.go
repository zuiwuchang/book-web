package daemon

import (
	"book-web/web"

	"github.com/gin-gonic/gin"
)

func newGIN() (router *gin.Engine) {
	router = gin.Default()
	rs := []web.IHelper{}
	for _, r := range rs {
		r.Register(&router.RouterGroup)
	}
	return
}
