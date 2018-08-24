package utils

import (
	"crypto/md5"
	"encoding/hex"
	"regexp"
)

var matchMD5Lower = regexp.MustCompile(`^[0-9a-f]{32}$`)

// IsMD5Lower .
func IsMD5Lower(str string) (yes bool) {
	if str == "" || len(str) != 32 {
		return false
	}
	return matchMD5Lower.MatchString(str)
}

// MD5 將字符串 進行 hash
func MD5(str string) (v string, e error) {
	sha := md5.New()
	_, e = sha.Write(StringToBytes(str))
	if e != nil {
		return
	}
	v = hex.EncodeToString(sha.Sum(nil))
	return
}

// MD5Byte bytes 進行 hash
func MD5Byte(src []byte) (v string, e error) {
	sha := md5.New()
	_, e = sha.Write(src)
	if e != nil {
		return
	}
	v = hex.EncodeToString(sha.Sum(nil))
	return
}
