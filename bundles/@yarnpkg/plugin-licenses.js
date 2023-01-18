/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-licenses",
factory: function (require) {
"use strict";var plugin=(()=>{var ge=Object.create;var R=Object.defineProperty;var he=Object.getOwnPropertyDescriptor;var Pe=Object.getOwnPropertyNames;var ye=Object.getPrototypeOf,ke=Object.prototype.hasOwnProperty;var d=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,n)=>(typeof require<"u"?require:t)[n]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var Y=(e,t)=>{for(var n in t)R(e,n,{get:t[n],enumerable:!0})},q=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Pe(t))!ke.call(e,o)&&o!==n&&R(e,o,{get:()=>t[o],enumerable:!(i=he(t,o))||i.enumerable});return e};var J=(e,t,n)=>(n=e!=null?ge(ye(e)):{},q(t||!e||!e.__esModule?R(n,"default",{value:e,enumerable:!0}):n,e)),we=e=>q(R({},"__esModule",{value:!0}),e);var Ee={};Y(Ee,{default:()=>$e});var le=d("@yarnpkg/cli"),U=d("@yarnpkg/core"),L=d("clipanion");var c=d("@yarnpkg/core"),g=d("@yarnpkg/fslib");var V={};Y(V,{fs:()=>G,getLicense:()=>be,getPackagePath:()=>ve});var Z=d("@yarnpkg/plugin-pnp"),$=d("@yarnpkg/core"),N=d("@yarnpkg/fslib"),Q=d("@yarnpkg/libzip"),ve=async(e,t)=>{X(e);let n=$.structUtils.convertPackageToLocator(t),i={name:$.structUtils.stringifyIdent(n),reference:n.reference},o=A.getPackageInformation(i);if(!o)return null;let{packageLocation:s}=o;return`/${s.slice(0,-1).replace(/\\/g,"/")}`},be=(e,t)=>{X(e);let n=$.structUtils.convertPackageToLocator(t),i={name:$.structUtils.stringifyIdent(n),reference:n.reference},o=A.getPackageInformation(i);if(!o)return;let{packageLocation:s}=o,a=N.ppath.join("/"+s.slice(0,-1).replace(/\\/g,"/"),"LICENSE");return G.readFileSync(a).toString()},A,X=e=>{A||(A=module.require((0,Z.getPnpPath)(e).cjs.substr(1)))},G=new N.VirtualFS({baseFs:new N.ZipOpenFS({libzip:(0,Q.getLibzipSync)(),readOnlyArchives:!0})});var z={};Y(z,{_getYarnStateAliases:()=>oe,fs:()=>Te,getLicense:()=>Le,getPackagePath:()=>xe});var x=d("@yarnpkg/core"),ee=d("@yarnpkg/parsers"),k=d("@yarnpkg/fslib"),te=d("fs"),xe=async(e,t)=>{await ie(e);let n=x.structUtils.convertPackageToLocator(t),i=x.structUtils.stringifyLocator(n),o=E[i]||ne[i];if(!o)return null;let s=o.locations[0];return s?k.ppath.join(e.cwd,s):e.cwd},Le=(e,t)=>{ie(e);let n=x.structUtils.convertPackageToLocator(t),i=E[x.structUtils.stringifyLocator(n)];if(!i)return;let o=i.locations[0],s=o?k.ppath.join(o,"LICENSE"):"LICENSE",a=k.npath.fromPortablePath(s);return(0,te.readFileSync)(a).toString()},E,ne,ie=async e=>{if(!E){let t=k.ppath.join(e.configuration.projectCwd,k.Filename.nodeModules,".yarn-state.yml");E=(0,ee.parseSyml)(await k.xfs.readFilePromise(t,"utf8")),ne=oe(E)}},Te=k.xfs,oe=e=>Object.entries(e).reduce((t,[n,i])=>{if(!i.aliases)return t;let o=x.structUtils.parseLocator(n);for(let s of i.aliases){let a=x.structUtils.makeLocator(o,s),r=x.structUtils.stringifyLocator(a);t[r]=i}return t},{});var C=e=>{switch(e){case"pnp":return V;case"node-modules":return z;default:throw new Error("Unsupported linker")}};var Ze=g.npath.basename(__dirname)==="@yarnpkg"?g.ppath.join(g.npath.toPortablePath(__dirname),"../.."):g.ppath.join(g.npath.toPortablePath(__dirname),".."),se=async(e,t,n,i,o)=>{let s={},a={children:s},r=await re(e,n,i),l=C(e.configuration.get("nodeLinker"));for(let[u,m]of r.entries()){let p=await l.getPackagePath(e,m);if(p===null)continue;let h=JSON.parse(await l.fs.readFilePromise(g.ppath.join(p,g.Filename.manifest),"utf8")),{license:f,url:I,vendorName:w,vendorUrl:v}=Ne(h);s[f]||(s[f]={value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,f),children:{}});let T=c.structUtils.convertPackageToLocator(m),P=c.formatUtils.tuple(c.formatUtils.Type.DEPENDENT,{locator:T,descriptor:u}),y=o?{}:{...I?{url:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,K("URL",I,t))}}:{},...w?{vendorName:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,K("VendorName",w,t))}}:{},...v?{vendorUrl:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,K("VendorUrl",v,t))}}:{}},_={value:P,children:y},D=c.structUtils.stringifyLocator(T),me=s[f].children;me[D]=_}return a},re=async(e,t,n)=>{let i=new Map,o;if(t){if(n){for(let l of e.workspaces)l.manifest.devDependencies.clear();let r=await c.Cache.find(e.configuration);await e.resolveEverything({report:new c.ThrowReport,cache:r})}o=e.storedDescriptors.values()}else o=e.workspaces.flatMap(r=>{let l=[r.anchoredDescriptor];for(let[u,m]of r.dependencies.entries())n&&r.manifest.devDependencies.has(u)||l.push(m);return l});let s=c.miscUtils.sortMap(o,[r=>c.structUtils.stringifyIdent(r),r=>c.structUtils.isVirtualDescriptor(r)?"0":"1",r=>r.range]),a=new Set;for(let r of s.values()){let l=e.storedResolutions.get(r.descriptorHash);if(!l)continue;let u=e.storedPackages.get(l);if(!u)continue;let{descriptorHash:m}=c.structUtils.isVirtualDescriptor(r)?c.structUtils.devirtualizeDescriptor(r):r;a.has(m)||(a.add(m),i.set(r,u))}return i};function Ie(e){let t={},n=e.match(/^([^(<]+)/);if(n){let s=n[0].trim();s&&(t.name=s)}let i=e.match(/<([^>]+)>/);i&&(t.email=i[1]);let o=e.match(/\(([^)]+)\)/);return o&&(t.url=o[1]),t}var Ne=e=>{let{license:t,licenses:n,repository:i,homepage:o,author:s}=e,a=typeof s=="string"?Ie(s):s;return{license:(()=>{if(t)return H(t);if(n){if(!Array.isArray(n))return H(n);if(n.length===1)return H(n[0]);if(n.length>1)return`(${n.map(H).join(" OR ")})`}return ae})(),url:(i==null?void 0:i.url)||o,vendorName:a==null?void 0:a.name,vendorUrl:o||(a==null?void 0:a.url)}},ae="UNKNOWN",H=e=>(typeof e!="string"?e.type:e)||ae,K=(e,t,n)=>n?t:`${e}: ${t}`,ce=async(e,t,n)=>{let i=await re(e,t,n),o=C(e.configuration.get("nodeLinker")),s=new Map;for(let r of i.values()){let l=await o.getPackagePath(e,r);if(l===null)continue;let u=JSON.parse(await o.fs.readFilePromise(g.ppath.join(l,g.Filename.manifest),"utf8")),p=(await o.fs.readdirPromise(l,{withFileTypes:!0})).filter(P=>P.isFile()).map(({name:P})=>P),h=p.find(P=>{let y=P.toLowerCase();return y==="license"||y.startsWith("license.")||y==="unlicense"||y.startsWith("unlicense.")});if(!h)continue;let f=await o.fs.readFilePromise(g.ppath.join(l,h),"utf8"),I=p.find(P=>{let y=P.toLowerCase();return y==="notice"||y.startsWith("notice.")}),w;I&&(w=await o.fs.readFilePromise(g.ppath.join(l,I),"utf8"));let v=w?`${f}

NOTICE

${w}`:f,T=s.get(v);T?T.set(u.name,u):s.set(v,new Map([[u.name,u]]))}let a=`THE FOLLOWING SETS FORTH ATTRIBUTION NOTICES FOR THIRD PARTY SOFTWARE THAT MAY BE CONTAINED IN PORTIONS OF THE ${String(e.topLevelWorkspace.manifest.raw.name).toUpperCase().replace(/-/g," ")} PRODUCT.

`;for(let[r,l]of s.entries()){a+=`-----

`;let u=[],m=[];for(let{name:h,repository:f}of l.values())u.push(h),f!=null&&f.url&&m.push(l.size===1?f.url:`${f.url} (${h})`);let p=[];p.push(`The following software may be included in this product: ${u.join(", ")}.`),m.length>0&&p.push(`A copy of the source code may be downloaded from ${m.join(", ")}.`),p.push("This software contains the following license and notice below:"),a+=`${p.join(" ")}

`,a+=`${r.trim()}

`}return a};var S=class extends L.Command{constructor(){super(...arguments);this.recursive=L.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=L.Option.Boolean("--production",!1,{description:"Exclude development dependencies"});this.json=L.Option.Boolean("--json",!1,{description:"Format output as JSON"});this.excludeMetadata=L.Option.Boolean("--exclude-metadata",!1,{description:"Exclude dependency metadata from output"})}async execute(){let n=await U.Configuration.find(this.context.cwd,this.context.plugins),{project:i,workspace:o}=await U.Project.find(n,this.context.cwd);if(!o)throw new le.WorkspaceRequiredError(i.cwd,this.context.cwd);await i.restoreInstallState();let s=await se(i,this.json,this.recursive,this.production,this.excludeMetadata);U.treeUtils.emitTree(s,{configuration:n,stdout:this.context.stdout,json:this.json,separators:1})}};S.paths=[["licenses","list"]],S.usage=L.Command.Usage({description:"display the licenses for all packages in the project",details:`
      This command prints the license information for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the listing will exclude development dependencies.
    `,examples:[["List all licenses of direct dependencies","$0 licenses list"],["List all licenses of direct and transitive dependencies","$0 licenses list --recursive"],["List all licenses of production dependencies only","$0 licenses list --production"]]});var de=d("@yarnpkg/cli"),W=d("@yarnpkg/core"),j=d("clipanion");var M=class extends j.Command{constructor(){super(...arguments);this.recursive=j.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=j.Option.Boolean("--production",!1,{description:"Exclude development dependencies"})}async execute(){let n=await W.Configuration.find(this.context.cwd,this.context.plugins),{project:i,workspace:o}=await W.Project.find(n,this.context.cwd);if(!o)throw new de.WorkspaceRequiredError(i.cwd,this.context.cwd);await i.restoreInstallState();let s=await ce(i,this.recursive,this.production);this.context.stdout.write(s)}};M.paths=[["licenses","generate-disclaimer"]],M.usage=j.Command.Usage({description:"display the license disclaimer including all packages in the project",details:`
      This command prints the license disclaimer for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the disclaimer will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the disclaimer will exclude development dependencies.
    `,examples:[["Include licenses of direct dependencies","$0 licenses generate-disclaimer"],["Include licenses of direct and transitive dependencies","$0 licenses generate-disclaimer --recursive"],["Include licenses of production dependencies only","$0 licenses list --production"]]});var O=d("clipanion"),b=d("@yarnpkg/core"),pe=d("@yarnpkg/cli");var fe=J(d("fs")),ue=J(d("util")),B=d("@yarnpkg/fslib"),Se=ue.promisify(fe.writeFile),Ue=`
<html>
<head>
<style>
.entry {
    background-color: lightyellow;
    padding: 8px;
    margin-bottom: 8px;
}
a {
    color: darkblue;
}
label {
  float: right;
}
label::before {
  color: darkblue;
  text-decoration: underline;
}
.right {
    float: right;
}
input + label + pre {
    display: none;
}
input + label::before {
    content: "show";
    cursor: pointer;
}
input:checked + label + pre {
    display: block;
}
input:checked + label::before {
    content: "hide ";
    cursor: pointer;
}
</style>
</style>
</head>
<body>
`.substr(1),Me=(e,t,n,i,o,s)=>`
<div class="entry">
    <span>${t}${o?` by ${o}`:""}</span>
    ${n?`(<a target="_blank" href="${n}">Homepage</a>)`:""}
    ${s?`<input type="checkbox" hidden id="${e}">
    <label for="${e}"> ${i||"unknown"} license</label>
    <pre>${s}</pre>`:`<span class="right">${i||"unknown"} license</span>`}
</div>
`.substr(1),je=`
</body>
</html>
`.substr(1),F=class extends O.Command{constructor(){super(...arguments);this.recursive=O.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.output=O.Option.String("-O,--output","licenses.html",{description:"Include transitive dependencies (dependencies of direct dependencies)"})}async execute(){let n=await b.Configuration.find(this.context.cwd,this.context.plugins),{project:i,workspace:o}=await b.Project.find(n,this.context.cwd);if(!o)throw new pe.WorkspaceRequiredError(i.cwd,this.context.cwd);await i.restoreInstallState();let s;this.recursive?s=i.storedDescriptors.values():s=i.workspaces.flatMap(p=>{let h=[p.anchoredDescriptor];return h.push(...p.dependencies.values()),h});let a=b.miscUtils.sortMap(s,p=>b.structUtils.stringifyDescriptor(p)),r=C(i.configuration.get("nodeLinker")),l=Ue,u=0,m=new Set;for(let p of a.values())if(!m.has(p.identHash)){try{let h=i.storedResolutions.get(p.descriptorHash),f=i.storedPackages.get(h),I=b.structUtils.convertPackageToLocator(f),w=await r.getPackagePath(i,f);if(w===null)continue;let v=JSON.parse(await r.fs.readFilePromise(B.ppath.join(w,B.Filename.manifest),"utf8"));if(!v)continue;let{license:T,url:P,vendorName:y,vendorUrl:_}=Fe(v),D=r.getLicense(i,f);D&&(l+=Me(u++,v.name,_||P,T,y,D))}catch{}m.add(p.identHash)}l+=je,await Se(this.output,l)}};F.paths=[["licenses","html"]],F.usage=O.Command.Usage({description:"produces an html file containing the licenses for all packages in the project",details:`
      This command produces an html file containing the license information for packages in the project. By default, only direct dependencies are included.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).
    `,examples:[["List all licenses of direct dependencies","$0 licenses list"],["List all licenses of direct and transitive dependencies","$0 licenses list --recursive"]]});var Fe=e=>{let{license:t,repository:n,homepage:i,author:o}=e;return{license:(typeof t!="string"?t==null?void 0:t.type:t)||"UNKNOWN",url:(n==null?void 0:n.url)||i,vendorName:o==null?void 0:o.name,vendorUrl:i||(o==null?void 0:o.url)}};var Oe={commands:[S,M,F]},$e=Oe;return we(Ee);})();
return plugin;
}
};
