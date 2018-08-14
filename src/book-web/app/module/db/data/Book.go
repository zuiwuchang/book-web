package data

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
