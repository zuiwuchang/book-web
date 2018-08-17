package manipulator

import (
	"book-web/app/module/db/data"
	"encoding/json"
	"fmt"
	"gitlab.com/king011/king-go/os/fileperm"
	"io/ioutil"
	"os"
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
func (Book) Assets(id, chapter, name string) (str string, e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}
	str = BookAssets(id, chapter, name)
	return
}

// ListAssets 返回 靜態資源 列表
func (Book) ListAssets(id, chapter string) (names []string, e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}
	// 打開檔案夾
	dir := BookDirectoryAssets(id, chapter)
	var f *os.File
	f, e = os.Open(dir)
	if e != nil {
		return
	}
	defer f.Close()
	var info os.FileInfo
	info, e = f.Stat()
	if e != nil {
		return
	}
	if !info.IsDir() {
		e = fmt.Errorf("%s is not a directory", dir)
		return
	}

	// 查詢 子檔案
	var infos []os.FileInfo
	infos, e = f.Readdir(0)
	if e != nil {
		return
	} else if len(infos) == 0 {
		return
	}
	names = make([]string, 0, len(infos))
	for _, info = range infos {
		if !info.IsDir() {
			names = append(names, info.Name())
		}
	}
	return
}

// UpdateChapter 更新章節內容
func (Book) UpdateChapter(id, chapter, val string) (e error) {
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
	e = ioutil.WriteFile(filepath, []byte(val), fileperm.File)
	if e != nil {
		return
	}
	return
}

// RemoveAssets 刪除 靜態 資源
func (m Book) RemoveAssets(id, chapter, val string) (e error) {
	val, e = m.Assets(id, chapter, val)
	if e != nil {
		return
	}
	e = os.Remove(val)
	if e != nil {
		return
	}
	return
}
