package manipulator

import (
	"book-web/app/module/db/data"
	"book-web/app/module/utils"
	"encoding/json"
	"errors"
	"fmt"
	"gitlab.com/king011/king-go/os/fileperm"
	"io/ioutil"
	"os"
	"strings"
)

var errSortExpired = errors.New("sort expired")
var errRemoveHome = errors.New("can't remove home")
var errReidHome = errors.New("can't reid home")

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

// Find 返回 書籍清單
func (m Book) Find(id, name string) (books []data.Book, e error) {
	id = strings.TrimSpace(id)
	if id != "" {
		id, e = data.CheckBookID(id)
		if e != nil {
			return
		}
	}
	name = strings.TrimSpace(name)
	var f *os.File
	f, e = os.Open(_FileRoot)
	if e != nil {
		return
	}
	var infos []os.FileInfo
	infos, e = f.Readdir(0)
	f.Close()
	if e != nil {
		return
	}
	books = make([]data.Book, 1, len(infos))
	for i := 0; i < len(infos); i++ {
		if !infos[i].IsDir() {
			continue
		}
		book := m.getName(infos[i].Name())
		if book != nil {
			if id != "" && strings.Index(book.ID, id) == -1 {
				continue
			}
			if name != "" && strings.Index(book.Name, name) == -1 {
				continue
			}
			if book.ID == "home" {
				books[0] = *book
			} else {
				books = append(books, *book)
			}
		}
	}
	if books[0].ID == "" {
		books = books[1:]
	}
	return
}

func (Book) getName(id string) (book *data.Book) {
	var e error
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}

	filepath := BookDefinition(id)
	var b []byte
	b, e = ioutil.ReadFile(filepath)
	if e != nil {
		book = &data.Book{
			ID:   id,
			Name: "_" + id,
		}
		return
	}
	book = &data.Book{}
	e = json.Unmarshal(b, book)
	if e != nil {
		book = &data.Book{
			ID:   id,
			Name: "_" + id,
		}
		return
	}
	book.ID = id
	book.Chapter = nil
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
func (Book) save(book *data.Book) (e error) {
	filepath := BookDefinition(book.ID)

	var b []byte
	b, e = json.Marshal(book)
	if e != nil {
		return
	}
	e = ioutil.WriteFile(filepath, b, fileperm.File)
	return
}

// Chapter 返回章節 內容
func (Book) Chapter(id, chapter, md5 string) (hit bool, cacheMD5, str string, e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}
	md5 = strings.TrimSpace(md5)
	// 讀取 cache md5
	md5Filepath := BookChapterMD5(id, chapter)
	var b []byte
	var md5Err error
	b, md5Err = ioutil.ReadFile(md5Filepath)
	cacheMD5 = utils.BytesToString(b)
	if md5Err == nil && utils.IsMD5Lower(md5) && utils.IsMD5Lower(cacheMD5) && md5 == cacheMD5 {
		// 命中 緩存 直接 返回
		hit = true
		return
	}

	// 未命中 緩存 讀取 數據
	filepath := BookChapter(id, chapter)
	b, e = ioutil.ReadFile(filepath)
	if e != nil {
		return
	}
	str = utils.BytesToString(b)

	// 不 存在 md5 緩存 建立
	if os.IsNotExist(md5Err) ||
		(md5Err == nil && !utils.IsMD5Lower(cacheMD5)) {
		cacheMD5, md5Err = utils.MD5Byte(b)
		if md5Err == nil {
			ioutil.WriteFile(md5Filepath, utils.StringToBytes(cacheMD5), fileperm.File)
		}
	}
	return
}

