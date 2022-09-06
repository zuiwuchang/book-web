package static

import (
	"book-web/configure"
	"book-web/static"

	"book-web/web"

	"github.com/gin-gonic/gin"
)

// BaseURL request base url
const BaseURL = `static`

// Helper path of /static
type Helper struct {
	web.Helper
}

var ads string

// Register impl IHelper
func (h Helper) Register(router *gin.RouterGroup) {
	router.GET(`favicon.ico`, static.Favicon)
	router.HEAD(`favicon.ico`, static.Favicon)
	ads = configure.Single().Google.Ads
	router.GET("ads.txt", h.ads)
	router.HEAD("ads.txt", h.ads)

	router.Group(BaseURL).Use(h.Compression()).StaticFS(``, static.Static())
}
func (h Helper) ads(c *gin.Context) {
	c.File(ads)
}
