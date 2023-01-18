/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-licenses",
factory: function (require) {
var plugin=(()=>{var ke=Object.create,O=Object.defineProperty;var ye=Object.getOwnPropertyDescriptor;var we=Object.getOwnPropertyNames,J=Object.getOwnPropertySymbols,be=Object.getPrototypeOf,Z=Object.prototype.hasOwnProperty,ve=Object.prototype.propertyIsEnumerable;var G=(e,n,t)=>n in e?O(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,W=(e,n)=>{for(var t in n||(n={}))Z.call(n,t)&&G(e,t,n[t]);if(J)for(var t of J(n))ve.call(n,t)&&G(e,t,n[t]);return e};var xe=e=>O(e,"__esModule",{value:!0});var l=e=>{if(typeof require!="undefined")return require(e);throw new Error('Dynamic require of "'+e+'" is not supported')};var V=(e,n)=>{for(var t in n)O(e,t,{get:n[t],enumerable:!0})},Le=(e,n,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of we(n))!Z.call(e,o)&&o!=="default"&&O(e,o,{get:()=>n[o],enumerable:!(t=ye(n,o))||t.enumerable});return e},d=e=>Le(xe(O(e!=null?ke(be(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var Ae={};V(Ae,{default:()=>Re});var pe=d(l("@yarnpkg/cli")),U=d(l("@yarnpkg/core")),T=d(l("clipanion"));var c=d(l("@yarnpkg/core")),h=d(l("@yarnpkg/fslib"));var z={};V(z,{fs:()=>te,getLicense:()=>Ie,getPackagePath:()=>Te});var Q=d(l("@yarnpkg/plugin-pnp")),E=d(l("@yarnpkg/core")),S=d(l("@yarnpkg/fslib")),X=d(l("@yarnpkg/libzip")),Te=async(e,n)=>{ee(e);let t=E.structUtils.convertPackageToLocator(n),o={name:E.structUtils.stringifyIdent(t),reference:t.reference},i=H.getPackageInformation(o);if(!i)return null;let{packageLocation:r}=i;return r},Ie=(e,n)=>{ee(e);let t=E.structUtils.convertPackageToLocator(n),o={name:E.structUtils.stringifyIdent(t),reference:t.reference},i=H.getPackageInformation(o);if(!i)return;let{packageLocation:r}=i,a=S.ppath.join("/"+r.slice(0,-1).replace(/\\/g,"/"),"LICENSE");return te.readFileSync(a).toString()},H,ee=e=>{H||(H=module.require((0,Q.getPnpPath)(e).cjs.substr(1)))},te=new S.VirtualFS({baseFs:new S.ZipOpenFS({libzip:(0,X.getLibzipSync)(),readOnlyArchives:!0})});var K={};V(K,{_getYarnStateAliases:()=>se,fs:()=>Ue,getLicense:()=>Se,getPackagePath:()=>Ne});var L=d(l("@yarnpkg/core")),ne=d(l("@yarnpkg/parsers")),b=d(l("@yarnpkg/fslib")),ie=d(l("fs")),Ne=async(e,n)=>{await re(e);let t=L.structUtils.convertPackageToLocator(n),o=L.structUtils.stringifyLocator(t),i=$[o]||oe[o];if(!i)return null;let r=i.locations[0];return r?b.ppath.join(e.cwd,r):e.cwd},Se=(e,n)=>{re(e);let t=L.structUtils.convertPackageToLocator(n),o=$[L.structUtils.stringifyLocator(t)];if(!o)return;let i=o.locations[0],r=i?b.ppath.join(i,"LICENSE"):"LICENSE",a=b.npath.fromPortablePath(r);return(0,ie.readFileSync)(a).toString()},$,oe,re=async e=>{if(!$){let n=b.ppath.join(e.configuration.projectCwd,b.Filename.nodeModules,".yarn-state.yml");$=(0,ne.parseSyml)(await b.xfs.readFilePromise(n,"utf8")),oe=se($)}},Ue=b.xfs,se=e=>Object.entries(e).reduce((n,[t,o])=>{if(!o.aliases)return n;let i=L.structUtils.parseLocator(t);for(let r of o.aliases){let a=L.structUtils.makeLocator(i,r),s=L.structUtils.stringifyLocator(a);n[s]=o}return n},{});var C=e=>{switch(e){case"pnp":return z;case"node-modules":return K;default:throw new Error("Unsupported linker")}};var et=h.npath.basename(__dirname)==="@yarnpkg"?h.ppath.join(h.npath.toPortablePath(__dirname),"../.."):h.ppath.join(h.npath.toPortablePath(__dirname),".."),ae=async(e,n,t,o,i)=>{let r={},a={children:r},s=await ce(e,t,o),p=C(e.configuration.get("nodeLinker"));for(let[u,f]of s.entries()){let m=await p.getPackagePath(e,f);if(m===null)continue;let k=JSON.parse(await p.fs.readFilePromise(h.ppath.join(m,h.Filename.manifest),"utf8")),{license:g,url:x,vendorName:P,vendorUrl:I}=je(k);r[g]||(r[g]={value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,g),children:{}});let N=c.structUtils.convertPackageToLocator(f),y=c.formatUtils.tuple(c.formatUtils.Type.DEPENDENT,{locator:N,descriptor:u}),w=i?{}:W(W(W({},x?{url:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,q("URL",x,n))}}:{}),P?{vendorName:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,q("VendorName",P,n))}}:{}),I?{vendorUrl:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,q("VendorUrl",I,n))}}:{}),F={value:y,children:w},he=c.structUtils.stringifyLocator(N),Pe=r[g].children;Pe[he]=F}return a},ce=async(e,n,t)=>{let o=new Map,i;if(n){if(t){for(let p of e.workspaces)p.manifest.devDependencies.clear();let s=await c.Cache.find(e.configuration);await e.resolveEverything({report:new c.ThrowReport,cache:s})}i=e.storedDescriptors.values()}else i=e.workspaces.flatMap(s=>{let p=[s.anchoredDescriptor];for(let[u,f]of s.dependencies.entries())t&&s.manifest.devDependencies.has(u)||p.push(f);return p});let r=c.miscUtils.sortMap(i,[s=>c.structUtils.stringifyIdent(s),s=>c.structUtils.isVirtualDescriptor(s)?"0":"1",s=>s.range]),a=new Set;for(let s of r.values()){let p=e.storedResolutions.get(s.descriptorHash);if(!p)continue;let u=e.storedPackages.get(p);if(!u)continue;let{descriptorHash:f}=c.structUtils.isVirtualDescriptor(s)?c.structUtils.devirtualizeDescriptor(s):s;a.has(f)||(a.add(f),o.set(s,u))}return o};function Me(e){let n={},t=e.match(/^([^(<]+)/);if(t){let r=t[0].trim();r&&(n.name=r)}let o=e.match(/<([^>]+)>/);o&&(n.email=o[1]);let i=e.match(/\(([^)]+)\)/);return i&&(n.url=i[1]),n}var je=e=>{let{license:n,licenses:t,repository:o,homepage:i,author:r}=e,a=typeof r=="string"?Me(r):r;return{license:(()=>{if(n)return B(n);if(t){if(!Array.isArray(t))return B(t);if(t.length===1)return B(t[0]);if(t.length>1)return`(${t.map(B).join(" OR ")})`}return le})(),url:(o==null?void 0:o.url)||i,vendorName:a==null?void 0:a.name,vendorUrl:i||(a==null?void 0:a.url)}},le="UNKNOWN",B=e=>(typeof e!="string"?e.type:e)||le,q=(e,n,t)=>t?n:`${e}: ${n}`,de=async(e,n,t)=>{let o=await ce(e,n,t),i=C(e.configuration.get("nodeLinker")),r=new Map;for(let s of o.values()){let p=await i.getPackagePath(e,s);if(p===null)continue;let u=JSON.parse(await i.fs.readFilePromise(h.ppath.join(p,h.Filename.manifest),"utf8")),m=(await i.fs.readdirPromise(p,{withFileTypes:!0})).filter(y=>y.isFile()).map(({name:y})=>y),k=m.find(y=>{let w=y.toLowerCase();return w==="license"||w.startsWith("license.")||w==="unlicense"||w.startsWith("unlicense.")});if(!k)continue;let g=await i.fs.readFilePromise(h.ppath.join(p,k),"utf8"),x=m.find(y=>{let w=y.toLowerCase();return w==="notice"||w.startsWith("notice.")}),P;x&&(P=await i.fs.readFilePromise(h.ppath.join(p,x),"utf8"));let I=P?`${g}

NOTICE

${P}`:g,N=r.get(I);N?N.set(u.name,u):r.set(I,new Map([[u.name,u]]))}let a=`THE FOLLOWING SETS FORTH ATTRIBUTION NOTICES FOR THIRD PARTY SOFTWARE THAT MAY BE CONTAINED IN PORTIONS OF THE ${String(e.topLevelWorkspace.manifest.raw.name).toUpperCase().replace(/-/g," ")} PRODUCT.

`;for(let[s,p]of r.entries()){a+=`-----

`;let u=[],f=[];for(let{name:k,repository:g}of p.values())u.push(k),(g==null?void 0:g.url)&&f.push(p.size===1?g.url:`${g.url} (${k})`);let m=[];m.push(`The following software may be included in this product: ${u.join(", ")}.`),f.length>0&&m.push(`A copy of the source code may be downloaded from ${f.join(", ")}.`),m.push("This software contains the following license and notice below:"),a+=`${m.join(" ")}

`,a+=`${s.trim()}

`}return a};var D=class extends T.Command{constructor(){super(...arguments);this.recursive=T.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=T.Option.Boolean("--production",!1,{description:"Exclude development dependencies"});this.json=T.Option.Boolean("--json",!1,{description:"Format output as JSON"});this.excludeMetadata=T.Option.Boolean("--exclude-metadata",!1,{description:"Exclude dependency metadata from output"})}async execute(){let n=await U.Configuration.find(this.context.cwd,this.context.plugins),{project:t,workspace:o}=await U.Project.find(n,this.context.cwd);if(!o)throw new pe.WorkspaceRequiredError(t.cwd,this.context.cwd);await t.restoreInstallState();let i=await ae(t,this.json,this.recursive,this.production,this.excludeMetadata);U.treeUtils.emitTree(i,{configuration:n,stdout:this.context.stdout,json:this.json,separators:1})}};D.paths=[["licenses","list"]],D.usage=T.Command.Usage({description:"display the licenses for all packages in the project",details:`
      This command prints the license information for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the listing will exclude development dependencies.
    `,examples:[["List all licenses of direct dependencies","$0 licenses list"],["List all licenses of direct and transitive dependencies","$0 licenses list --recursive"],["List all licenses of production dependencies only","$0 licenses list --production"]]});var fe=d(l("@yarnpkg/cli")),_=d(l("@yarnpkg/core")),M=d(l("clipanion"));var R=class extends M.Command{constructor(){super(...arguments);this.recursive=M.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=M.Option.Boolean("--production",!1,{description:"Exclude development dependencies"})}async execute(){let n=await _.Configuration.find(this.context.cwd,this.context.plugins),{project:t,workspace:o}=await _.Project.find(n,this.context.cwd);if(!o)throw new fe.WorkspaceRequiredError(t.cwd,this.context.cwd);await t.restoreInstallState();let i=await de(t,this.recursive,this.production);this.context.stdout.write(i)}};R.paths=[["licenses","generate-disclaimer"]],R.usage=M.Command.Usage({description:"display the license disclaimer including all packages in the project",details:`
      This command prints the license disclaimer for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the disclaimer will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the disclaimer will exclude development dependencies.
    `,examples:[["Include licenses of direct dependencies","$0 licenses generate-disclaimer"],["Include licenses of direct and transitive dependencies","$0 licenses generate-disclaimer --recursive"],["Include licenses of production dependencies only","$0 licenses list --production"]]});var j=d(l("clipanion")),v=d(l("@yarnpkg/core")),ue=d(l("@yarnpkg/cli"));var me=d(l("fs")),ge=d(l("util")),Y=d(l("@yarnpkg/fslib")),Fe=ge.promisify(me.writeFile),Oe=`
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
`.substr(1),Ee=(e,n,t,o,i,r)=>`
<div class="entry">
    <span>${n}${i?` by ${i}`:""}</span>
    ${t?`(<a target="_blank" href="${t}">Homepage</a>)`:""}
    ${r?`<input type="checkbox" hidden id="${e}">
    <label for="${e}"> ${o||"unknown"} license</label>
    <pre>${r}</pre>`:`<span class="right">${o||"unknown"} license</span>`}
</div>
`.substr(1),$e=`
</body>
</html>
`.substr(1),A=class extends j.Command{constructor(){super(...arguments);this.recursive=j.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.output=j.Option.String("-O,--output","licenses.html",{description:"Include transitive dependencies (dependencies of direct dependencies)"})}async execute(){let n=await v.Configuration.find(this.context.cwd,this.context.plugins),{project:t,workspace:o}=await v.Project.find(n,this.context.cwd);if(!o)throw new ue.WorkspaceRequiredError(t.cwd,this.context.cwd);await t.restoreInstallState();let i;this.recursive?i=t.storedDescriptors.values():i=t.workspaces.flatMap(f=>{let m=[f.anchoredDescriptor];return m.push(...f.dependencies.values()),m});let r=v.miscUtils.sortMap(i,f=>v.structUtils.stringifyDescriptor(f)),a=C(t.configuration.get("nodeLinker")),s=Oe,p=0,u=new Set;for(let f of r.values()){let m=t.storedResolutions.get(f.descriptorHash),k=t.storedPackages.get(m),g=v.structUtils.convertPackageToLocator(k),x=await a.getPackagePath(t,k);if(x===null)continue;let P=JSON.parse(await a.fs.readFilePromise(Y.ppath.join(x,Y.Filename.manifest),"utf8"));if(!P||u.has(P.name))continue;let{license:I,url:N,vendorName:y,vendorUrl:w}=Ce(P);try{let F=a.getLicense(t,k);F&&(s+=Ee(p++,P.name,w||N,I,y,F))}catch(F){}u.add(P.name)}s+=$e,await Fe(this.output,s)}};A.paths=[["licenses","html"]],A.usage=j.Command.Usage({description:"produces an html file containing the licenses for all packages in the project",details:`
      This command produces an html file containing the license information for packages in the project. By default, only direct dependencies are included.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).
    `,examples:[["List all licenses of direct dependencies","$0 licenses list"],["List all licenses of direct and transitive dependencies","$0 licenses list --recursive"]]});var Ce=e=>{let{license:n,repository:t,homepage:o,author:i}=e;return{license:(typeof n!="string"?n==null?void 0:n.type:n)||"UNKNOWN",url:(t==null?void 0:t.url)||o,vendorName:i==null?void 0:i.name,vendorUrl:o||(i==null?void 0:i.url)}};var De={commands:[D,R,A]},Re=De;return Ae;})();
return plugin;
}
};
