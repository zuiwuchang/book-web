package manipulator

import (
	"book-web/configure"
	"book-web/db/data"
	"fmt"
	"os"
	"path/filepath"

	"gitlab.com/king011/king-go/os/fileperm"
)

var _FileRoot string

// Init 初始化 設置
func Init() (e error) {
	cnf := configure.Single()
	_FileRoot = cnf.FileRoot

	// 用戶信息
	_User.Name = cnf.Root.Name
	_User.Nickname = cnf.Root.Nickname
	_User.Password = cnf.Root.Password

	//
	id := `home`
	os.MkdirAll(BookDirectory(id), fileperm.Directory)
	var mBook Book
	_, _, e = mBook.get(id)
	if os.IsNotExist(e) {
		_, e = mBook.save(&data.Book{
			ID:   id,
			Name: `書單`,
		})
		if e != nil {
			return
		}
	}
	filename := BookChapter(id, `0`)
	f, e := os.Open(filename)
	if e == nil {
		f.Close()
		return
	}

	if os.IsNotExist(e) {
		f, e = os.Create(filename)
		if e != nil {
			return
		}
		f.Close()
	}
	return
}

// BookDefinition 返回 書 定義路徑
func BookDefinition(id string) string {
	return fmt.Sprintf("%s/%s/definition.json", _FileRoot, id)
}

// BookChapter 返回 章節 檔案
func BookChapter(id, chapter string) string {
	if chapter == "0" {
		return fmt.Sprintf("%s/%s/README.md", _FileRoot, id)
	}
	return fmt.Sprintf("%s/%s/%s/README.md", _FileRoot, id, chapter)
}

// BookAssets 返回靜態 資源 檔案
func BookAssets(id, chapter, name string) string {
	name = filepath.Base(name)
	return fmt.Sprintf("%s/%s/%s/assets/%s", _FileRoot, id, chapter, name)
}

// BookDirectoryAssets 返回靜態 資源 檔案夾路徑
func BookDirectoryAssets(id, chapter string) string {
	return fmt.Sprintf("%s/%s/%s/assets", _FileRoot, id, chapter)
}

// BookChapterDirectory 返回 章節 檔案夾
func BookChapterDirectory(id, chapter string) string {
	return fmt.Sprintf("%s/%s/%s", _FileRoot, id, chapter)
}

// BookDirectory 返回 書 檔案夾
func BookDirectory(id string) string {
	return fmt.Sprintf("%s/%s", _FileRoot, id)
}
