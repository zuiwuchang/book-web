# 代碼高亮測試
此頁面用來 測試 highlight 效果

```
  #include <iostream>
int main()
{
	  return 0;
}
```

# txt
```txt

  文本測試
123 [google](https://google.com)
456
```

# 單行
`fmt.Println("yes")` 123143 `echo ok` 234 dhdfsh `456`

# Common
所有 highlight common 都被支持

## sh
```bash
#!/bin/bash
strs='以 空格 分割	字符串'
for str in $strs
do
	echo $str
done
 
for str in 以 空格 分割	字符串
do
	echo $str
done
```

## c++
```c++
#include <iostream>

int main()
{
	std::cout<<"yes"<<std::endl;
	return 0;
}
```

## css
```css
.menu-btn{
    outline: 0 none !important;
    border: none;
}
.no-outline{
    outline: 0 none !important;
    border: none;
}
.center{
    display:flex;
    align-items:center;
    justify-content:center;
}
.hide{
    display: none;
}
.pointer{
    cursor: pointer;
}
```

## html
```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>book</title>
  <base href="/angular/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <script src="assets/js/highlight/9.12.0/highlight.pack.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=XXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
  </script> -->

  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#1976d2">
</head>

<body>
  <app-root></app-root>
  <noscript>Please enable JavaScript to continue using this application.</noscript>
  </head>

  <body>
    <app-root></app-root>
  </body>

</html>
```
## ini
```ini
ID=1
Name=Kate Beckinsale
```
## json
```json
{
	"ID":1,
	"Name":"kate beckinsale"
}
```

## js
```js
$(document).ready(function() {
	//獲取一個 Generator 實例
	var g = Generator();
	while(true) {
		//執行 函數體
		var rs = g.next();
		alert(rs.value);
		
		if(rs.done){
			break;
		}
	}
 
});
//Generator 定義
function *Generator() {
	var v = 0;
	while(true){
		//中斷 並將值返回給 next
		yield v++;
		if(v > 2){
			break;
		}
	}
	return v;
}
```

## Makefile
```makefile
bin = hellow.exe
objs = main.o Animal.o
 
hellow : $(objs)
	g++ -O2 -o $(bin) $(objs)
 
main.o : main.cpp
	g++ -c -O2 -Wall -Iinclude main.cpp
 
Animal.o : src/Animal.cpp
	g++ -c -O2 -Wall -Iinclude src/Animal.cpp
 
clean : 
	rm $(bin) $(objs)
```

## Markdown
```markdown
1. a
2. b
3. c

* 1
* 2
* 3

# kate
234

> 456
```

## nginx
```nginx
    # 配置一個開發環境
    server {
        listen  80;
        server_name     dev.my.web;

        # 轉發 後端web服務 請求 
        location / {
            proxy_pass http://localhost:9000/;
            proxy_set_header    Host            $host;
            proxy_set_header    X-Real-IP       $remote_addr;
            proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # 轉發 angular 請求 
        location /angular/ {
            proxy_pass http://localhost:4200/;
            proxy_set_header    Host            $host;
            proxy_set_header    X-Real-IP       $remote_addr;
            proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        # 轉發 ng serve 請求 
        location /sockjs-node/ {
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_http_version 1.1;

            proxy_set_header    Host            $host;
            proxy_set_header    X-Real-IP       $remote_addr;
            proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_pass http://localhost:4200/sockjs-node/;
        }
    }
```

## python
```python
#!/usr/bin/env python3
 
i = 0
while i < 10:
    print(i)
    i += 1
    if i == 5:
        break  # 不會執行 else
else:
    print("ok")  # 不會執行
 
for i in range(10, 15):
    print(i)
else:
    print("yes")  # 會執行
```

## sql
```sql
create database DBTest DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
create table items(id int primary key auto_increment,test int not null unique default 123)engine=innodb;
```
# other
所有 highlight other 中 被支持的 語言

## CMake
```cmake
cmake_minimum_required(VERSION 3.0)

project(console)
add_compile_options(-std=gnu++17)
message(123)
add_executable(console main.cpp)
```
## Dart
```dart
int fib(int n) => (n > 2) ? (fib(n - 1) + fib(n - 2)) : 1;
// this is a fibonacci function implementation with a ternary operator in Dart
// this code shall be read as:
// If int n > 2, return fib(n - 1) + fib(n - 2); 
// otherwise, return int 1 as result

void main() {
  print('fib(20) = ${fib(20)}');
}
```
## go
```go
package main

import (
	"fmt"
)

func main(){
	fmt.Println("yes")
}
```
## less
```less
@some: foo;

div {
    margin: if((2 > 1), 0, 3px);
    color:  if((iscolor(@some)), darken(@some, 10%), black);
}
```

