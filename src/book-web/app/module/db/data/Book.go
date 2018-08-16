package data

import (
	"errors"
	"regexp"
	"strings"
)

var matchID = regexp.MustCompile(`^[a-zA-Z][a-zA-Z0-9\-]*$`)
var errBookInvalidID = errors.New("invalid book id")
var errBookChapterInvalidID = errors.New("invalid book chapter id")

// CheckBookID 驗證 id 是否 符合規範
func CheckBookID(id string) (string, error) {
	id = strings.TrimSpace(id)
	if id == "" || !matchID.MatchString(id) {
		return "", errBookInvalidID
	}
	return id, nil
}

// CheckBookChapterID 驗證 id 是否 符合規範
func CheckBookChapterID(id string) (string, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return id, nil
	}
	if !matchID.MatchString(id) {
		return "", errBookChapterInvalidID
	}
	return id, nil
}

// BookChapter 書 章節定義
type BookChapter struct {
	// 章節名稱
	Name string
	// 章節地址
	ID string
}

// Book 定義了一本書
type Book struct {
	ID string
	// 書名
	Name string
	// 書章節
	Chapter []BookChapter
}

// Format 標準化數據 主要 修復錯誤的章節 數據
func (d *Book) Format() {
	if len(d.Chapter) == 0 {
		return
	}
	arrs := make([]BookChapter, 0, len(d.Chapter))
	keysID := make(map[string]bool)
	keysName := make(map[string]bool)
	for _, node := range d.Chapter {
		node.ID = strings.TrimSpace(node.ID)
		node.Name = strings.TrimSpace(node.Name)
		// 忽略無效 或 重複的章節
		if !matchID.MatchString(node.ID) ||
			keysID[node.ID] ||
			keysName[node.Name] {
			continue
		}
		// 添加 記錄
		keysID[node.ID] = true
		keysName[node.Name] = true
		arrs = append(arrs, node)
	}
	d.Chapter = arrs
}
