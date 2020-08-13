package utils

import (
	"bytes"
	"io"
	"os"
	"time"
)

// ReadFile .
func ReadFile(filename string) (b []byte, modTime time.Time, e error) {
	f, e := os.Open(filename)
	if e != nil {
		return
	}
	defer f.Close()
	// It's a good but not certain bet that FileInfo will tell us exactly how much to
	// read, so let's try it but be prepared for the answer to be wrong.

	fi, e := f.Stat()
	if e != nil {
		return
	}
	modTime = fi.ModTime()

	// As initial capacity for readAll, use Size + a little extra in case Size
	// is zero, and to avoid another allocation after Read has filled the
	// buffer. The readAll call will read into its allocated internal buffer
	// cheaply. If the size was wrong, we'll either waste some space off the end
	// or reallocate as needed, but in the overwhelmingly common case we'll get
	// it just right.
	size := fi.Size() + bytes.MinRead
	var n int64 = bytes.MinRead
	if size > n {
		n = size
	}
	b, e = readAll(f, n)
	return
}

// readAll reads from r until an error or EOF and returns the data it read
// from the internal buffer allocated with a specified capacity.
func readAll(r io.Reader, capacity int64) (b []byte, err error) {
	var buf bytes.Buffer
	// If the buffer overflows, we will get bytes.ErrTooLarge.
	// Return that as an error. Any other panic remains.
	defer func() {
		e := recover()
		if e == nil {
			return
		}
		if panicErr, ok := e.(error); ok && panicErr == bytes.ErrTooLarge {
			err = panicErr
		} else {
			panic(e)
		}
	}()
	if int64(int(capacity)) == capacity {
		buf.Grow(int(capacity))
	}
	_, err = buf.ReadFrom(r)
	return buf.Bytes(), err
}
