package v1

import (
	"book-web/configure"
	"book-web/version"
	"net/http"
	"runtime"
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
	h.NegotiateData(c, http.StatusOK, gin.H{
		`platform`:     version.Platform,
		`version`:      version.Version,
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
			`auto`: cnf.AdSense.Auto,
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
