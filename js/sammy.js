// -- Sammy -- /sammy.js
// http://code.quirkey.com/sammy
// Version: 0.6.0
// Built: Wed Sep 01 23:12:46 -0700 2010
(function(g){var m,f="([^/]+)",i=/:([\w\d]+)/g,j=/\?([^#]*)$/,b=function(n){return Array.prototype.slice.call(n)},c=function(n){return Object.prototype.toString.call(n)==="[object Function]"},k=function(n){return Object.prototype.toString.call(n)==="[object Array]"},h=decodeURIComponent,e=function(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},l=function(n){return function(o,p){return this.route.apply(this,[n,o,p])}},a={},d=[];m=function(){var o=b(arguments),p,n;m.apps=m.apps||{};if(o.length===0||o[0]&&c(o[0])){return m.apply(m,["body"].concat(o))}else{if(typeof(n=o.shift())=="string"){p=m.apps[n]||new m.Application();p.element_selector=n;if(o.length>0){g.each(o,function(q,r){p.use(r)})}if(p.element_selector!=n){delete m.apps[n]}m.apps[p.element_selector]=p;return p}}};m.VERSION="0.6.0";m.addLogger=function(n){d.push(n)};m.log=function(){var n=b(arguments);n.unshift("["+Date()+"]");g.each(d,function(p,o){o.apply(m,n)})};if(typeof window.console!="undefined"){if(c(console.log.apply)){m.addLogger(function(){window.console.log.apply(console,arguments)})}else{m.addLogger(function(){window.console.log(arguments)})}}else{if(typeof console!="undefined"){m.addLogger(function(){console.log.apply(console,arguments)})}}g.extend(m,{makeArray:b,isFunction:c,isArray:k});m.Object=function(n){return g.extend(this,n||{})};g.extend(m.Object.prototype,{escapeHTML:e,h:e,toHash:function(){var n={};g.each(this,function(p,o){if(!c(o)){n[p]=o}});return n},toHTML:function(){var n="";g.each(this,function(p,o){if(!c(o)){n+="<strong>"+p+"</strong> "+o+"<br />"}});return n},keys:function(n){var o=[];for(var p in this){if(!c(this[p])||!n){o.push(p)}}return o},has:function(n){return this[n]&&g.trim(this[n].toString())!=""},join:function(){var o=b(arguments);var n=o.shift();return o.join(n)},log:function(){m.log.apply(m,arguments)},toString:function(n){var o=[];g.each(this,function(q,p){if(!c(p)||n){o.push('"'+q+'": '+p.toString())}});return"Sammy.Object: {"+o.join(",")+"}"}});m.HashLocationProxy=function(o,n){this.app=o;this.is_native=false;this._startPolling(n)};m.HashLocationProxy.prototype={bind:function(){var n=this,o=this.app;g(window).bind("hashchange."+this.app.eventNamespace(),function(q,p){if(n.is_native===false&&!p){m.log("native hash change exists, using");n.is_native=true;clearInterval(m.HashLocationProxy._interval)}o.trigger("location-changed")});if(!m.HashLocationProxy._bindings){m.HashLocationProxy._bindings=0}m.HashLocationProxy._bindings++},unbind:function(){g(window).unbind("hashchange."+this.app.eventNamespace());m.HashLocationProxy._bindings--;if(m.HashLocationProxy._bindings<=0){clearInterval(m.HashLocationProxy._interval)}},getLocation:function(){var n=window.location.toString().match(/^[^#]*(#.+)$/);return n?n[1]:""},setLocation:function(n){return(window.location=n)},_startPolling:function(p){var o=this;if(!m.HashLocationProxy._interval){if(!p){p=10}var n=function(){current_location=o.getLocation();if(!m.HashLocationProxy._last_location||current_location!=m.HashLocationProxy._last_location){setTimeout(function(){g(window).trigger("hashchange",[true])},13)}m.HashLocationProxy._last_location=current_location};n();m.HashLocationProxy._interval=setInterval(n,p)}}};m.Application=function(n){var o=this;this.routes={};this.listeners=new m.Object({});this.arounds=[];this.befores=[];this.namespace=(new Date()).getTime()+"-"+parseInt(Math.random()*1000,10);this.context_prototype=function(){m.EventContext.apply(this,arguments)};this.context_prototype.prototype=new m.EventContext();if(c(n)){n.apply(this,[this])}if(!this._location_proxy){this.setLocationProxy(new m.HashLocationProxy(this,this.run_interval_every))}if(this.debug){this.bindToAllEvents(function(q,p){o.log(o.toString(),q.cleaned_type,p||{})})}};m.Application.prototype=g.extend({},m.Object.prototype,{ROUTE_VERBS:["get","post","put","delete"],APP_EVENTS:["run","unload","lookup-route","run-route","route-found","event-context-before","event-context-after","changed","error","check-form-submission","redirect"],_last_route:null,_location_proxy:null,_running:false,element_selector:"body",debug:false,raise_errors:false,run_interval_every:50,template_engine:null,toString:function(){return"Sammy.Application:"+this.element_selector},$element:function(){return g(this.element_selector)},use:function(){var n=b(arguments),p=n.shift(),o=p||"";try{n.unshift(this);if(typeof p=="string"){o="Sammy."+p;p=m[p]}p.apply(this,n)}catch(q){if(typeof p==="undefined"){this.error("Plugin Error: called use() but plugin ("+o.toString()+") is not defined",q)}else{if(!c(p)){this.error("Plugin Error: called use() but '"+o.toString()+"' is not a function",q)}else{this.error("Plugin Error",q)}}}return this},setLocationProxy:function(n){var o=this._location_proxy;this._location_proxy=n;if(this.isRunning()){if(o){o.unbind()}this._location_proxy.bind()}},route:function(q,o,s){var p=this,r=[],n;if(!s&&c(o)){o=q;s=o;q="any"}q=q.toLowerCase();if(o.constructor==String){i.lastIndex=0;while((path_match=i.exec(o))!==null){r.push(path_match[1])}o=new RegExp("^"+o.replace(i,f)+"$")}if(typeof s=="string"){s=p[s]}n=function(t){var u={verb:t,path:o,callback:s,param_names:r};p.routes[t]=p.routes[t]||[];p.routes[t].push(u)};if(q==="any"){g.each(this.ROUTE_VERBS,function(u,t){n(t)})}else{n(q)}return this},get:l("get"),post:l("post"),put:l("put"),del:l("delete"),any:l("any"),mapRoutes:function(o){var n=this;g.each(o,function(p,q){n.route.apply(n,q)});return this},eventNamespace:function(){return["sammy-app",this.namespace].join("-")},bind:function(n,p,r){var q=this;if(typeof r=="undefined"){r=p}var o=function(){var u,s,t;u=arguments[0];t=arguments[1];if(t&&t.context){s=t.context;delete t.context}else{s=new q.context_prototype(q,"bind",u.type,t,u.target)}u.cleaned_type=u.type.replace(q.eventNamespace(),"");r.apply(s,[u,t])};if(!this.listeners[n]){this.listeners[n]=[]}this.listeners[n].push(o);if(this.isRunning()){this._listen(n,o)}return this},trigger:function(n,o){this.$element().trigger([n,this.eventNamespace()].join("."),[o]);return this},refresh:function(){this.last_location=null;this.trigger("location-changed");return this},before:function(n,o){if(c(n)){o=n;n={}}this.befores.push([n,o]);return this},after:function(n){return this.bind("event-context-after",n)},around:function(n){this.arounds.push(n);return this},isRunning:function(){return this._running},helpers:function(n){g.extend(this.context_prototype.prototype,n);return this},helper:function(n,o){this.context_prototype.prototype[n]=o;return this},run:function(n){if(this.isRunning()){return false}var o=this;g.each(this.listeners.toHash(),function(p,q){g.each(q,function(s,r){o._listen(p,r)})});this.trigger("run",{start_url:n});this._running=true;this.last_location=null;if(this.getLocation()==""&&typeof n!="undefined"){this.setLocation(n)}this._checkLocation();this._location_proxy.bind();this.bind("location-changed",function(){o._checkLocation()});this.bind("submit",function(q){var p=o._checkFormSubmission(g(q.target).closest("form"));return(p===false)?q.preventDefault():false});g(window).bind("beforeunload",function(){o.unload()});return this.trigger("changed")},unload:function(){if(!this.isRunning()){return false}var n=this;this.trigger("unload");this._location_proxy.unbind();this.$element().unbind("submit").removeClass(n.eventNamespace());g.each(this.listeners.toHash(),function(o,p){g.each(p,function(r,q){n._unlisten(o,q)})});this._running=false;return this},bindToAllEvents:function(o){var n=this;g.each(this.APP_EVENTS,function(p,q){n.bind(q,o)});g.each(this.listeners.keys(true),function(q,p){if(n.APP_EVENTS.indexOf(p)==-1){n.bind(p,o)}});return this},routablePath:function(n){return n.replace(j,"")},lookupRoute:function(q,o){var p=this,n=false;this.trigger("lookup-route",{verb:q,path:o});if(typeof this.routes[q]!="undefined"){g.each(this.routes[q],function(s,r){if(p.routablePath(o).match(r.path)){n=r;return false}})}return n},runRoute:function(p,B,r,u){var q=this,z=this.lookupRoute(p,B),o,x,s,w,A,y,v,n;this.log("runRoute",[p,B].join(" "));this.trigger("run-route",{verb:p,path:B,params:r});if(typeof r=="undefined"){r={}}g.extend(r,this._parseQueryString(B));if(z){this.trigger("route-found",{route:z});if((path_params=z.path.exec(this.routablePath(B)))!==null){path_params.shift();g.each(path_params,function(C,D){if(z.param_names[C]){r[z.param_names[C]]=h(D)}else{if(!r.splat){r.splat=[]}r.splat.push(h(D))}})}o=new this.context_prototype(this,p,B,r,u);s=this.arounds.slice(0);A=this.befores.slice(0);v=[o].concat(r.splat);x=function(){var C;while(A.length>0){y=A.shift();if(q.contextMatchesOptions(o,y[0])){C=y[1].apply(o,[o]);if(C===false){return false}}}q.last_route=z;o.trigger("event-context-before",{context:o});C=z.callback.apply(o,v);o.trigger("event-context-after",{context:o});return C};g.each(s.reverse(),function(C,D){var E=x;x=function(){return D.apply(o,[E])}});try{n=x()}catch(t){this.error(["500 Error",p,B].join(" "),t)}return n}else{return this.notFound(p,B)}},contextMatchesOptions:function(q,s,o){var p=s;if(typeof p==="undefined"||p=={}){return true}if(typeof o==="undefined"){o=true}if(typeof p==="string"||c(p.test)){p={path:p}}if(p.only){return this.contextMatchesOptions(q,p.only,true)}else{if(p.except){return this.contextMatchesOptions(q,p.except,false)}}var n=true,r=true;if(p.path){if(c(p.path.test)){n=p.path.test(q.path)}else{n=(p.path.toString()===q.path)}}if(p.verb){r=p.verb===q.verb}return o?(r&&n):!(r&&n)},getLocation:function(){return this._location_proxy.getLocation()},setLocation:function(n){return this._location_proxy.setLocation(n)},swap:function(n){return this.$element().html(n)},templateCache:function(n,o){if(typeof o!="undefined"){return a[n]=o}else{return a[n]}},notFound:function(p,o){var n=this.error(["404 Not Found",p,o].join(" "));return(p==="get")?n:true},error:function(o,n){if(!n){n=new Error()}n.message=[o,n.message].join(" ");this.trigger("error",{message:n.message,error:n});if(this.raise_errors){throw (n)}else{this.log(n.message,n)}},_checkLocation:function(){var n,o;n=this.getLocation();if(n!=this.last_location){this.last_location=n;o=this.runRoute("get",n)}return o},_getFormVerb:function(o){var n=g(o),p;$_method=n.find('input[name="_method"]');if($_method.length>0){p=$_method.val()}if(!p){p=n[0].getAttribute("method")}return g.trim(p.toString().toLowerCase())},_checkFormSubmission:function(p){var n,q,s,r,o;this.trigger("check-form-submission",{form:p});n=g(p);q=n.attr("action");s=this._getFormVerb(n);if(!s||s==""){s="get"}this.log("_checkFormSubmission",n,q,s);if(s==="get"){this.setLocation(q+"?"+n.serialize());o=false}else{r=g.extend({},this._parseFormParams(n));o=this.runRoute(s,q,r,p.get(0))}return(typeof o=="undefined")?false:o},_parseFormParams:function(n){var q={},p=n.serializeArray(),o;for(o=0;o<p.length;o++){q=this._parseParamPair(q,p[o].name,p[o].value)}return q},_parseQueryString:function(q){var s={},p,o,r,n;p=q.match(j);if(p){o=p[1].split("&");for(n=0;n<o.length;n++){r=o[n].split("=");s=this._parseParamPair(s,h(r[0]),h(r[1]))}}return s},_parseParamPair:function(p,n,o){if(p[n]){if(k(p[n])){p[n].push(o)}else{p[n]=[p[n],o]}}else{p[n]=o}return p},_listen:function(n,o){return this.$element().bind([n,this.eventNamespace()].join("."),o)},_unlisten:function(n,o){return this.$element().unbind([n,this.eventNamespace()].join("."),o)}});m.RenderContext=function(n){this.event_context=n;this.callbacks=[];this.previous_content=null;this.content=null;this.next_engine=false;this.waiting=false};g.extend(m.RenderContext.prototype,{then:function(o){if(c(o)){var n=this;if(this.waiting){this.callbacks.push(o)}else{this.wait();setTimeout(function(){var p=o.apply(n,[n.content,n.previous_content]);if(p!==false){n.next(p)}},13)}}return this},wait:function(){this.waiting=true},next:function(n){this.waiting=false;if(typeof n!=="undefined"){this.previous_content=this.content;this.content=n}if(this.callbacks.length>0){this.then(this.callbacks.shift())}},load:function(n,o,q){var p=this;return this.then(function(){var r,s;if(c(o)){q=o;o={}}else{o=g.extend({},o)}if(q){this.then(q)}if(typeof n==="string"){r=!(o.cache===false);delete o.cache;if(o.engine){p.next_engine=o.engine;delete o.engine}if(r&&(s=this.event_context.app.templateCache(n))){return s}this.wait();g.ajax(g.extend({url:n,data:{},type:"get",success:function(t){if(r){p.event_context.app.templateCache(n,t)}p.next(t)}},o));return false}else{if(n.nodeType){return n.innerHTML}if(n.selector){p.next_engine=n.attr("data-engine");if(o.clone===false){return n.remove()[0].innerHTML.toString()}else{return n[0].innerHTML.toString()}}}})},render:function(n,o,p){if(c(n)&&!o){return this.then(n)}else{return this.load(n).interpolate(o,n).then(p)}},collect:function(p,o){var n=this;return this.then(function(){var q="";g.each(p,function(r,t){var s=o.apply(n,[r,t]);q+=s;return s});return q})},renderEach:function(n,o,p,q){if(k(o)){q=p;p=o;o=null}if(!p&&k(this.content)){p=this.content}return this.load(n).collect(p,function(r,s){var t={};o?(t[o]=s):(t=s);return this.event_context.interpolate(this.content,t,n)})},interpolate:function(q,p,n){var o=this;return this.then(function(s,r){if(this.next_engine){p=this.next_engine;this.next_engine=false}var t=o.event_context.interpolate(s,q,p);return n?r+t:t})},swap:function(){return this.then(function(n){this.event_context.swap(n)}).trigger("changed",{})},appendTo:function(n){return this.then(function(o){g(n).append(o)}).trigger("changed",{})},prependTo:function(n){return this.then(function(o){g(n).prepend(o)}).trigger("changed",{})},replace:function(n){return this.then(function(o){g(n).html(o)}).trigger("changed",{})},trigger:function(n,o){return this.then(function(p){if(typeof o=="undefined"){o={content:p}}this.event_context.trigger(n,o)})}});m.EventContext=function(r,q,o,p,n){this.app=r;this.verb=q;this.path=o;this.params=new m.Object(p);this.target=n};m.EventContext.prototype=g.extend({},m.Object.prototype,{$element:function(){return this.app.$element()},engineFor:function(p){var o=this,n;if(c(p)){return p}p=p.toString();if((n=p.match(/\.([^\.]+)$/))){p=n[1]}if(p&&c(o[p])){return o[p]}if(o.app.template_engine){return this.engineFor(o.app.template_engine)}return function(q,r){return q}},interpolate:function(o,p,n){return this.engineFor(n).apply(this,[o,p])},render:function(n,o,p){return new m.RenderContext(this).render(n,o,p)},load:function(n,o,p){return new m.RenderContext(this).load(n,o,p)},partial:function(n,o){return this.render(n,o).swap()},redirect:function(){var p,o=b(arguments),n=this.app.getLocation();if(o.length>1){o.unshift("/");p=this.join.apply(this,o)}else{p=o[0]}this.trigger("redirect",{to:p});this.app.last_location=this.path;this.app.setLocation(p);if(n==p){this.app.trigger("location-changed")}},trigger:function(n,o){if(typeof o=="undefined"){o={}}if(!o.context){o.context=this}return this.app.trigger(n,o)},eventNamespace:function(){return this.app.eventNamespace()},swap:function(n){return this.app.swap(n)},notFound:function(){return this.app.notFound(this.verb,this.path)},toString:function(){return"Sammy.EventContext: "+[this.verb,this.path,this.params].join(" ")}});g.sammy=window.Sammy=m})(jQuery);