// ChapterHit 返回章節 內容 是否命中緩存
func (Book) ChapterHit(id, chapter, md5 string) (yes bool, cacheMD5 string, e error) {
	md5 = strings.TrimSpace(md5)
	if md5 == "" {
		return
	}
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}

	filepath := BookChapterMD5(id, chapter)
	var er error
	var b []byte
	b, er = ioutil.ReadFile(filepath)
	if er != nil {
		return
	}
	hitMD5 := utils.BytesToString(b)
	yes = hitMD5 == md5
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
		if os.IsNotExist(e) {
			e = nil
		}
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
	e = ioutil.WriteFile(filepath, utils.StringToBytes(val), fileperm.File)
	if e != nil {
		return
	}

	// 更新 緩存
	filepath = BookChapterMD5(id, chapter)
	var md5 string
	var en error
	md5, en = utils.MD5(val)
	if en != nil {
		ioutil.WriteFile(filepath, utils.StringToBytes(""), fileperm.File)
	} else {
		ioutil.WriteFile(filepath, utils.StringToBytes(md5), fileperm.File)
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
	if chapter == "0" {
		e = fmt.Errorf("can't remove root chapter")
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
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
			e = m.save(book)
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

// NewChapter 新建 章節
func (m Book) NewChapter(id, chapter, name string) (e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	if chapter == "0" {
		e = fmt.Errorf("can't remove root chapter")
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}

	// 讀取 定義
	var book *data.Book
	book, e = m.get(id)
	if book.Chapter == nil {
		book.Chapter = make([]data.BookChapter, 0, 1)
	} else {
		for i := 0; i < len(book.Chapter); i++ {
			if book.Chapter[i].ID == chapter {
				e = fmt.Errorf("chapter[%s] already exists", chapter)
				return
			}
		}
	}
	book.Chapter = append(book.Chapter, data.BookChapter{
		ID:   chapter,
		Name: name,
	})
	// 儲存定義
	e = m.save(book)
	if e != nil {
		return
	}
	// 創建 初始檔案
	filename := BookChapterDirectory(id, chapter)
	os.MkdirAll(filename, fileperm.Directory)
	os.MkdirAll(filename+"/assets", fileperm.Directory)
	ioutil.WriteFile(filename+"/README.md", []byte(fmt.Sprintf(`# %v`, name)), fileperm.File)
	return
}

// ModifyChapter 修改章節
func (m Book) ModifyChapter(id, oldChapter, chapter, name string) (e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	if chapter == "0" {
		e = fmt.Errorf("can't modify root chapter")
		return
	}
	chapter, e = data.CheckBookChapterID(chapter)
	if e != nil {
		return
	}
	if oldChapter == "0" {
		e = fmt.Errorf("can't modify root chapter")
		return
	}
	oldChapter, e = data.CheckBookChapterID(oldChapter)
	if e != nil {
		return
	}

	// 讀取 定義
	var book *data.Book
	book, e = m.Get(id)
	find := false
	for i := 0; i < len(book.Chapter); i++ {
		if chapter != oldChapter {
			if book.Chapter[i].ID == chapter {
				e = fmt.Errorf("chapter[%s] already exists", chapter)
				return
			}
		}

		if book.Chapter[i].ID == oldChapter {
			find = true
			if book.Chapter[i].Name != name {
				book.Chapter[i].Name = name
			} else if oldChapter == chapter {
				// 無需修改
				return
			}

			if chapter != oldChapter {
				book.Chapter[i].ID = chapter
			}
		}
	}
	if !find {
		e = fmt.Errorf("chapter[%s] is not exist", oldChapter)
		return
	}

	// 需要 改id
	if chapter != oldChapter {
		e = os.Rename(BookChapterDirectory(id, oldChapter), BookChapterDirectory(id, chapter))
		if e != nil {
			return
		}
	}

	// 儲存定義
	e = m.save(book)
	if e != nil {
		return
	}
	return
}

// SortChapter 排序章節
func (m Book) SortChapter(id string, chapters []string) (e error) {
	// 驗證 參數
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	for i := 0; i < len(chapters); i++ {
		if chapters[i] == "0" {
			e = fmt.Errorf("can't sort root chapter")
			return
		}
		chapters[i], e = data.CheckBookChapterID(chapters[i])
		if e != nil {
			return
		}
	}
	// 讀取定義
	var book *data.Book
	book, e = m.Get(id)
	num := len(book.Chapter)
	if num != len(chapters) {
		e = errSortExpired
		return
	}
	keys := make(map[string]data.BookChapter)
	for i := 0; i < len(book.Chapter); i++ {
		keys[book.Chapter[i].ID] = book.Chapter[i]
	}

	// 參加新 序列
	arrs := make([]data.BookChapter, 0, num)
	for _, id := range chapters {
		if node, ok := keys[id]; ok {
			arrs = append(arrs, node)
		} else {
			e = errSortExpired
			return
		}
	}

	// 儲存定義
	book.Chapter = arrs
	e = m.save(book)
	if e != nil {
		return
	}
	return
}

// New 新建書籍
func (m Book) New(id, name string) (e error) {
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	dir := BookDirectory(id)

	var f *os.File
	f, e = os.Open(dir)
	if e == nil {
		f.Close()
		e = fmt.Errorf("%s already exists", id)
		return
	} else if !os.IsNotExist(e) {
		return
	}

	e = os.MkdirAll(dir, fileperm.Directory)
	if e != nil {
		return
	}
	defer func() {
		if e != nil {
			os.RemoveAll(dir)
		}
	}()
	// 創建定義
	book := &data.Book{
		ID:   id,
		Name: name,
	}
	e = m.save(book)
	if e != nil {
		return
	}
	// 創建 初始檔案
	e = ioutil.WriteFile(
		BookChapter(id, "0"),
		[]byte(fmt.Sprintf(`# %v`, name)),
		fileperm.File,
	)
	if e != nil {
		return
	}
	return
}

// Remove 刪除書籍
func (m Book) Remove(id string) (e error) {
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	} else if id == "home" {
		e = errRemoveHome
		return
	}
	dir := BookDirectory(id)

	e = os.RemoveAll(dir)
	if e != nil {
		return
	}
	return
}

// Rename 書籍改名
func (m Book) Rename(id, name string) (e error) {
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	}
	var book *data.Book
	book, e = m.Get(id)
	if e != nil {
		return
	}
	if book.Name == name {
		return
	}
	book.Name = name
	e = m.save(book)
	if e != nil {
		return
	}
	return
}

// Reid 書籍修改ID
func (m Book) Reid(id, newID string) (e error) {
	id, e = data.CheckBookID(id)
	if e != nil {
		return
	} else if id == "home" {
		e = errReidHome
		return
	}
	newID, e = data.CheckBookID(newID)
	if e != nil {
		return
	} else if newID == "home" {
		e = fmt.Errorf("home already exists")
		return
	}

	dist := BookDirectory(newID)
	//
	var f *os.File
	f, e = os.Open(dist)
	if e == nil {
		f.Close()
		e = fmt.Errorf("%s already exists", newID)
		return
	} else if !os.IsNotExist(e) {
		return
	}

	src := BookDirectory(id)

	e = os.Rename(src, dist)
	if e != nil {
		return
	}
	return
}
