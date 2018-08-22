package controllers

import (
	"book-web/app/module/db/manipulator"
	"github.com/revel/revel"
)

// Git .
type Git struct {
	Controller
}

// Command 執行 git 指令
func (c Git) Command() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		Command string
		Extend  string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	var mGit manipulator.Git
	var result string

	result, e = mGit.Execute(params.Command, params.Extend)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(result)
}
