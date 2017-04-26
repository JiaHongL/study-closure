// 找了一個計數器的套件
// 在index.html => 引入 <script src="counter.js" type="text/javascript"></script>
// counter.js 內的程式碼
// ----- counter.js ------
(function () {
    var count = 0;

    function defaultValue(value) {
        count = value;
    }

    function getValue() {
        return count;
    }

    function increment() {
        count++
    }

    function decrement() {
        count--
    }

    function reset() {
        count = 0;
    }

    var counter = function () {
        return {
            defaultValue: defaultValue,
            getValue: getValue,
            increment: increment,
            decrement: decrement,
            reset: reset
        }
    }
    global.MyCounter = counter;
})()
// ----- counter.js End------



//自己的程式
// ----- mycode ------
var counter = MyCounter();
var count = 1000;
console.log(counter.getValue()); // 0

counter.defaultValue(100);
counter.increment();
counter.increment();
console.log(counter.getValue()); // 102

counter.decrement();
console.log(counter.getValue()); // 101

counter.reset();
console.log(counter.getValue()); // 0
// -----  mycode End------



// 其它：javascript的垃圾回收機制(Garbage Collection)
var a = {
    value: 1
}; // a 參考 {value: 1} 這個物件
var b = a; // b 參考 a
a = null; // 雖然a已經null,但b還參考這個物件,所以還不會被回收.
console.log(a); // null
console.log(b); // {value:1} 
b = null; // 當b也null時,這物件{value:1}就沒有被參考(referenced),就會自動被回收,釋放記憶體.
console.log(b); // null

