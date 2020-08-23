package v1

import (
	"book-web/configure"
	"book-web/version"
	"fmt"
	"net/http"
	"runtime"
	"strings"
	"time"

	"book-web/web"

	"github.com/gin-gonic/gin"
)

var startAt = time.Now()

// Other 一些其它的 api
type Other struct {
	web.Helper
}

// Register impl IHelper
func (h Other) Register(router *gin.RouterGroup) {
	router.GET(`/version`, h.CheckSession, h.version)

	router.GET(`/google`, h.google)
}
func (h Other) version(c *gin.Context) {
	gv := gin.Version
	if strings.HasPrefix(gv, "v") {
		gv = gv[1:]
	}

	h.NegotiateData(c, http.StatusOK, gin.H{
		`platform`:     fmt.Sprintf(`%s %s %s gin%s`, runtime.GOOS, runtime.GOARCH, runtime.Version(), gv),
		`tag`:          version.Tag,
		`commit`:       version.Commit,
		`date`:         version.Date,
		`goMaxprocs`:   runtime.GOMAXPROCS(0),
		`numCgoCall`:   runtime.NumCgoCall(),
		`numGoroutine`: runtime.NumGoroutine(),
		`startAt`:      startAt.Unix(),
	})
}
func (h Other) google(c *gin.Context) {
	cnf := configure.Single().Google
	h.NegotiateData(c, http.StatusOK, gin.H{
		`analytics`: cnf.Analytics,
		`adSense`: gin.H{
			`top`: gin.H{
				`id`:   cnf.AdSense.Top.ID,
				`slot`: cnf.AdSense.Top.Slot,
			},
			`bottom`: gin.H{
				`id`:   cnf.AdSense.Bottom.ID,
				`slot`: cnf.AdSense.Bottom.Slot,
			},
			`text`: gin.H{
				`id`:        cnf.AdSense.Text.ID,
				`slot`:      cnf.AdSense.Text.Slot,
				`frequency`: cnf.AdSense.Text.Frequency,
			},
		},
	})
}
