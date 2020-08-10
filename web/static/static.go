package static

import (
	"fmt"
	"net/http"
	"os"

	"book-web/logger"
	"book-web/web"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/rakyll/statik/fs"
	"go.uber.org/zap"
)

// BaseURL request base url
const BaseURL = `/static`

// Helper path of /app
type Helper struct {
	web.Helper
}

var filesystem http.FileSystem

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
	router.GET("3rdpartylicenses.txt", gzip.Gzip(gzip.DefaultCompression), h.licenses)
	router.GET("favicon.ico", gzip.Gzip(gzip.DefaultCompression), h.favicon)

	r := router.Group(BaseURL)
	r.Use(gzip.Gzip(gzip.DefaultCompression))
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
	fmt.Println(obj.Path)
	h.NegotiateFilesystem(c, filesystem, obj.Path)
}
func (h Helper) licenses(c *gin.Context) {
	h.NegotiateFilesystem(c, filesystem, `/3rdpartylicenses.txt`)
}
func (h Helper) favicon(c *gin.Context) {
	h.NegotiateFilesystem(c, filesystem, `/favicon.ico`)
}
