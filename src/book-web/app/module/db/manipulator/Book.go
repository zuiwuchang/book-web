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
	book.ID = id
	return
}

// Chapter 返回章節 內容
func (Book) Chapter(id, chapter string) (str string, e error) {
	filepath := BookChapter(id, chapter)
	b, e := ioutil.ReadFile(filepath)
	if e != nil {
		return
	}
	str = string(b)
	return
}
