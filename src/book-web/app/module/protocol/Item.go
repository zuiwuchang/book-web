package protocol

// Item 返回的章節信息
type Item struct {
	// 是否命中 緩存
	Hit bool
	// 當 緩存 失效時 返回的 新值
	Val string
	// 當 緩存 失效時 返回的 新增的 md5
	MD5 string
}
