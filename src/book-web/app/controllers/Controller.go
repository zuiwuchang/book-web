package controllers

import (
	"github.com/revel/revel"
	"strings"
)

// Controller 為 控制器的 提供了 輔助方法
type Controller struct {
	*revel.Controller
}

type _ErrorJSON struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// RenderError 修復 application/json 時 e 中帶有 ' " 符號 瀏覽器 無法解析
func (c Controller) RenderError(e error) revel.Result {
	val := c.Request.Header.Get("Accept")
	if strings.Index(val, "application/json") == -1 {
		return c.Controller.RenderError(e)
	}

	c.Response.Status = 500
	return c.RenderJSON(&_ErrorJSON{
		"Server Error",
		e.Error(),
	})
}
