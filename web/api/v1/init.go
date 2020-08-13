package v1

import (
	"book-web/web"

	"github.com/gin-gonic/gin"
)

// BaseURL .
const BaseURL = `/v1`

// Helper 一些其它的 api
type Helper struct {
	web.Helper
}

// Register impl IController
func (h Helper) Register(router *gin.RouterGroup) {
	r := router.Group(BaseURL)

	ms := []web.IHelper{
		Session{},
		Git{},
		Books{},
		Chapters{},
		Other{},
	}
	for _, m := range ms {
		m.Register(r)
	}
}
