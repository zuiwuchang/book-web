package utils

import (
	"crypto/sha512"
	"encoding/hex"
)

// SHA512 將字符串 進行 hash
func SHA512(str string) (v string, e error) {
	sha := sha512.New()
	_, e = sha.Write(StringToBytes(str))
	if e != nil {
		return
	}
	v = hex.EncodeToString(sha.Sum(nil))
	return
}
