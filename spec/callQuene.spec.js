describe('Call Quene',function(){
    var CallQuene = require('../callQuene').CallQuene;
    var cq = null;
    
    beforeEach(function(){
        cq = new CallQuene();
    });
    
    it('should save and recall asynchronous functions',function(){
        function asyncAdd(a,b,cb){
            setTimeout(cb,200,a+b);
        }
        
        var sum = 0;
        
        function cb(v){
            sum  += v;
        }
        
        expect(cq.count).toEqual(0);
        
        cq.add(this,asyncAdd,[1,2,cb]);
        cq.add(this,asyncAdd,[2,3]);
        cq.add(this,asyncAdd,[2,3,cb]);
        cq.add(this,asyncAdd,[3,4,cb]);

        
        expect(cq.count).toEqual(4);
        waits(250);
        runs(function(){
            expect(sum).toEqual(3);
        });
        waits(250);
        runs(function(){
            expect(sum).toEqual(3);
        });
        waits(250);
        runs(function(){
            expect(sum).toEqual(8);
        });
        waits(250);
        runs(function(){
            expect(sum).toEqual(15);
            expect(cq.count).toEqual(0);
        });

    });
    
    it('should apply quene to a exists object',function(){
        var obj = {
            val : 15,
            add1 : function(a,b,cb){
                setTimeout(cb,50,a+b);
            },
            add2 : function(a,b,cb){
                setTimeout(cb,150,a+b);
            },
            add3 : function(a,b,cb){
                this.val += a+b;
                setTimeout(cb,250,this.val+a+b);
            }
        };
        
        var sum = 0;
        
        function cb(v){
            sum = v;
        }
        cq.applyTo(obj,["add1","add2","add3"]);
        obj.add3(1,2,cb);
        obj.add1(10,20,cb);
        obj.add2(100,200,cb);
        obj.add1(10,20,cb);
        obj.add3(1,2,cb);
        waitsFor(function(){return sum !== 0;});
        runs(function(){
            expect(sum).toEqual(21);
            sum = 0;
        });
        waitsFor(function(){return sum !== 0;});
        runs(function(){
            expect(sum).toEqual(30);
            sum = 0;
        });
        waitsFor(function(){return sum !== 0;});
        runs(function(){
            expect(sum).toEqual(300);
            sum = 0;
        });
        waitsFor(function(){return sum !== 0;});
        runs(function(){
            expect(sum).toEqual(30);
            sum = 0;
        });
        waitsFor(function(){return sum !== 0;});
        runs(function(){
            expect(sum).toEqual(24);
            sum = 0;
        });
    });
    
    it('running count should not greate than parallelNums',function(){
        cq.parallelNumber = 3;
        function asyncAdd(a,b,timeout,cb){
            setTimeout(cb,timeout,a+b);
        }
        var sum = 0;
        function cb(v){
            sum += v;
        }
        
        for (var i=0;i<20;i++) {
            var t = 50+(50*(i%2));
            cq.add(this,asyncAdd,[t,t,t,cb]);
        }
        waits(60);
        runs(function(){
            expect(cq.runningCount).toEqual(3);
            expect(sum).toEqual(200);
            expect(cq.count).toEqual(15);
        });
        waits(60);
        runs(function(){
            expect(cq.runningCount).toEqual(3);
            expect(sum).toEqual(500);
            expect(cq.count).toEqual(13);
        });
        
    });
    
    it('should batch run calls',function(){
        var sum = 0;
        var c = 0;
        function cb(v){ sum+=v;  c++;}
        var obj = {
            sum: function(i,cb){
                setTimeout(cb,50,i);
            }
        };
        
        cq.parallelNumber = 100;
        cq.applyTo(obj,["sum"]);
        for (var i=0; i< 350; i++){
            obj.sum(i,cb);
        }
        expect(cq.count).toEqual(350);
        var stime = new Date();
        waitsFor(function(){return sum ===4950;});
        runs(function(){
            var etime = new Date();
            expect(cq.count).toEqual(250);
            expect(etime-stime).toBeLessThan(80);
        });
        waitsFor(function(){return sum ===61075;});
        runs(function(){
            var etime = new Date();
            expect(etime-stime).toBeGreaterThan(150);
            expect(etime-stime).toBeLessThan(250);
            expect(cq.count).toEqual(0);
        });
        
    });
    
});