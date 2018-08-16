package controllers

import (
	"book-web/app/module/db/manipulator"
	"github.com/revel/revel"
)

// Book .
type Book struct {
	Controller
}

// View 返回書 章節
func (c Book) View() revel.Result {
	var params struct {
		ID string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	var mBook manipulator.Book
	book, e := mBook.Get(params.ID)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(book)
}

// Chapter 返回 章節 內容
func (c Book) Chapter() revel.Result {
	var params struct {
		ID      string
		Chapter string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	if params.Chapter == "0" {
		params.Chapter = ""
	}
	var mBook manipulator.Book
	str, e := mBook.Chapter(params.ID, params.Chapter)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(str)
}

// Assets 返回 靜態內容
func (c Book) Assets(book, chapter, name string) revel.Result {
	var mBook manipulator.Book
	filename := mBook.Assets(book, chapter, name)
	return c.RenderFileName(filename, revel.NoDisposition)
}

// Save 保存 檔案
func (c Book) Save() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID      string
		Chapter string
		Val     string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	if params.Chapter == "0" {
		params.Chapter = ""
	}
	// 執行 請求
	var mBook manipulator.Book
	e = mBook.UpdateChapter(params.ID, params.Chapter, params.Val)
	if e != nil {
		return c.RenderError(e)
	}

	return c.RenderJSON(nil)
}
