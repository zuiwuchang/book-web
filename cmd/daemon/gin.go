package daemon

import (
	"book-web/web"
	"book-web/web/api"
	"book-web/web/book"
	"book-web/web/static"
	"book-web/web/view"

	"github.com/gin-gonic/gin"
)

func newGIN() (router *gin.Engine) {
	router = gin.Default()
	rs := []web.IHelper{
		api.Helper{},
		view.Helper{},
		static.Helper{},
		book.Helper{},
	}
	for _, r := range rs {
		r.Register(&router.RouterGroup)
	}
	return
}
