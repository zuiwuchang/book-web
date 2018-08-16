package manipulator

import (
	"book-web/app/module/db/data"
	"encoding/json"
	"io/ioutil"
)

// Book .
type Book struct {
}

// Get 返回指定的 書
func (Book) Get(id string) (book *data.Book, e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}

	// 讀取 定義
	filepath := BookDefinition(id)
	b, e := ioutil.ReadFile(filepath)
	if e != nil {
		return
	}
	book = &data.Book{}
	e = json.Unmarshal(b, book)
	if e != nil {
		book = nil
		return
	}
	// 標準化數據
	book.Format()
	book.ID = id
	return
}

// Chapter 返回章節 內容
func (Book) Chapter(id, chapter string) (str string, e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}

	filepath := BookChapter(id, chapter)
	b, e := ioutil.ReadFile(filepath)
	if e != nil {
		return
	}
	str = string(b)
	return
}

// Assets 返回 靜態資源 路徑
func (Book) Assets(book, chapter, name string) string {
	return BookAssets(book, chapter, name)
}
