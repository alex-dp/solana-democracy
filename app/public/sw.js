if(!self.define){let e,s={};const n=(n,c)=>(n=new URL(n+".js",c).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(c,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let r={};const t=e=>n(e,i),d={module:{uri:i},exports:r,require:t};s[i]=Promise.all(c.map((e=>d[e]||t(e)))).then((e=>(a(...e),r)))}}define(["./workbox-7c2a5a06"],(function(e){"use strict";importScripts("fallback-m8HXf12efU1BEG06bOAeD.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/11e07bb4-4aeacb2fd8ee4f03.js",revision:"4aeacb2fd8ee4f03"},{url:"/_next/static/chunks/256.77664515d2d1751f.js",revision:"77664515d2d1751f"},{url:"/_next/static/chunks/275.cd8ca46234179c5e.js",revision:"cd8ca46234179c5e"},{url:"/_next/static/chunks/29107295.52d5ccd9ad2558b9.js",revision:"52d5ccd9ad2558b9"},{url:"/_next/static/chunks/317-d0c9c2e4a491c3ee.js",revision:"d0c9c2e4a491c3ee"},{url:"/_next/static/chunks/323-2f676a61258a66c2.js",revision:"2f676a61258a66c2"},{url:"/_next/static/chunks/39.a2455ef4cc219657.js",revision:"a2455ef4cc219657"},{url:"/_next/static/chunks/42-dfed3c9240b5b958.js",revision:"dfed3c9240b5b958"},{url:"/_next/static/chunks/45-976f52374016bd88.js",revision:"976f52374016bd88"},{url:"/_next/static/chunks/507.734096b2c261caf9.js",revision:"734096b2c261caf9"},{url:"/_next/static/chunks/61905917.5b838256723a1c7d.js",revision:"5b838256723a1c7d"},{url:"/_next/static/chunks/657.84ba773f6235de7b.js",revision:"84ba773f6235de7b"},{url:"/_next/static/chunks/669.5be7f5e94e30afbd.js",revision:"5be7f5e94e30afbd"},{url:"/_next/static/chunks/794-c2edeb5b78a65e15.js",revision:"c2edeb5b78a65e15"},{url:"/_next/static/chunks/917.b335456128961e00.js",revision:"b335456128961e00"},{url:"/_next/static/chunks/922.bba810c03e9b1f7e.js",revision:"bba810c03e9b1f7e"},{url:"/_next/static/chunks/962-859718d818a0d3bc.js",revision:"859718d818a0d3bc"},{url:"/_next/static/chunks/cde5ba55-c5dc47463bddfab1.js",revision:"c5dc47463bddfab1"},{url:"/_next/static/chunks/e39c296e.d9903bcbf25867fb.js",revision:"d9903bcbf25867fb"},{url:"/_next/static/chunks/framework-0c7baedefba6b077.js",revision:"0c7baedefba6b077"},{url:"/_next/static/chunks/main-9594e9f709d47ceb.js",revision:"9594e9f709d47ceb"},{url:"/_next/static/chunks/pages/_error-08a9db0f433628d8.js",revision:"08a9db0f433628d8"},{url:"/_next/static/chunks/pages/_offline-f9ec95afc66e7d2c.js",revision:"f9ec95afc66e7d2c"},{url:"/_next/static/chunks/pages/index-5b54a8e41b703533.js",revision:"5b54a8e41b703533"},{url:"/_next/static/chunks/pages/mirrors-16dbff222a79ec3f.js",revision:"16dbff222a79ec3f"},{url:"/_next/static/chunks/pages/petitions-c6677aece2689188.js",revision:"c6677aece2689188"},{url:"/_next/static/chunks/pages/petitions/%5Bregion%5D-eccca485b94eb6e4.js",revision:"eccca485b94eb6e4"},{url:"/_next/static/chunks/pages/petitions/%5Bregion%5D/%5Bid%5D-5e1a4c152f4185cc.js",revision:"5e1a4c152f4185cc"},{url:"/_next/static/chunks/pages/petitions/%5Bregion%5D/closed-01ee281f511735b9.js",revision:"01ee281f511735b9"},{url:"/_next/static/chunks/pages/ubi-5d2a0958c9be6de5.js",revision:"5d2a0958c9be6de5"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-94fa373dc1587522.js",revision:"94fa373dc1587522"},{url:"/_next/static/css/a217579884c95f89.css",revision:"a217579884c95f89"},{url:"/_next/static/m8HXf12efU1BEG06bOAeD/_buildManifest.js",revision:"9705aa8d8a647e90c806c8ebff778647"},{url:"/_next/static/m8HXf12efU1BEG06bOAeD/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_offline",revision:"m8HXf12efU1BEG06bOAeD"},{url:"/argon.svg",revision:"3374362783dc85e749d15fdc994bcf45"},{url:"/argonfont.svg",revision:"46d528e72eb1d5c4dd1ed619edef81f5"},{url:"/argonmir.svg",revision:"fcf2e35bbf13effbff92262c55a6b5d7"},{url:"/argonpetitions.svg",revision:"23d0b57c98a150d3bc6120dab41df182"},{url:"/argontemplate.svg",revision:"8061eea78116d936dd339590d1160be9"},{url:"/argontype.svg",revision:"a9cd192e9ca0eefb8a2673b5a62661ba"},{url:"/argonubi.svg",revision:"6293a504b030f85bdb22e7558b4277fc"},{url:"/civic-logo-white.svg",revision:"a0ed42fa20df294566bbaafd2df0926b"},{url:"/cooler-colored-dark.svg",revision:"fc05fbe36fa594df41b7f36d161af8ca"},{url:"/cooler-light.svg",revision:"d9f00aa8cdd4e8f69d334b82b4e575f0"},{url:"/favicon.svg",revision:"8c5a2b6a0bd7dd903575bf673cf74cf1"},{url:"/flyer.pdf",revision:"96abb1b9df0116fc25b283c81ec0f610"},{url:"/flyer.svg",revision:"512bb4765d7b819410147744c4fa5b81"},{url:"/font791.ttf",revision:"4e2c2b2b41a4c5bad3ce73bbf4b32df7"},{url:"/icon.png",revision:"196af2fae52a1b5d4f3b6aae7aa63bb0"},{url:"/icon.svg",revision:"bdbda2fbd49d64d01c3f92bb3a51809d"},{url:"/isc.png",revision:"e540a255f8a76170b7bd5429c442e4e4"},{url:"/light-icon-primary.svg",revision:"77f34713c9b81bd098110acc90f6bb63"},{url:"/manifest.json",revision:"87d78a5fcd352369e0809bc1e5661444"},{url:"/raydium.svg",revision:"d0283161225cdc7104a50cc144e36c04"},{url:"/token.png",revision:"7f5f4f0e6528f54e4d39cfb22e1223b5"},{url:"/token.svg",revision:"8c5a2b6a0bd7dd903575bf673cf74cf1"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s},{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET")}));
