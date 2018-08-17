package manipulator

import (
	"book-web/app/module/db/data"
	"book-web/app/module/utils"
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
func (m Book) Get(id string) (book *data.Book, e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}

	// 讀取 定義
	book, e = m.get(id)
	if e != nil {
		return
	}
	filename := BookDirectory(id)
	f, e := os.Open(filename)
	if e != nil {
		return
	}
	defer f.Close()
	var infos []os.FileInfo
	infos, e = f.Readdir(0)
	if e != nil {
		return
	}
	keys := make(map[string]bool)
	if book.Chapter == nil {
		book.Chapter = make([]data.BookChapter, 0, 10)
	} else {
		for i := 0; i < len(book.Chapter); i++ {
			keys[book.Chapter[i].ID] = true
		}
	}
	for _, info := range infos {
		key := info.Name()
		if key == "0" ||
			keys[key] ||
			!data.IsBookChapterID(key) {
			continue
		}
		book.Chapter = append(book.Chapter, data.BookChapter{
			ID:   key,
			Name: "_" + key,
		})
		keys[key] = true
	}
	return
}

// Get 返回指定的 書
func (Book) get(id string) (book *data.Book, e error) {
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
func (Book) save(book data.Book) (e error) {
	filepath := BookDefinition(book.ID)
	book.ID = ""

	var b []byte
	b, e = json.Marshal(book)
	if e != nil {
		return
	}
	e = ioutil.WriteFile(filepath, b, fileperm.File)
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
	if !utils.IsFilename(name) {
		e = fmt.Errorf("%v is not a file name", name)
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

// DirectoryAssets 返回 靜態資源 檔案夾
func (Book) DirectoryAssets(id, chapter string) (dir string, e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}
	dir = BookDirectoryAssets(id, chapter)

	var f *os.File
	f, e = os.Open(dir)
	if e == nil {
		f.Close()
		return
	}
	if os.IsNotExist(e) {
		e = os.MkdirAll(dir, fileperm.Directory)
		if e != nil {
			return
		}
		return
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
func (m Book) RemoveAssets(id, chapter, name string) (e error) {
	name, e = m.Assets(id, chapter, name)
	if e != nil {
		return
	}
	e = os.Remove(name)
	if e != nil {
		return
	}
	return
}

// RenameAssets 靜態 資源 改名
func (m Book) RenameAssets(id, chapter, name, newname string) (e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}
	if !utils.IsFilename(name) {
		e = fmt.Errorf("%v is not a file name", name)
		return
	}
	if !utils.IsFilename(newname) {
		e = fmt.Errorf("%v is not a file name", newname)
		return
	}

	name = BookAssets(id, chapter, name)
	tmp := newname
	newname = BookAssets(id, chapter, newname)
	var f *os.File
	f, e = os.Open(newname)
	if e == nil {
		f.Close()
		e = fmt.Errorf("%s already exists", tmp)
		return
	} else if os.IsNotExist(e) {
		e = nil
	} else {
		return
	}

	e = os.Rename(name, newname)
	if e != nil {
		return
	}
	return
}

// RemoveChapter 刪除 章節
func (m Book) RemoveChapter(id, chapter string) (e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}
	if chapter == "0" {
		e = fmt.Errorf("can't remove root chapter")
		return
	}
	// 讀取 定義
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}

	// 讀取 定義
	var book *data.Book
	book, e = m.get(id)
	for i := 0; i < len(book.Chapter); i++ {
		if book.Chapter[i].ID == chapter {
			book.Chapter = append(book.Chapter[:i], book.Chapter[i+1:]...)
			// 存儲 新定義
			e = m.save(*book)
			if e != nil {
				return
			}
			break
		}
	}
	// 刪除 檔案夾
	os.RemoveAll(BookChapterDirectory(id, chapter))
	return
}
