# img
![s](assets/tux.jpg)

# 定義一個 Message

## Message

message 對應 go 的 struct  
c++ 的 class  
\(既 對應語言的 結構原型\)

```text
syntax = "proto3";
package animal;
 
message Cat{
	repeated string name = 1;
	int64 id = 2;
	int32 lv = 3;
}
message Dog{
	int64 id = 1;
	string name = 2;
	string Food = 3;
}
```

syntax = "proto3";   
定義了 使用 proto3 協議 如果不寫 則爲 proto2

## Tags

上例animal中 每個 message 的 字段後都 有一個 數字 tag  
protoc 使用 這個 tag 識別 字段在二進制數據中的位置 \(字段名 只是給愚蠢人類看的 東西\)   
因此 一旦message 開始使用 就不要再改變 這個tag

tag 最小是1 最大是 536,870,911 \(pow\(2,29\)-1\)   
不能使用 _\[19000,19999\]_ 作爲 tag 這段數據被 protoc 內部保留使用

**\[1,15\]** 的tag 只需要用1個 字節 故應該儘量 將 這部分 tag保留給 最常用到的 字段


## repeated

在 字段名前 可以 加上 repeated 修飾 以表示 複數形式

非 repeated 字段 消息中 只能存在 \[0,1\] 個 repeated 字段 消息中 可以存在 \[0,...\) 個

## reserved

在升級 message 後 如果 刪除某個字段 在讀取 舊版message可能會產生問題  
可以使用 reserved 來指示 保留字段

```text
message Foo {
  reserved 2, 15, 9 to 11;
  reserved "foo", "bar";
}
```

# Types

| .proto | Notes | C++ | Python | Go |
| :--- | :--- | :--- | :--- | :--- |
| double |  | double | float | float64 |
| float |  | float | float | float32 |
| int32 | 使用變長編碼 對於負數效率較低\(應該改用 sint32\) | int32 | int | int32 |
| int64 | 使用變長編碼 對於負數效率較低\(應該改用 sint64\) | int64 | int/long | int64 |
| uint32 | 使用變長編碼 | uint32 | int/long | uint32 |
| uint64 | 使用變長編碼 | uint64 | int/long | uint64 |
| sint32 | 類似int32 但對於負數編碼 效率更好 | int32 | int | int32 |
| sint64 | 類似int64 但對於負數編碼 效率更好 | int64 | int/long | int64 |
| fixed32 | 始終使用4字節編碼 通常值 $> 2 ^ {28}$ uint32更高效 | uint32 | int | uint32 |
| fixed64 | 始終使用8字節編碼 通常值  $$> 2 ^ {56}$$ uint64更高效 | uint64 | int/long | uint64 |
| sfixed32 | 始終使用4字節編碼 | int32 | int | int32 |
| sfixed64 | 始終使用8字節編碼 | int64 | int/long | int64 |
| bool |  | bool | bool | bool |
| string | utf8編碼 或 7-bit ASCII文本 | string | str/unicode | string |
| bytes | 任意字節序列 | string | str | \[\]byte |

# 枚舉

## Enumerations

proto 允許使用 枚舉

```text
message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
  enum Corpus {
    UNIVERSAL = 0;
    WEB = 1;
    IMAGES = 2;
    LOCAL = 3;
    NEWS = 4;
    PRODUCTS = 5;
    VIDEO = 6;
  }
  Corpus corpus = 4;
}
```

## 別名

枚舉允許 爲同一個值 指定多個 不同的 別名

```text
enum EnumAllowingAlias {
  option allow_alias = true;
  UNKNOWN = 0;
  STARTED = 1;
  RUNNING = 1;
}
enum EnumNotAllowingAlias {
  UNKNOWN = 0;
  STARTED = 1;
  // RUNNING = 1;  // Uncommenting this line will cause a compile error inside Google and a warning message outside.
}
```

枚舉必須使用 一個 = 0 的值 且在最開始 \(以便和 proto2兼容 以及作爲 default val\)

# 嵌套 Message

proto 允許 message 嵌套

```text
message SearchResponse {
  repeated Result results = 1;
}
 
message Result {
  string url = 1;
  string title = 2;
  repeated string snippets = 3;
}
```

# Import

proto 允許 import 引入其它的 proto檔案  
在 protoc -I= 設置 import 搜索路徑 默認搜索當前路徑

**animal.proto**
```text
syntax = "proto3";
package animal;
 
import "base/node.proto";
 
message Animal{
	base.Info info = 1;
}
```

**base/node.proto**
```text
syntax = "proto3";
package base;
 
message Info{
	int64 id = 1;
	string name = 2;
}
```

