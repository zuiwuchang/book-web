package manipulator

import (
	"book-web/configure"
	"fmt"
)

var _FileRoot string

// Init 初始化 設置
func Init() {
	cnf := configure.Single()
	_FileRoot = cnf.FileRoot

	// 用戶信息
	_User.Name = cnf.Root.Name
	_User.Nickname = cnf.Root.Nickname
	_User.Password = cnf.Root.Password
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

// BookChapterMD5 返回 章節 md5 檔案
func BookChapterMD5(id, chapter string) string {
	if chapter == "0" {
		return fmt.Sprintf("%s/%s/.md5.cache", _FileRoot, id)
	}
	return fmt.Sprintf("%s/%s/%s/.md5.cache", _FileRoot, id, chapter)
}

// BookAssets 返回靜態 資源 檔案
func BookAssets(id, chapter, name string) string {
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
