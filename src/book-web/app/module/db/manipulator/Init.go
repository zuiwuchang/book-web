package manipulator

import (
	"book-web/app/module/utils"
	"fmt"
	"github.com/revel/revel"
	"path/filepath"
	"strings"
)

var _FileRoot string

// Init 初始化 設置
func Init() {
	// 檔案 根目錄
	_FileRoot = strings.TrimSpace(revel.Config.StringDefault("fileroot", "fileroot"))
	if !filepath.IsAbs(_FileRoot) {
		_FileRoot = revel.BasePath + "/" + _FileRoot
	}
	// 用戶信息
	_User.Name = strings.TrimSpace(revel.Config.StringDefault("user.name", "king"))
	_User.Nickname, _ = revel.Config.String("user.nickname")
	_User.Nickname = strings.TrimSpace(_User.Nickname)
	if _User.Nickname == "" {
		_User.Nickname = _User.Name
	}
	pwd := strings.TrimSpace(revel.Config.StringDefault("user.password", "cerberus is an idea"))
	var e error
	_User.Password, e = utils.SHA512(pwd)
	if e != nil {
		panic(e)
	}
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
	return fmt.Sprintf("%s/%s/%s/assets/%s", _FileRoot, id, chapter, name)
}

// BookDirectoryAssets 返回靜態 資源 檔案夾路徑
func BookDirectoryAssets(id, chapter string) string {
	return fmt.Sprintf("%s/%s/%s/assets", _FileRoot, id, chapter)
}
