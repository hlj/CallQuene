# Call Quene for Node.js 
   (Thanks to google translate)

   Restricted number of concurrent running to some asynchronous method.  

## Puspose: 
   Benifit from Node.js powerful ability to run asynchronously, we can easily write while serving thousands of customers back-end services. But in the real world, many resources are limited, 
Such as database connections, file handles, network bandwidth, and so on. You may be able to easily Node.js program itself to cope with high concurrent access, but it is likely to wear down the old back-end database. 
Therefore, we sometimes need to limit concurrent traffice of the scarce resources. Call Quene is an easy to use js libraries, you can specify certain restrictions on asynchronous methods to control resource consumption. 

## Usage: 
1 applied to existing objects 

        var CQ = require ('callQuene'). CallQuene; 
        var cq = new CQ ({parallelNumber: 2}); / / number of parallel set to  2 

        function cb (sum) {console.log (sum);} 
        var obj = { 
            val: 15, 
            add1: function (a, b, cb) { 
                setTimeout (cb, 50, a + b); 
            } 
            add2: function (a, b, cb) { 
                setTimeout (cb, 150, a + b); 
            } 
                add3: function (a, b) { 
            return a + b; 
            } 
        }; 
     
        cq.applyTo (obj, ['add1', 'add2']); / / cq applied to the obj to the asynchronous method 
        / / The following 4 time calls will be limited to runs only 2 at a time, so all of the four calls takes about 300ms. 
        obj.add1 (1,1); 
        obj.add2 (1,2); 
        obj.add1 (1,3); 
        obj.add2 (1,4); 
        / / Output: 2,4,3,5 

(2) explicitly call 

        var CQ = require ('callQuene'). CallQuene; 
        var cq = new CQ (); / / default number of parallel is 1 

        function asyncAdd (a, b, cb) { 
            setTimeout (cb, 200, a + b); 
        } 
        var sum = 0; 
            function cb (v) { 
            sum + = v; 
        } 
        / / Use the Add method to add an asynchronous call queue 
        cq.add (this, asyncAdd, [1,2, cb]); 
        cq.add (this, asyncAdd, [2,3]); 

## API: 
   * Create an instance for CallQuene 

        var CQ = require ('callQuene'). CallQuene; 
        var cq = new CQ ({parallelNumber: 100, delay: 30}); 

      Parameters: 
        1. parallelNumber: the number of concurrent execution, the default is 1 
        2. delay: delay execution, the default is 0. This parameter is typically used with parallelNumber = 1. 

   * add (caller, fn, args): an asynchronous call to join the queue 
      Parameters: 
        1. caller: function belongs to the object, if a global function, available <i>this</i> 
        2. fn: Asynchronous function 
        3. args: call this function's parameter list must be an array, such as: [1,3, b, {a: 1}, callback] 

   * applyTo (obj, fns): the limit applied to a specified method on all objects 
      Parameters: 
        1. Obj: the object to be applied 
        2. fns: list of methods to be limited, must be an array, such as: ['aFunc1', 'aFunc2'] 

   * count: get the current number of calls remaining in the queue 

   * runningCount: get the current running in the number of asynchronous calls 

   * parallelNumbers: Gets or sets the number of concurrent constraints 

   * delay: Get or set the call delay 


## Test 
  Unit Testing with jasmine-node. In the root directory of the source,run `jasmine-node spec` may start all the tests.



***

# Call Quene for Node.js
   限制某些异步方法并发运行的的数量

##意图:
   得益于Node.js强大的异步运行能力，我们能轻易编写出同时服务于成千上万用户的后台服务。但在真实的世界里,许多资源都是有限的,
比如数据库连接、文件句柄、网络带宽等等。你的Node.js程序本身也许能轻松的应付极高的并发访问,但却很可能拖垮后端老旧的数据库。
因此，我们有时需要限制对一些稀缺资源的并发访问量。Call Quene就是一个简单易用的js库，可以对你指定的某些异步方法施加限制，
以控制资源消耗。

##使用方法： 
1.   应用到已有对象 

        var CQ = require('callQuene').CallQuene;
        var cq = new CQ({parallelNumber:2}); //同时运行数量为2

        function cb(sum) { console.log(sum);}
        var obj = {
            val : 15,
            add1 : function(a,b,cb){
                setTimeout(cb,50,a+b);
            },
            add2 : function(a,b,cb){
                setTimeout(cb,150,a+b);
            },
                add3 : function(a,b) {
            return a+b;
            }
        };
    
        cq.applyTo(obj,['add1','add2']); //将cq应用到obj对象的异步方法
        //下面4次调用将会被限制同时只能运行2个，所以这4个调用全部运行完需要大约300ms
        obj.add1(1,1);
        obj.add2(1,2);
        obj.add1(1,3);
        obj.add2(1,4);
        //output: 2,4,3,5

2.   显式调用  

        var CQ = require('callQuene').CallQuene;
        var cq = new CQ(); //默认运行数量为1

        function asyncAdd(a,b,cb){
            setTimeout(cb,200,a+b);
        }
        var sum = 0;
            function cb(v){
            sum  += v;
        }
        //使用add方法将异步调用放入队列
        cq.add(this,asyncAdd,[1,2,cb]);
        cq.add(this,asyncAdd,[2,3]);

##API:
   *  创建CallQuene实例  

        var CQ = require('callQuene').CallQuene;
        var cq = new CQ({parallelNumber:100,delay:30});

      参数:  
        1. parallelNumber: 并发执行数量，默认为1  
        2. delay: 执行延时，默认为0。此参数通常配合parallelNumber=1使用。  

   *  add(caller,fn,args) : 将一次异步调用加入队列  
      参数:  
        1. caller: 函数所属的对象，如果为全局函数，可用this  
        2. fn: 异步函数  
        3. args: 调用此函数的参数列表,必须是一个数组,如: [1,3,b,{a:1},callback]

   *  applyTo(obj,fns) : 将限制应用到一个对象的所有指定方法上  
      参数:  
        1. obj: 将要应用的对象
        2. fns: 要被限制的方法列表，必须是一个数组，如：['aFunc1','aFunc2']

   *  count : 获取当前队列中剩余的调用数量

   *  runningCount: 获取当前正在运行中的异步调用数量

   *  parallelNumbers: 获取或设置并发限制数量

   *  delay: 获取或设置调用延时


##测试
  单元测试使用jasmine-node。在源代码根目录运行`jasmine-node spec`可运行所有测试。