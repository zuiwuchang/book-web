package controllers

import (
	"book-web/app/module/db/data"
	"book-web/app/module/db/manipulator"
	"book-web/app/module/protocol"
	"book-web/app/module/utils"
	"fmt"
	"github.com/revel/revel"
	"io"
	"mime/multipart"
	"os"
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
		MD5     string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	var mBook manipulator.Book

	// 返回 章節
	var hit bool
	var md5, str string
	hit, md5, str, e = mBook.Chapter(params.ID, params.Chapter, params.MD5)
	if e != nil {
		return c.RenderError(e)
	} else if hit {
		return c.RenderJSON(&protocol.Item{
			Hit: true,
		})
	}
	return c.RenderJSON(&protocol.Item{
		Val: str,
		MD5: md5,
	})
}

// Assets 返回 靜態內容
func (c Book) Assets(book, chapter, name string) revel.Result {
	var mBook manipulator.Book
	filename, e := mBook.Assets(book, chapter, name)
	if e != nil {
		return c.RenderError(e)
	}
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
	// 執行 請求
	var mBook manipulator.Book
	e = mBook.UpdateChapter(params.ID, params.Chapter, params.Val)
	if e != nil {
		return c.RenderError(e)
	}

	return c.RenderJSON(nil)
}

// List 返回 檔案列表
func (c Book) List() revel.Result {
	// 解析 參數
	var params struct {
		ID      string
		Chapter string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	// 執行 請求
	var mBook manipulator.Book
	var names []string
	names, e = mBook.ListAssets(params.ID, params.Chapter)
	if e != nil {
		return c.RenderError(e)
	}

	return c.RenderJSON(names)
}

// RemoveAssets 刪除 靜態 資源
func (c Book) RemoveAssets() revel.Result {
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
	if params.Val == "" {
		return c.RenderJSON(nil)
	}
	// 執行 請求
	var mBook manipulator.Book
	e = mBook.RemoveAssets(params.ID, params.Chapter, params.Val)
	if e != nil {
		return c.RenderError(e)
	}

	return c.RenderJSON(nil)
}

// RenameAssets 靜態 資源 改名
func (c Book) RenameAssets() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID      string
		Chapter string
		Name    string
		Newname string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}

	// 執行 請求
	var mBook manipulator.Book
	e = mBook.RenameAssets(params.ID, params.Chapter, params.Name, params.Newname)
	if e != nil {
		return c.RenderError(e)
	}

	return c.RenderJSON(nil)
}

// Upload 上傳 檔案
func (c Book) Upload(book, chapter string) revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}

	// 返回 檔案夾
	var mBook manipulator.Book
	dir, e := mBook.DirectoryAssets(book, chapter)
	if e != nil {
		return c.RenderError(e)
	}

	fmt.Println(dir)

	for _, file := range c.Params.Files["file"] {
		e = c.createFile(dir, file)
		if e != nil {
			return c.RenderError(e)
		}
	}
	return c.RenderText("File is uploaded")
}
func (c Book) createFile(dir string, file *multipart.FileHeader) (e error) {
	name := file.Filename
	if !utils.IsFilename(name) {
		e = fmt.Errorf("%v is not a file name", name)
		return
	}
	// 驗證 存在
	filename := dir + "/" + name
	var f *os.File
	f, e = os.Open(filename)
	if e == nil {
		f.Close()
		e = fmt.Errorf("%v already exists", name)
		return
	} else if !os.IsNotExist(e) {
		return
	}

	// 創建 檔案
	f, e = os.Create(filename)
	if e != nil {
		return
	}
	defer f.Close()

	var src multipart.File
	src, e = file.Open()
	if e != nil {
		return
	}
	defer src.Close()
	_, e = io.Copy(f, src)
	if e != nil {
		return
	}
	return
}

// RemoveChapter 刪除 章節
func (c Book) RemoveChapter() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID      string
		Chapter string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}

	var mBook manipulator.Book
	e = mBook.RemoveChapter(params.ID, params.Chapter)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(nil)
}

// NewChapter 新建 章節
func (c Book) NewChapter() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID      string
		Chapter string
		Name    string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}

	var mBook manipulator.Book
	e = mBook.NewChapter(params.ID, params.Chapter, params.Name)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(nil)
}

// ModifyChapter 修改章節
func (c Book) ModifyChapter() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID         string
		OldChapter string
		Chapter    string
		Name       string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}

	var mBook manipulator.Book
	e = mBook.ModifyChapter(params.ID, params.OldChapter, params.Chapter, params.Name)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(nil)
}

// SortChapter 排序章節
func (c Book) SortChapter() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID      string
		Chapter []string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}

	var mBook manipulator.Book
	e = mBook.SortChapter(params.ID, params.Chapter)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(nil)
}

// Find 返回 書籍清單
func (c Book) Find() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID   string
		Name string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	var mBook manipulator.Book
	var books []data.Book
	books, e = mBook.Find(params.ID, params.Name)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(books)
}

// New 新建書籍
func (c Book) New() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID   string
		Name string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	var mBook manipulator.Book
	e = mBook.New(params.ID, params.Name)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(nil)
}

// Remove 刪除書籍
func (c Book) Remove() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	var mBook manipulator.Book
	e = mBook.Remove(params.ID)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(nil)
}

// Rename 書籍改名
func (c Book) Rename() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID   string
		Name string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	var mBook manipulator.Book
	e = mBook.Rename(params.ID, params.Name)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(nil)
}

// Reid 書籍修改ID
func (c Book) Reid() revel.Result {
	// 驗證權限
	session := c.UnmarshalSession()
	if session == nil {
		return c.RenderPermissionDenied()
	}
	// 解析 參數
	var params struct {
		ID    string
		NewID string
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}
	var mBook manipulator.Book
	e = mBook.Reid(params.ID, params.NewID)
	if e != nil {
		return c.RenderError(e)
	}
	return c.RenderJSON(nil)
}
