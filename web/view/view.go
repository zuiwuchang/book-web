package view

import (
	"net/http"
	"os"
	"strings"

	"book-web/logger"
	"book-web/web"

	"github.com/gin-gonic/gin"
	"github.com/rakyll/statik/fs"
	"go.uber.org/zap"
)

// BaseURL request base url
const BaseURL = `/view`

// Helper path of /angular
type Helper struct {
	web.Helper
}

var zhHant http.FileSystem
var zhHans http.FileSystem
var enUS http.FileSystem

// Register impl IHelper
func (h Helper) Register(router *gin.RouterGroup) {
	var e error
	zhHant, e = fs.NewWithNamespace(`zh-Hant`)
	if e != nil {
		if ce := logger.Logger.Check(zap.FatalLevel, `New FileSystem error`); ce != nil {
			ce.Write(
				zap.Error(e),
				zap.String(`namespace`, `zh-Hant`),
			)
		}
		os.Exit(1)
	}
	zhHans, e = fs.NewWithNamespace(`zh-Hans`)
	if e != nil {
		if ce := logger.Logger.Check(zap.FatalLevel, `New FileSystem error`); ce != nil {
			ce.Write(
				zap.Error(e),
				zap.String(`namespace`, `zh-Hans`),
			)
		}
		os.Exit(1)
	}
	enUS, e = fs.NewWithNamespace(`en-US`)
	if e != nil {
		if ce := logger.Logger.Check(zap.FatalLevel, `New FileSystem error`); ce != nil {
			ce.Write(
				zap.Error(e),
				zap.String(`namespace`, `en-US`),
			)
		}
		os.Exit(1)
	}

	router.GET(`/`, h.redirect)
	router.GET(`/index`, h.redirect)
	router.GET(`/index.html`, h.redirect)
	router.GET(`/view`, h.redirect)
	router.GET(`/view/`, h.redirect)
	// 重寫定向舊版系統到新路由
	router.GET(`/angular/zh-Hant/*path`, h.redirectAngular)
	r := router.Group(BaseURL)
	r.Use(h.Gzip())
	r.GET(`/:locale`, h.viewOrRedirect)
	r.GET(`/:locale/*path`, h.view)
}

func (h Helper) redirectAngular(c *gin.Context) {
	var obj struct {
		Path string `uri:"path"`
	}
	e := h.BindURI(c, &obj)
	if e != nil {
		return
	}
	request := c.Request
	str := strings.ToLower(strings.TrimSpace(request.Header.Get(`Accept-Language`)))
	strs := strings.Split(str, `;`)
	str = strings.TrimSpace(strs[0])
	strs = strings.Split(str, `,`)
	str = strings.TrimSpace(strs[0])
	if strings.HasPrefix(str, `zh-`) {
		if strings.Index(str, `cn`) != -1 || strings.Index(str, `hans`) != -1 {
			c.Redirect(http.StatusFound, `/view/zh-Hans/`+obj.Path)
			return
		}
		c.Redirect(http.StatusFound, `/view/zh-Hant/`+obj.Path)
		return
	}
	c.Redirect(http.StatusFound, `/view/en-US/`+obj.Path)
}
func (h Helper) redirect(c *gin.Context) {
	request := c.Request
	str := strings.ToLower(strings.TrimSpace(request.Header.Get(`Accept-Language`)))
	strs := strings.Split(str, `;`)
	str = strings.TrimSpace(strs[0])
	strs = strings.Split(str, `,`)
	str = strings.TrimSpace(strs[0])
	if strings.HasPrefix(str, `zh-`) {
		if strings.Index(str, `cn`) != -1 || strings.Index(str, `hans`) != -1 {
			c.Redirect(http.StatusFound, `/view/zh-Hans/`)
			return
		}
		c.Redirect(http.StatusFound, `/view/zh-Hant/`)
		return
	}
	c.Redirect(http.StatusFound, `/view/en-US/`)
}
func (h Helper) viewOrRedirect(c *gin.Context) {
	var obj struct {
		Locale string `uri:"locale"`
	}
	e := h.BindURI(c, &obj)
	if e != nil {
		return
	}
	if obj.Locale == "zh-Hant" {
		c.Redirect(http.StatusFound, `/view/zh-Hant/`)
	} else if obj.Locale == "zh-Hans" {
		c.Redirect(http.StatusFound, `/view/zh-Hans/`)
	} else if obj.Locale == "en-US" {
		c.Redirect(http.StatusFound, `/view/en-US/`)
	} else {
		h.redirect(c)
	}
}
func (h Helper) view(c *gin.Context) {
	var obj struct {
		Locale string `uri:"locale" binding:"required"`
		Path   string `uri:"path" `
	}
	e := h.BindURI(c, &obj)
	if e != nil {
		return
	}
	if obj.Locale == "zh-Hant" {
		h.NegotiateFilesystem(c, zhHant, obj.Path)
	} else if obj.Locale == "zh-Hans" {
		h.NegotiateFilesystem(c, zhHans, obj.Path)
	} else if obj.Locale == "en-US" {
		h.NegotiateFilesystem(c, enUS, obj.Path)
	} else {
		h.NegotiateErrorString(c, http.StatusNotFound, `not support locale`)
	}
}
