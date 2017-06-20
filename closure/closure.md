## ㄧ、Closure 作用
- 建立私有變數,不會受外部變數影響. 
- 能從外部讀取到函式內的區域變數.
- 建立私有的環境,保存函式內變數的值.

<br />

## 二、一個簡單的Closure
        function a() {
                var count = 0;               // 區域變數,外部不能調用,間接形成私有變數.
                function _add() {            // 區域函式,外部不能調用,間接形成私有函式.
                        count = count + 1;
                }

                function increment() {
                        _add();
                }

                function getValue() {
                        return count;
                }

                return {                      // 把函式return出去,間接形成公有函式.
                        increment: increment, 
                        getValue: getValue
                }
        }

        let f = a();    //與外部變數連結,建立了一個closure.  
        f.increment();  
        f.increment();  
        console.log(f.getValue()); //2  
        
我們知道如果在函式內用var宣告變數時,就會形成區域變數,但區域變數的作用範圍只在函式內,而我們用函式來使用這些區域變數,然後再把函式return出去,與外部的變數做關連,所以可以從外部藉由調用這些函式,間接的調用函式內的區域變數/函式,這個過程就形成了Closure.
> 會許我們已經用過了Closure,但可能並不明白這過程就是Closure的形成.  
> 加底線只是區別是私有函式.  

<br />

## 三、為何Closure可以保存變數的值？
#### i.垃圾回收機制(Garbage Collection)  
javascript的垃圾回收機制(Garbage Collection),會自動釋放再也用不到的記憶體,而實做的方式是自動釋放完全沒有被參考的物件所佔用的記憶體.

    var a = {value: 1};    // a 參考 {value: 1} 這個物件
    var b = a;             // b 參考 a
    a = null;              // a 給於 null
    console.log(a);        // null
    console.log(b);        // {value:1}  , 雖然a已經null,但b還參考這個物件,所以還不會被回收.
    b = null;              // 當b也null時,這物件{value:1}就完全沒有被參考(referenced),就會自動被回收,釋放記憶體.  
    console.log(b);        // null , {value: 1} 所佔的記憶體已被釋放.

#### ii.題外話：By Value vs By Reference：其實沒有標準答案,原則上理解基本值與複合值即可. 
    var a1 = {value: 1};
    var b1 = a1;
    a1.value = 5;
    var a2 = 2;
    var b2 = a2;
    a2 = 5;
    console.log(b1); // {value:5}  , by Reference. (關聯到同一個物件記憶體位置)  
    console.log(b2); // 2 , by Value. (儲存在各自的記憶體位置) 
> Javascript中沒有語法來控制By Reference 或 By Value , 取而代之的是 , 從值的類型作為判斷.    
> By Reference (複合值) : Object 、 Array 、 Function .    
> By Value (基本值) : String 、Number、Boolean、null、undefined.  

#### iii.題外話：記憶體洩漏(Memory Leak) : 以為已釋放的記憶體,但還有reference,所以還偷偷存在著.

    var a = {value: 1};
    var b = a;
    a = null;
    console.log(b); // {value: 1}  
    // {value: 1} 並沒有因為a的null被釋放 , 因為還有referenced , 所以記憶體並沒有被釋放.  
    // 所以如果b沒有給於null, {value: 1} 將會繼續存在, 造成記憶體洩漏(Memory Leak).  

> 所以使用 Closure 也有可能造成 Memory Leaking,要小心使用.

#### iv.如果沒有使用Closure的話,函式內的區域變數就會被自動釋放.  

    function a() {
      var count = 0;       // count沒有被參考,所以使用後佔的記憶體就會被釋放.
      return count += 1;
    }

    var fn = a();
    console.log(fn);  //1
    console.log(fn);  //1

#### v.使用Closure後,函式內的區域變數間接地被外部參考,所以不會被GC.

    function a() {
      var count = 0;    // count 間接地被外部的fn參考.
      function add() {
        return count += 1;
      }
      return add;
    }

    var fn = a();      // fn 參考了a(), 實際上是參考了 add() , 
                       // 而 add() 參考了 a() 的 count ,
                       // 所以 count 參考的 '0' 佔的記憶體並不會被釋放.
    console.log(f());  // 1
    console.log(f());  // 2
> 全域變數並不會被GC,要等到瀏覽器關閉或重整才會釋放記憶體.  
> 使用Closure的變數不會被GC,另一個意思使用Closure也會佔用記憶體.

## 四、從套件的角度理解Closure
#### 情境：使用一個有計數功能的套件(counter.js)

    counter.js 內容：
    var MyCounter = function () {
        var count = 0;

        function defaultValue(value) {
            count = value;
        }

        function getValue() {
            return count;
        }

        function increment() {
            count++;
        }

        function decrement() {
            count--;
        }

        function reset() {
            count = 0;
        }
    
        return {
            defaultValue: defaultValue,
            getValue: getValue,
            increment: increment,
            decrement: decrement,
            reset: reset
        }
    }  

#### i.只需在index.html引入counter.js.
#### ii.即可在程式使用counter來做計數功能.
        var counter = MyCounter();  //建立第一個clourse
        var counter2 = MyCounter(); //建立第二個clourse
        var count = 1000;
        console.log(counter.getValue()); // 0

        counter.defaultValue(100);
        counter.increment();
        counter.increment();
        console.log(counter.getValue()); // 102

        counter.decrement();
        console.log(counter.getValue()); // 101
        console.log(counter2.getValue()); // 0

        counter.reset();
        console.log(counter.getValue()); // 0

###   Q & A 
####  Q1：是否使用到'建立私有變數,不會受外部變數影響'？
####  A1：套件內使用到私有變數(區域變數)來計數,即使有個count的全域變數,套件內的count也不會受到影響.

####  Q2：是否使用到'能從外部讀取到函式內的區域變數'？
####  A2：從Q1可以理解到這套件不會用到全域變數,那要怎麼讀取這個私有變數(區域變數),正式運用到閉包的特性.

####  Q3：是否是用到'建立私有的環境,保存函式內變數的值'?
####  A3：當我們調用了兩次increment(),再調用getValue()時,因為Closure保存了值,就會得到102.   

## 五、立即函式 IIFE

> 立即函式 IIFE (Immediately Invoked Function Expression) : 如同字義,會立即執行函式 , 用法 => (function(arg){...})(in) 或 (function(arg){...}(in)).
<br />

## 參考  
- [阮一峰 - 學習Javascript閉包（Closure)](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)  
- [JavaScript-Garden Closures and References](http://bonsaiden.github.io/JavaScript-Garden/#function.closures)
- [閉包(Closures)](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [JavaScript中函式就是一種物件](https://pjchender.blogspot.tw/2016/03/javascriptfunctionobjects.html)
- [全面了解JavaScirpt的垃圾(garbage collection)回收機制](http://www.divcss.online/divcssbuju/jsrumen/jsjichu/201612/14572.html)
- [JavaScript 的 Garbage Collection](http://tom76kimo-blog.logdown.com/posts/177173-javascript-garbage-collection)
- [Memory Leaks 的情況以及如何解決與偵測](http://blog.smlsun.com/2013/12/javascript-memory-leaks_3701.html)
- [[筆記] 談談JavaScript中by reference和by value的重要觀念](https://pjchender.blogspot.tw/2016/03/javascriptby-referenceby-value.html)
- 「你所不知道的JS」系列書籍
