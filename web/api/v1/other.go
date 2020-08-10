package v1

import (
	"book-web/version"
	"fmt"
	"net/http"
	"runtime"
	"strings"

	"book-web/web"

	"github.com/gin-gonic/gin"
)

// Other 一些其它的 api
type Other struct {
	web.Helper
}

// Register impl IHelper
func (h Other) Register(router *gin.RouterGroup) {
	router.GET(`/version`, h.version)
}
func (h Other) version(c *gin.Context) {
	gv := gin.Version
	if strings.HasPrefix(gv, "v") {
		gv = gv[1:]
	}
	h.NegotiateData(c, http.StatusOK, gin.H{
		`platform`: fmt.Sprintf(`%s %s %s gin%s`, runtime.GOOS, runtime.GOARCH, runtime.Version(), gv),
		`tag`:      version.Tag,
		`commit`:   version.Commit,
		`date`:     version.Date,
	})
}
