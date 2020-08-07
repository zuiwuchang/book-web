package v1

import (
	"fmt"
	"net/http"
	"runtime"

	"book-web/web"

	"github.com/gin-gonic/gin"
)

// Debug .
type Debug struct {
	web.Helper
}

// Register impl IHelper
func (h Debug) Register(router *gin.RouterGroup) {
	r := router.Group(`/debug`)
	//r.Use(h.CheckRoot)

	r.GET(``, h.get)
}
func (h Debug) get(c *gin.Context) {
	maxprocs := runtime.GOMAXPROCS(0)
	cgos := runtime.NumCgoCall()
	cpus := runtime.NumCPU()
	goroutines := runtime.NumGoroutine()
	c.JSON(http.StatusOK, gin.H{
		`platform`:   fmt.Sprintf(`%s %s %s`, runtime.GOOS, runtime.GOARCH, runtime.Version()),
		`maxprocs`:   maxprocs,
		`cgos`:       cgos,
		`cpus`:       cpus,
		`goroutines`: goroutines,
	})
	return
	h.NegotiateData(c, http.StatusOK, gin.H{
		`platform`:   fmt.Sprintf(`%s %s %s`, runtime.GOOS, runtime.GOARCH, runtime.Version()),
		`maxprocs`:   maxprocs,
		`cgos`:       cgos,
		`cpus`:       cpus,
		`goroutines`: goroutines,
	})
}
