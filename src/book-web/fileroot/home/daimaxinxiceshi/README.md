# 代碼信息測試
代碼 第一行使用 `#info=` 可指定 代碼額外信息

# 禁用 行號
`#info=false`
```go
#info=false

func main(){
	fmt.Println("yes")
}
```
```sh
#!/bin/bash

echo `pwd`
echo ok
```
`//info=false`
```go
//info=false

//123
func main(){
	fmt.Println("yes")
}
```
# 啓始行號
`#info=5`
```


#info=5


func main(){
	fmt.Println("yes")
}


```

# 設置 檔案名稱
`#info="main.go"`
```go
#info="main.go"

func main(){
	fmt.Println("yes")
}
```

# 指定名稱 設置 行號
`#info={"name":"main.go","line":5}`
```go
#info={"name":"main.go","line":5}

func main(){
	fmt.Println("yes")
}
```

# 指定名稱 禁用 行號
`#info={"name":"main.go","noline":true}`
```go
#info={"name":"main.go","noline":true}

func main(){
	fmt.Println("yes")
}
```