## lua
```lua
//定義一個 數組 迭代器
function values(t)
	local i	=0
	return function ()
				i	=	i	+	1
				return t[i]
			end
end
 
//遍歷之
t	=	{1,2,3}
iter	=	values(t)
while true do
	local v = iter()
	if v == nil then
		break
	end
 
	print(v)
 
end
 
 
 
//泛型for 只是簡化了上面的 while
for v in values(t) do
	print(v);
end
```

## Protocol Buffers
**protobuf**
```protobuf
syntax = "proto3";
 
package web;

import "kc-middle/gservice/Table.proto";
import "kc-middle/gservice/Basic.proto";

// 終端操作
service Slave {
	// 通過 id 查詢 終端
    rpc GetByID(SlaveGetByIDRequest) returns (SlaveGetByIDReply){}
    // 創建 終端
    rpc New(SlaveNewRequest) returns (SlaveNewReply){}
    // 修改 物理地址
    rpc SetPhysical(SlaveSetPhysicalRequest) returns (SlaveSetPhysicalReply){}
}
message SlaveGetByIDRequest{
    int64 ID = 1;
}
message SlaveGetByIDReply{
    gservice.Slave Data = 1;
}
message SlaveNewRequest{
    // 操作者
    gservice.KPRoot Root = 1;

    string Physical = 2;
	string Logic = 3;
	bool Priority = 4;
	int32 Volume = 5;
	int32 Frequency = 6;
	string Place = 7;
    int32 Gps = 8;
    // 所在區域
	int64 Area = 9;    
}
message SlaveNewReply{
    // 返回 新終端 id
    int64 ID = 1;
}
message SlaveSetPhysicalRequest{
    // 操作者
    gservice.KPRoot Root = 1;

    int64 ID = 2;
    string Val = 3;
}
message SlaveSetPhysicalReply{

}
```

## scss
```scss
ul {
  list-style: none;

  li {
    display: inline-block;
    padding: 15px;

    a {
      color: #444;
      font-size: 16px;
      text-decoration: none;
    }
  }
}
```

## TypeScript
```ts
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { ToasterConfig } from 'angular2-toaster';
import { CacheService } from './core/cache/cache.service';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../environments/environment';
declare const gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public config: ToasterConfig =
    new ToasterConfig({
      positionClass: "toast-bottom-right"
    });
  constructor(
    private cacheService: CacheService,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
  ) {
  }
  ngOnInit() {
    // 註冊圖標
    this.matIconRegistry.registerFontClassAlias(
      'fontawesome-fa', // 為此 Icon Font 定義一個 別名
      'fa' // 此 Icon Font 使用的 class 名稱
    ).registerFontClassAlias(
      'fontawesome-fab',
      'fab'
    ).registerFontClassAlias(
      'fontawesome-fal',
      'fal'
    ).registerFontClassAlias(
      'fontawesome-far',
      'far'
    ).registerFontClassAlias(
      'fontawesome-fas',
      'fas'
    );
    // 註冊 google analytics
    if (environment.gtag && gtag) {
      console.log("run google analytics", environment.gtag)
      gtag('config', environment.gtag);

      this.router.events.pipe(
        distinctUntilChanged(
          (previous: any, current: any) => {
            if (current instanceof NavigationEnd) {
              return previous.url === current.url;
            }
            return true;
          }
        )
      ).subscribe(
        (x: any) => {
          gtag('event', 'page_view', { 'page_path': x.url });
        }
      );
    }
  }
}
```

## Vim Script
**vim**
```vim
function! ToggleSyntax()
   if exists("g:syntax_on")
      syntax off
   else
      syntax enable
   endif
endfunction
 
nmap <silent>  ;s  :call ToggleSyntax()<CR>
```

## yaml
```yaml
onfig/ibus/rime/installation.yaml 
distribution_code_name: "ibus-rime"
distribution_name: Rime
distribution_version: 1.2
install_time: "Thu Jan 25 12:50:17 2018"
sync_dir: "/home/king/Dropbox/rime"
installation_id: "king-ubuntu64-company-xsd"
rime_version: 1.2.0
```
