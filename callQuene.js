function callQuene(options){
    if (!options) options = {};
    
    //current state: idle or busy
    this.state = 'idle';
    //calls to wait for run
    this.calls=[];
    //running calls count
    this.runningCount = 0;
    //parallel run numbers of per turn
    this.parallelNumber = options.parallelNumber || 1;
    //next turn delay
    this.delay = options.delay || 0;    
    
    this.__defineGetter__("count",function(){return this.calls.length;});
    
    this.run = function(){
        if (this.calls.length === 0) {
            this.state = 'idle';
            return;
        }
        
        var c = this.parallelNumber;
        var n = 0;
        while (this.runningCount < this.parallelNumber) {
            var call = this.calls.shift();
            if (!call) {
                return;
            }
            this.runningCount++;
            var self = this;
            //make a callback wrapper
            (function() {
                var cb;
                if (call.args.length > call.fn.length){
                    call.args = call.args.slice(0,call.fn.length);
                }
            
                if (call.fn.length === call.args.length) {
                    var ocb = call.args[call.args.length-1];
                    var caller = call.caller;
                    cb = function(){
                        self.runningCount--;
                        if (self.calls.length > 0) {
                           if (self.delay !== 0)
                             setTimeout(function() {self.run();},self.delay);
                           else 
                             process.nextTick(function() {self.run();});
                        }
                        ocb.apply(caller,arguments);
                    };
                } else {
                    cb = function() {
                        self.runningCount--;
                        if (self.calls.length > 0) {
                           if (self.delay !== 0)
                              setTimeout(function() {self.run();},self.delay);
                           else 
                             process.nextTick(function() {self.run();});
                        }
                    };
                    for(var i = call.args.length;i<call.fn.length-1;i++) {
                        call.args[i] = undefined;
                    }
                }
        
                call.args[call.fn.length-1] = cb;
            })();     
            call.fn.apply(call.caller,call.args);
        }
    };
    
    this.start = function(){
        var self = this;
        this.state = 'busy';
        process.nextTick(function(){
            self.run();
        });
    };
    
    this.add = function(caller,fn,args){
        if (!caller || !fn || !args) throw "Add call error: has not enough parameters!"
        var call = {
            "caller" : caller,
            "fn" : fn,
            "args" : args
        };
        this.calls.push(call);

        if (this.state==='idle'){
           this.start();
        }
    };
    
    this.applyTo = function(obj,fns){
        var self =this;
        fns.forEach(function(v){
            if (obj[v]) {
                obj[v+'_cq_old'] = obj[v];
                obj[v] = function(){
                    self.add(obj,obj[v+'_cq_old'],[].slice.apply(arguments));
                };
            }
        });
    };
}

module.exports = {'CallQuene':callQuene};