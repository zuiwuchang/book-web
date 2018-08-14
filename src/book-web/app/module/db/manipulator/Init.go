package manipulator

import (
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
}

// BookDefinition 返回 書 定義路徑
func BookDefinition(id string) string {
	return fmt.Sprintf("%s/%s/definition.json", _FileRoot, id)
}

// BookChapter 返回 章節 檔案
func BookChapter(id, chapter string) string {
	if chapter == "" {
		return fmt.Sprintf("%s/%s/README.md", _FileRoot, id)
	}
	return fmt.Sprintf("%s/%s/%s/README.md", _FileRoot, id, chapter)
}
