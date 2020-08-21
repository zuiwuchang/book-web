package static

import (
	"book-web/configure"
	"net/http"
	"os"

	"book-web/logger"
	"book-web/web"

	"github.com/gin-gonic/gin"
	"github.com/rakyll/statik/fs"
	"go.uber.org/zap"
)

// BaseURL request base url
const BaseURL = `/static`

// Helper path of /static
type Helper struct {
	web.Helper
}

var filesystem http.FileSystem
var ads string

// Register impl IHelper
func (h Helper) Register(router *gin.RouterGroup) {
	var e error
	filesystem, e = fs.NewWithNamespace(`static`)
	if e != nil {
		if ce := logger.Logger.Check(zap.FatalLevel, `New FileSystem error`); ce != nil {
			ce.Write(
				zap.Error(e),
				zap.String(`namespace`, `static`),
			)
		}
		os.Exit(1)
	}
	ads = configure.Single().Google.Ads
	router.GET("3rdpartylicenses.txt", h.Compression(), h.licenses)
	router.GET("favicon.ico", h.Compression(), h.favicon)
	router.GET("ads.txt", h.ads)
	r := router.Group(BaseURL)
	r.Use(h.Compression())
	r.GET(`/*path`, h.view)
}
func (h Helper) view(c *gin.Context) {
	var obj struct {
		Path string `uri:"path" `
	}
	e := h.BindURI(c, &obj)
	if e != nil {
		return
	}
	c.Header("Cache-Control", "max-age=31536000")
	h.NegotiateFilesystem(c, filesystem, obj.Path)
}
func (h Helper) licenses(c *gin.Context) {
	c.Header("Cache-Control", "max-age=31536000")
	h.NegotiateFilesystem(c, filesystem, `/3rdpartylicenses.txt`)
}
func (h Helper) favicon(c *gin.Context) {
	c.Header("Cache-Control", "max-age=31536000")
	h.NegotiateFilesystem(c, filesystem, `/favicon.ico`)
}
func (h Helper) ads(c *gin.Context) {
	c.File(ads)
}
