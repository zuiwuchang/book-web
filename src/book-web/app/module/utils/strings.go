package utils

import (
	"reflect"
	"strings"
	"unsafe"
)

// IsFilename .
func IsFilename(name string) (yes bool) {
	if name == "" ||
		name == "." ||
		strings.Index(name, "..") != -1 ||
		strings.Index(name, "/") != -1 ||
		strings.Index(name, "\\") != -1 {
		return
	}
	name = strings.TrimSpace(name)
	if name == "" || name == "." {
		return
	}
	yes = true
	return
}

// StringToBytes 字符串 轉 []byte
func StringToBytes(str string) []byte {
	//獲取 字符串 頭
	strHeader := (*reflect.StringHeader)(unsafe.Pointer(&str))

	//創建 slice
	var b []byte
	//獲取 slice 頭
	sliceHeader := (*reflect.SliceHeader)(unsafe.Pointer(&b))
	//設置 屬性
	sliceHeader.Data = strHeader.Data
	sliceHeader.Len = strHeader.Len
	sliceHeader.Cap = strHeader.Len

	return b
}

// BytesToString []byte 轉 字符串
func BytesToString(b []byte) string {
	//獲取 slice 頭
	sliceHeader := (*reflect.SliceHeader)(unsafe.Pointer(&b))

	//創建 string
	var str string

	//獲取 字符串 頭
	strHeader := (*reflect.StringHeader)(unsafe.Pointer(&str))

	//設置 屬性
	strHeader.Data = sliceHeader.Data
	strHeader.Len = sliceHeader.Len
	return str
}
