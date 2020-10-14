# url測試
```sh
#!/bin/bash
strs='以 空格 分割    字符串'
for str in $strs
do
    echo $str
done
for str in 以 空格 分割    字符串
do
    echo $str
done
```

```txt
文本測試
123

[adjustable](http://google.com "Giiidd"){:target="_blank"}
![adjustable](http://google.com "Giiidd"){:target="_blank"}
<div>123</div> = & ?
456
```

* [https google](https://www.google.com)
* [http google](http://www.google.com)
* [highlight](home/highlight)
* [root highlight](/home/highlight)

![tux](assets/tux.jpg)
[tux](assets/tux.jpg)
