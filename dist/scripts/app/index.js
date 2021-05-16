var{io:e}=require("socket.io-client"),t=require("@mapbox/mapbox-gl-directions"),n=require("mapbox-gl"),r=require("@babel/runtime/helpers/toArray"),a=require("@babel/runtime/helpers/defineProperty"),i=require("@babel/runtime/helpers/slicedToArray"),o=require("@babel/runtime/helpers/getPrototypeOf"),s=require("@babel/runtime/helpers/possibleConstructorReturn"),u=require("@babel/runtime/helpers/inherits"),c=require("dayjs/plugin/relativeTime"),l=require("dayjs/plugin/duration"),d=require("dayjs"),p=require("@babel/runtime/helpers/asyncToGenerator"),f=require("@babel/runtime/helpers/createClass"),h=require("@babel/runtime/helpers/classCallCheck"),m=require("@babel/runtime/helpers/toConsumableArray"),v=require("@babel/runtime/regenerator"),y=require("@babel/runtime/helpers/interopRequireDefault"),g=y,b={},k=y;Object.defineProperty(b,"__esModule",{value:!0});var x=function(){return de.apply(this,arguments)};b.default=x;var w=k(v),S=k(m),M=k(h),T=k(f),L=k(p),O=k(d),q=k(l),E=k(c),P={},A=y;Object.defineProperty(P,"__esModule",{value:!0});var C=(ne=void 0,re=P.default=ne,P.AuthApi=re);P.StatsApi=C;var j,_=A(v),R=A(u),D=A(s),I=A(o),N=A(p),B=A(h),G=A(f),z=A(j={DOMAIN_URL:"https://carstats-backend.herokuapp.com",MAPBOXGL:{ACCESS_TOKEN:"pk.eyJ1IjoibWF0aGlldWRhaXgiLCJhIjoiY2tiOWI5ODgzMGNmYTJ6cGlnOTh5bjI5ZCJ9.061wCTnhLhD99yEEmz5Osw",STYLE:"mapbox://styles/mathieudaix/ckkie2bdw0saz17pbidyjsgb4?optimize=true"}}),F={},U=y;Object.defineProperty(F,"__esModule",{value:!0});var $=void 0;F.default=$;var H=U(i),J=U(a),Y=U(r),X=U(h),W=U(f);$=function(){function e(){(0,X.default)(this,e)}return(0,W.default)(e,[{key:"get",value:function(e,t){if("undefined"!=typeof document)t=document.cookie;else if(void 0===t)return!1;var n=t.split(";").map((function(e){var t=e.split("="),n=(0,Y.default)(t),r=n[0],a=n.slice(1);return(0,J.default)({},r.trim(),decodeURIComponent(a.join("=")))}));return n[e]||n[0][e]}},{key:"set",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};n.days&&(n["max-age"]=60*n.days*60*24,delete n.days),n=Object.entries(n).reduce((function(e,t){var n=(0,H.default)(t,2),r=n[0],a=n[1];return"".concat(e,"; ").concat(r,"=").concat(a)}),""),document.cookie="".concat(e,"=").concat(encodeURIComponent(t)+n)}},{key:"delete",value:function(e){document.cookie="".concat(e,"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;")}}]),e}(),F.default=$;var K=A(F),Z={};Object.defineProperty(Z,"__esModule",{value:!0});var Q=function(e,t,n){t.classList.add("active"),t.classList.add("msg-".concat(e)),t.innerText=n};Z.default=Q;var V=A(Z);function ee(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,I.default)(e);if(t){var a=(0,I.default)(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return(0,D.default)(this,n)}}var te=function(){function e(){(0,B.default)(this,e)}var t;return(0,G.default)(e,[{key:"request",value:(t=(0,N.default)(_.default.mark((function e(t){var n,r,a,i,o,s,u,c,l,d;return _.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.method,r=void 0===n?"GET":n,a=t.route,i=t.body,o=t.headersOverride,s=t.reqAdditional,u=new Headers(Object.assign({"Content-Type":"application/json"},o)),c=Object.assign({body:JSON.stringify(i)},s),l=Object.assign({method:r,headers:u,redirect:"follow"},c),e.next=6,fetch(z.default.DOMAIN_URL+a,l);case 6:return d=e.sent,e.next=9,d.json();case 9:return e.abrupt("return",e.sent);case 10:case"end":return e.stop()}}),e)}))),function(e){return t.apply(this,arguments)})}]),e}(),ne=te;P.default=ne;var re=function(e){(0,R.default)(o,e);var t,n,r,a,i=ee(o);function o(){var e;return(0,B.default)(this,o),(e=i.call(this)).msg=document.querySelector(".msg"),e}return(0,G.default)(o,[{key:"authenticate",value:(a=(0,N.default)(_.default.mark((function e(t){var n,r;return _.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.request({method:"POST",route:"/auth/local",body:t});case 2:n=e.sent,(r=n.jwt)?((new K.default).set("jwt",r,{path:"/",days:30}),window.location.href="/app"):(0,V.default)("error",this.msg,"Invalid email adress or password.");case 5:case"end":return e.stop()}}),e,this)}))),function(e){return a.apply(this,arguments)})},{key:"register",value:(r=(0,N.default)(_.default.mark((function e(t){var n;return _.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.request({method:"POST",route:"/users",body:t});case 2:(n=e.sent).error?(0,V.default)("error",this.msg,n.message[0].messages[0].message):((0,V.default)("success",this.msg,"Your account has been created. You will be automatically redirected."),setTimeout((function(){return window.location.href="/auth/sign-in"}),3e3));case 4:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)})},{key:"forgotPassword",value:(n=(0,N.default)(_.default.mark((function e(t){var n;return _.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.request({method:"POST",route:"/auth/forgot-password",body:t});case 2:(n=e.sent).error&&(0,V.default)("error",this.msg,n.message[0].messages[0].message);case 4:case"end":return e.stop()}}),e,this)}))),function(e){return n.apply(this,arguments)})},{key:"resetPassword",value:(t=(0,N.default)(_.default.mark((function e(t){var n;return _.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.request({method:"POST",route:"/auth/reset-password",body:t});case 2:(n=e.sent).error?(0,V.default)("error",this.msg,n.message[0].messages[0].message):((0,V.default)("success","You will receive an email in a few minutes."),setTimeout((function(){return window.location.href="/auth/sign-in"}),3e3));case 4:case"end":return e.stop()}}),e,this)}))),function(e){return t.apply(this,arguments)})},{key:"disconnect",value:function(){(new K.default).delete("jwt"),window.location.reload()}}]),o}(te);P.AuthApi=re,C=function(e){(0,R.default)(i,e);var t,n,r,a=ee(i);function i(){var e;return(0,B.default)(this,i),(e=a.call(this)).cookies=new K.default,e.jwt=e.cookies.get("jwt"),e.authorization={Authorization:"Bearer ".concat(e.jwt)},e}return(0,G.default)(i,[{key:"renderLatestRoutes",value:(r=(0,N.default)(_.default.mark((function e(){return _.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.request({route:"/travels/me",headersOverride:this.authorization});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)}))),function(){return r.apply(this,arguments)})},{key:"renderGlobalStats",value:(n=(0,N.default)(_.default.mark((function e(){return _.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.request({route:"/users-global-stats/me",headersOverride:this.authorization});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)}))),function(){return n.apply(this,arguments)})},{key:"leaderboard",value:(t=(0,N.default)(_.default.mark((function e(){return _.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.request({route:"/users-global-stats/leaderboard",headersOverride:this.authorization});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})}]),i}(te),P.StatsApi=C;var ae=k(j),ie={},oe=y;Object.defineProperty(ie,"__esModule",{value:!0});var se=void 0;ie.default=se;var ue=oe(h),ce=oe(f);se=function(){function e(){(0,ue.default)(this,e)}return(0,ce.default)(e,[{key:"degreesToRadians",value:function(e){return e*Math.PI/180}},{key:"distance",value:function(e,t,n,r){var a=this.degreesToRadians(n-e),i=this.degreesToRadians(r-t);e=this.degreesToRadians(e),n=this.degreesToRadians(n);var o=Math.sin(a/2)*Math.sin(a/2)+Math.sin(i/2)*Math.sin(i/2)*Math.cos(e)*Math.cos(n);return 6371*(2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o)))}}]),e}(),ie.default=se;var le=k(ie);function de(){return(de=(0,L.default)(w.default.mark((function e(){var t;return w.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=new pe,e.next=3,t.fetchRoutes();case 3:return e.next=5,t.fetchGlobalStats();case 5:t.displayRoutes(),t.displayGlobalStats();case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var pe=function(){function e(){(0,M.default)(this,e),this.statsApi=new P.StatsApi,this.routes=[],this.globalStats=[],this.drivingStats=document.querySelector(".driving-stats")}var t,n,r;return(0,T.default)(e,[{key:"fetchRoutes",value:(r=(0,L.default)(w.default.mark((function e(){return w.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.statsApi.renderLatestRoutes();case 2:this.routes=e.sent;case 3:case"end":return e.stop()}}),e,this)}))),function(){return r.apply(this,arguments)})},{key:"fetchGlobalStats",value:(n=(0,L.default)(w.default.mark((function e(){return w.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.statsApi.renderGlobalStats();case 2:this.globalStats=e.sent;case 3:case"end":return e.stop()}}),e,this)}))),function(){return n.apply(this,arguments)})},{key:"displayGlobalStats",value:function(){var e=document.querySelector(".stats-kilometers"),t=document.querySelector(".stats-speed");this.globalStats&&(e.textContent="".concat(this.globalStats[0].totalDistance.toLocaleString()," km"),t.textContent="".concat((3.6*this.globalStats[0].vMax).toFixed(0)," km/h"))}},{key:"displayRoutes",value:function(){var e=this;0===this.routes.length?this.noTravelFound():this.routes.forEach(function(){var t=(0,L.default)(w.default.mark((function t(n){var r,a,i,o,s,u,c,l,d,p,f,h,m,v,y,g,b,k,x,M,T,L,P,A,C;return w.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return i=document.createElement("div"),(o=document.createElement("p")).className="travel-date",s=new Date(n[0].t).toLocaleDateString(),o.textContent=s,t.next=7,e.reverseGeocoder(n[0].y,n[0].x);case 7:return u=t.sent,c=(null===(r=u.features[0])||void 0===r?void 0:r.text)||"Nowhere",t.next=11,e.reverseGeocoder(n[n.length-1].y,n[n.length-1].x);case 11:for(l=t.sent,d=(null===(a=l.features[0])||void 0===a?void 0:a.text)||"Nowhere",(p=document.createElement("p")).className="travel-name",p.textContent=c===d?"At ".concat(c):"From ".concat(c," to ").concat(d),f=document.createElement("div"),h=n.map((function(e){return e.v})),m=Math.round(3.6*Math.max.apply(Math,(0,S.default)(h))),v=document.createElement("div"),e.createTravelElement(v,"".concat(m," km"),"Max speed"),y=Math.round(h.reduce((function(e,t){return e+t}))/h.length*3.6),g=document.createElement("div"),e.createTravelElement(g,"".concat(y," km"),"Avg speed"),b=new le.default,k=[],x=0;x<n.length-1;x++)k.push(b.distance(n[x].x,n[x].y,n[x+1].x,n[x+1].y));M=k.reduce((function(e,t){return e+t})),T=document.createElement("div"),e.createTravelElement(T,"".concat(M<1?M.toFixed(2):Math.round(M)," km"),"Distance"),L=(0,O.default)(n[0].t),P=(0,O.default)(n[n.length-1].t),O.default.extend(q.default),O.default.extend(E.default),A=O.default.duration(P.diff(L)).humanize(),C=document.createElement("div"),e.createTravelElement(C,A,"Duration"),e.drivingStats.append(i),i.append(o,p,f),f.append(v,g,T,C);case 40:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}},{key:"createTravelElement",value:function(e,t,n){var r=e,a=document.createElement("div"),i=document.createElement("p"),o=document.createElement("span");i.textContent=t,o.textContent=n,r.append(a,i,o)}},{key:"noTravelFound",value:function(){var e=document.createElement("p");e.textContent="No travel found.",this.drivingStats.append(e)}},{key:"reverseGeocoder",value:(t=(0,L.default)(w.default.mark((function e(t,n){var r;return w.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(t,",").concat(n,".json?access_token=").concat(ae.default.MAPBOXGL.ACCESS_TOKEN,"&types=place"));case 2:return r=e.sent,e.next=5,r.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)}))),function(e,n){return t.apply(this,arguments)})}]),e}(),fe=g(b),he={},me=y;Object.defineProperty(he,"__esModule",{value:!0});var ve=function(){new be.default,(new Qe.default).start(),console.log("test02")};he.default=ve;var ye={};Object.defineProperty(ye,"__esModule",{value:!0});var ge=function(){var e=console.error;function t(e){var t=document.createElement("div"),n=document.createTextNode(e);return t.innerHTML="",t.appendChild(n),t}console.error=function(){e.apply(console,arguments);for(var n=Array.prototype.slice.call(arguments),r=0;r<n.length;r++){var a=t(n[r]);document.querySelector("#mylog").appendChild(a)}},window.onerror=function(e,t,n){console.error("JavaScript error: "+e+" on line "+n+" for "+t)}};ye.default=ge;var be=me(ye),ke={},xe=y;Object.defineProperty(ke,"__esModule",{value:!0});var we=void 0;ke.default=we;var Se=xe(i),Me=xe(h),Te=xe(f),Le=xe(n),Oe=xe(t),qe=xe(j),Ee=xe(ie),Pe={};Object.defineProperty(Pe,"__esModule",{value:!0});var Ae=void 0;Pe.default=Ae;Ae=[{id:"directions-route-line-alt",type:"line",source:"directions",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#bbb","line-width":4},filter:["all",["in","$type","LineString"],["in","route","alternate"]]},{id:"directions-route-line-casing",type:"line",source:"directions",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#2d5f99","line-width":12},filter:["all",["in","$type","LineString"],["in","route","selected"]]},{id:"directions-route-line",type:"line",source:"directions",layout:{"line-cap":"butt","line-join":"round"},paint:{"line-color":{property:"congestion",type:"categorical",default:"#4882c5",stops:[["unknown","#4882c5"],["low","#4882c5"],["moderate","#f09a46"],["heavy","#e34341"],["severe","#8b2342"]]},"line-width":7},filter:["all",["in","$type","LineString"],["in","route","selected"]]},{id:"directions-hover-point-casing",type:"circle",source:"directions",paint:{"circle-radius":8,"circle-color":"#fff"},filter:["all",["in","$type","Point"],["in","id","hover"]]},{id:"directions-hover-point",type:"circle",source:"directions",paint:{"circle-radius":6,"circle-color":"#3bb2d0"},filter:["all",["in","$type","Point"],["in","id","hover"]]},{id:"directions-waypoint-point-casing",type:"circle",source:"directions",paint:{"circle-radius":8,"circle-color":"#fff"},filter:["all",["in","$type","Point"],["in","id","waypoint"]]},{id:"directions-waypoint-point",type:"circle",source:"directions",paint:{"circle-radius":6,"circle-color":"#8a8bc9"},filter:["all",["in","$type","Point"],["in","id","waypoint"]]},{id:"directions-origin-point",type:"circle",source:"directions",paint:{"circle-radius":0,"circle-color":"#3bb2d0"},filter:["all",["in","$type","Point"],["in","marker-symbol","A"]]},{id:"directions-origin-label",type:"symbol",source:"directions",layout:{"text-field":"","text-font":["Open Sans Bold","Arial Unicode MS Bold"],"text-size":0},paint:{"text-color":"#fff"},filter:["all",["in","$type","Point"],["in","marker-symbol","A"]]},{id:"directions-destination-point",type:"circle",source:"directions",paint:{"circle-radius":14,"circle-color":"#4882c5"},filter:["all",["in","$type","Point"],["in","marker-symbol","B"]]},{id:"directions-destination-label",type:"symbol",source:"directions",layout:{"text-field":"","text-font":["Open Sans Bold","Arial Unicode MS Bold"],"text-size":0},paint:{"text-color":"#fff"},filter:["all",["in","$type","Point"],["in","marker-symbol","B"]]}],Pe.default=Ae;var Ce=xe(Pe),je={},_e=y;Object.defineProperty(je,"__esModule",{value:!0});var Re=void 0;je.default=Re;var De=_e(v),Ie=_e(p),Ne=_e(h),Be=_e(f);Re=function(){function e(){(0,Ne.default)(this,e),this.legalSpeed=document.querySelector(".legal-speed"),this.legalSpeedItem=document.createElement("div"),this.coords={latitude:0,longitude:0}}var t;return(0,Be.default)(e,[{key:"createComponent",value:function(e){var t=this,n=e.latitude,r=e.longitude;this.legalSpeedItem.id="legalSpeed",this.legalSpeed.append(this.legalSpeedItem),this.coords={latitude:n,longitude:r},setInterval(this.getCurrentSpeedLimit.bind(this),3e4),setTimeout((function(){return t.legalSpeed.classList.add("active")}),32e3)}},{key:"updateSpeedLimit",value:function(e){var t=e.latitude,n=e.longitude;this.coords={latitude:t,longitude:n}}},{key:"getCurrentSpeedLimit",value:(t=(0,Ie.default)(De.default.mark((function e(){var t,n,r,a;return De.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/app/map/maxspeed",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({latitude:this.coords.latitude,longitude:this.coords.longitude})});case 2:return t=e.sent,e.next=5,t.json();case 5:n=e.sent,r=n.response.route[0].leg[0].link[0].speedLimit,a=Math.round(3.6*r),this.legalSpeedItem.textContent=a;case 9:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})}]),e}(),je.default=Re;var Ge=xe(je),ze={},Fe=y;Object.defineProperty(ze,"__esModule",{value:!0});var Ue=void 0;ze.default=Ue;var $e=Fe(v),He=Fe(m),Je=Fe(i),Ye=Fe(p),Xe=Fe(h),We=Fe(f),Ke=Fe(n);Ue=function(){function e(t){(0,Xe.default)(this,e),this.map=t}return(0,We.default)(e,[{key:"start",value:function(){this.wazeExtractor=new Ze(this.map),this.wazeExtractor.start()}}]),e}(),ze.default=Ue;var Ze=function(){function e(t){(0,Xe.default)(this,e),this.map=t,this.isReady=!0,this.domAlerts={}}return(0,We.default)(e,[{key:"cooldown",value:function(){var e=this;this.isReady=!1,setTimeout((function(){return e.isReady=!0}),3e4)}},{key:"start",value:function(){var e=this;this.map.on("moveend",(0,Ye.default)($e.default.mark((function t(){var n,r,a,i,o,s,u,c,l,d,p,f;return $e.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e.isReady){t.next=14;break}return e.cooldown(),n=e.map.getBounds().toArray(),r=(0,Je.default)(n,2),a=(0,Je.default)(r[0],2),i=a[0],o=a[1],s=(0,Je.default)(r[1],2),u=s[0],c=s[1],l="https://carstats-cors-proxy.herokuapp.com/www.waze.com/row-rtserver/web/TGeoRSS?bottom=".concat(o,"&left=").concat(i,"&ma=200&mj=100&mu=20&right=").concat(u,"&top=").concat(c,"4&types=alerts"),t.next=6,fetch(l);case 6:return d=t.sent,t.next=9,d.json();case 9:p=t.sent,(0,He.default)(document.querySelectorAll(".marker[id^=alert]")),e.deleteOldMarkers(),f=Object.keys(e.domAlerts),p.alerts.forEach((function(t){var n=t.nThumbsUp,r=void 0===n?0:n,a=t.type,i=t.location,o=t.id,s={nThumbsUp:r,type:a,lat:i.y,lng:i.x,id:o};f.includes(o)?e.updateMarker(s):e.createMarker(s)}));case 14:case"end":return t.stop()}}),t)}))))}},{key:"createMarker",value:function(e){var t=e.nThumbsUp,n=e.type,r=e.lat,a=e.lng,i=e.id,o=document.createElement("div");o.className="marker",o.id=i,o.dataset.type=n,o.dataset.thumbs=t;var s=new Ke.default.Marker(o).setLngLat([a,r]).addTo(this.map);this.domAlerts[i]=s}},{key:"updateMarker",value:function(e){var t=e.id,n=e.lat,r=e.lng;this.domAlerts[t].setLngLat([r,n])}},{key:"deleteOldMarkers",value:function(){var e=this;Object.values(this.domAlerts).forEach((function(t){e.map.getBounds().contains(t.getLngLat())||t.remove()}))}}]),e}();xe(ze);we=function(){function t(){(0,Me.default)(this,t),Le.default.accessToken=qe.default.MAPBOXGL.ACCESS_TOKEN,this.geolocate=new Le.default.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0}),this.gps={},this.gpsOptions={},this.map=null,this.mapDirections=null,this.socket=e(),this.deviceMarkers=[],this.travel=[],this.traveledDistance=0,this.lastPosition={latitude:NaN,longitude:NaN},this.speedLimit=new Ge.default}return(0,Te.default)(t,[{key:"start",value:function(){"geolocation"in navigator?(navigator.geolocation.getCurrentPosition(this.gpsInitialization.bind(this),this.error,this.gpsOptions),navigator.geolocation.watchPosition(this.gpsHandler.bind(this),this.error,this.gpsOptions)):this.error("Geolocation is not supported by this browser.")}},{key:"gpsInitialization",value:function(e){this.gps=e,this.createMap(),this.speedLimit.createComponent(this.gps.coords),this.geolocateFromNav()}},{key:"gpsHandler",value:function(e){this.gps=e,this.travelWatcher(),this.socketHandler(),this.speedLimit.updateSpeedLimit(this.gps.coords),this.map.rotateTo(this.gps.coords.heading,{duration:1e3,animate:!0,essential:!0}),this.mapDirections.setOrigin([this.gps.coords.longitude,this.gps.coords.latitude])}},{key:"createMap",value:function(){this.map=new Le.default.Map({container:"map",style:qe.default.MAPBOXGL.STYLE,center:[this.gps.coords.longitude,this.gps.coords.latitude],zoom:19}),this.addGeolocateControl(),this.addMapDirections(),this.removeMapDirectionsInstruction()}},{key:"addGeolocateControl",value:function(){var e=this;this.map.addControl(this.geolocate),this.map.on("load",(function(){setTimeout((function(){e.geolocate.trigger()}),500)}))}},{key:"addMapDirections",value:function(){var e=this;this.mapDirections=new Oe.default({accessToken:qe.default.MAPBOXGL.ACCESS_TOKEN,styles:Ce.default,unit:"metric",language:"en",routePadding:{top:420,bottom:240,left:120,right:120},interactive:!1,alternatives:!1,controls:{profileSwitcher:!1,instructions:!1}}).setOrigin([this.gps.coords.longitude,this.gps.coords.latitude]).on("route",(function(t){t.route.length&&(e.travelInfo(t),document.querySelector(".map-recap").classList.add("active"),document.querySelector("#mapbox-directions-destination-input .mapboxgl-ctrl-geocoder input").style.borderRadius="6px 6px 0 0",document.querySelector(".map-recap .btn").addEventListener("click",(function(){e.map.flyTo({center:[e.gps.coords.longitude,e.gps.coords.latitude],zoom:19}),document.querySelector(".map-recap").classList.remove("active"),document.querySelector("#mapbox-directions-destination-input .mapboxgl-ctrl-geocoder input").style.borderRadius="6px",e.mapDirectionsTotal(t),document.querySelector(".map").classList.add("active"),document.getElementById("map").classList.add("isTraveling")})))})).on("error",(function(){document.querySelector(".map").classList.remove("active"),clearInterval(null)})),this.map.addControl(this.mapDirections,"top-left")}},{key:"mapDirectionsTotal",value:function(e){var t=document.querySelector(".map-step-icon"),n=document.querySelector(".map-step-distance"),r=document.querySelector(".map-step-time");if(0!==e.route.length){t.classList.add("icon-".concat(e.route[0].legs[0].steps[0].maneuver.modifier));var a=e.route[0].legs[0].steps[0].distance;n.innerText=a<"1000"?"".concat(a.toFixed(0)," m"):"".concat((a/1e3).toFixed(1)," km"),r.innerText="(".concat(this.convertSecondsToDuration(e.route[0].legs[0].steps[0].duration),")"),document.querySelector(".map-step").classList.add(e.route[0].legs[0].steps[0].maneuver.type),document.querySelector(".map-step-instruction").innerText=e.route[0].legs[0].steps[0].maneuver.instruction}}},{key:"travelInfo",value:function(e){var t=e.route[0],n=document.querySelector(".map-recap-duration"),r=document.querySelector(".map-recap-distance"),a=document.querySelector(".map-recap-time"),i=document.querySelector(".map-recap-from span"),o=document.querySelector(".map-recap-to span");n.innerText=this.convertSecondsToDuration(t.duration),t.distance<"1000"?r.innerText="(".concat(t.distance.toFixed(0)," m)"):r.innerText="(".concat((t.distance/1e3).toFixed(1)," km)");var s=new Date;s.setSeconds(s.getSeconds()+t.duration),a.innerText=new Intl.DateTimeFormat("fr-FR",{hour:"numeric",minute:"numeric"}).format(s),i.innerText=t.legs[0].steps.shift().name||"Nowhere",o.innerText=t.legs[0].steps.pop().name||"Nowhere"}},{key:"geolocateFromNav",value:function(){var e=this;document.querySelector("#main-menu li:first-of-type").addEventListener("click",(function(){e.geolocate.trigger()}))}},{key:"removeMapDirectionsInstruction",value:function(){var e=this;document.querySelectorAll(".geocoder-icon-close").forEach((function(t){t.addEventListener("click",(function(){e.geolocate.trigger(),document.querySelector(".map").classList.remove("active"),document.querySelector(".map-recap").classList.remove("active"),document.getElementById("map").classList.remove("isTraveling")}))})),document.querySelector(".mapbox-directions-destination input").addEventListener("input",this.directionsInputHandler.bind(this))}},{key:"directionsInputHandler",value:function(e){var t=document.querySelectorAll(".geocoder-icon-close"),n=document.querySelector(".mapbox-directions-origin input");0===e.target.value.length&&t.forEach((function(e){return e.click()})),0===n.value.length&&(n.value="".concat(this.gps.coords.longitude,", ").concat(this.gps.coords.latitude),this.mapDirections.setOrigin([this.gps.coords.longitude,this.gps.coords.latitude]))}},{key:"convertSecondsToDuration",value:function(e){var t=~~(e/3600),n=~~(e%3600/60),r="";return t>0&&(r+="".concat(t," h ").concat(n<10?"0":"")),r+="".concat(n," min")}},{key:"travelWatcher",value:function(){var e,t=(null===(e=this.gps.coords)||void 0===e?void 0:e.speed)||0,n=this.gps.coords,r=n.latitude,a=n.longitude;this.travel.push({v:t,x:r,y:a,t:(new Date).toISOString()}),document.getElementById("speedometer-value").textContent=parseInt(3.6*t),(new Ee.default).distance(51.5,0,38.8,-77.1)}},{key:"socketHandler",value:function(){this.onSendPosition(),this.onReceivePosition()}},{key:"onSendPosition",value:function(){var e=this.gps.coords,t=e.latitude,n=e.longitude;this.socket.emit("sendPosition",[t,n]),this.lastPosition.latitude=t,this.lastPosition.longitude=n}},{key:"onReceivePosition",value:function(){var e=this;this.socket.on("usersPosition",(function(t){delete t[JSON.parse(atob(document.cookie.split("jwt=")[1].split(".")[1].replace("-","+").replace("_","/"))).id];var n=e.deviceMarkers.map((function(e){return e._element.id})).filter((function(e){return null!=e}));Object.entries(t).forEach((function(t){var r=(0,Se.default)(t,2),a=r[0],i=(0,Se.default)(r[1],2),o=i[0],s=i[1];n.includes("marker".concat(a))?e.updateMarker(a,{lat:o,lon:s}):e.createMarker(a,{lat:o,lon:s})})),e.socket.on("deleteMarker",(function(t){e.deviceMarkers.forEach((function(e){e._element.id==="marker".concat(t)&&e.remove()}));var n=e.deviceMarkers.findIndex((function(e){if(void 0!==e)return e._element.id==="marker".concat(t)}));delete e.deviceMarkers[n]}))}))}},{key:"createMarker",value:function(e,t){var n=document.createElement("div");n.className="marker",n.id="marker".concat(e);var r=new Le.default.Marker(n).setLngLat(t).addTo(this.map);this.deviceMarkers.push(r)}},{key:"updateMarker",value:function(e,t){var n=this.deviceMarkers.findIndex((function(t){return t._element.id="marker".concat(e)}));this.deviceMarkers[n].setLngLat(t)}},{key:"error",value:function(e){console.error("ERROR (".concat(null==e?void 0:e.code,") : ").concat(null==e?void 0:e.message))}}]),t}(),ke.default=we;var Qe=me(ke);var Ve=g(he),et={};Object.defineProperty(et,"__esModule",{value:!0});var tt=function(){var e=new P.AuthApi;document.getElementById("disconnect").onclick=e.disconnect};et.default=tt;var nt=g(et),rt={},at=y;Object.defineProperty(rt,"__esModule",{value:!0});var it=function(){(new ft).init()};rt.default=it;var ot=at(v),st=at(p),ut=at(h),ct=at(f),lt=at(d),dt=at(l),pt=at(c);var ft=function(){function e(){(0,ut.default)(this,e),this.statsApi=new P.StatsApi,this.leaderboards=[],this.domLeaderboard=document.getElementById("leaderboards")}var t,n;return(0,ct.default)(e,[{key:"init",value:(n=(0,st.default)(ot.default.mark((function e(){return ot.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetchLeaderboard();case 2:this.displayLeaderboards();case 3:case"end":return e.stop()}}),e,this)}))),function(){return n.apply(this,arguments)})},{key:"fetchLeaderboard",value:(t=(0,st.default)(ot.default.mark((function e(){return ot.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.statsApi.leaderboard();case 2:this.leaderboards=e.sent;case 3:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})},{key:"displayLeaderboards",value:function(){this.prepareLeaderboard(this.leaderboards.maxSpeedSanitized,"vMax","By speed"),this.prepareLeaderboard(this.leaderboards.maxDistanceSanitized,"totalDistance","By distance"),this.prepareLeaderboard(this.leaderboards.totalDurationSanitized,"totalTravelDuration","By duration")}},{key:"prepareLeaderboard",value:function(e,t,n){var r=document.createElement("div"),a=document.createElement("h2");a.textContent=n,r.append(a),e.forEach((function(e){var n=document.createElement("p"),a=document.createElement("p");switch(n.textContent=e.user_id.username,t){case"vMax":a.textContent="".concat(Math.round(3.6*e[t])," km/h");break;case"totalDistance":a.textContent="".concat(Math.round(e[t])," km");break;case"totalTravelDuration":lt.default.extend(dt.default),lt.default.extend(pt.default);var i=lt.default.duration(e[t],"seconds").humanize();a.textContent=i}r.append(n,a)})),this.domLeaderboard.append(r)}}]),e}(),ht=g(rt);window.app={map:Ve.default,driving:fe.default,statistics:ht.default,settings:nt.default};