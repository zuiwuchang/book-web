package book

import (
	"book-web/web"

	"github.com/gin-gonic/gin"
)

// BaseURL request base url
const BaseURL = `/book`

// Helper path of /book
type Helper struct {
	web.Helper
}

// Register impl IHelper
func (h Helper) Register(router *gin.RouterGroup) {
	r := router.Group(BaseURL)
	ms := []web.IHelper{
		Assets{},
	}
	for _, m := range ms {
		m.Register(r)
	}
}
