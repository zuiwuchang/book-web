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
