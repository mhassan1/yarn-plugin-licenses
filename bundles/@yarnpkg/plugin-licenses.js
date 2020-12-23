/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-licenses",
factory: function (require) {
var plugin=(()=>{var ye=Object.create,S=Object.defineProperty;var J=Object.getOwnPropertyDescriptor;var ke=Object.getOwnPropertyNames,Z=Object.getOwnPropertySymbols,we=Object.getPrototypeOf,G=Object.prototype.hasOwnProperty,be=Object.prototype.propertyIsEnumerable;var Q=(e,n,t)=>n in e?S(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,A=(e,n)=>{for(var t in n||(n={}))G.call(n,t)&&Q(e,t,n[t]);if(Z)for(var t of Z(n))be.call(n,t)&&Q(e,t,n[t]);return e};var ve=e=>S(e,"__esModule",{value:!0});var p=e=>{if(typeof require!="undefined")return require(e);throw new Error('Dynamic require of "'+e+'" is not supported')};var Y=(e,n)=>{for(var t in n)S(e,t,{get:n[t],enumerable:!0})},xe=(e,n,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of ke(n))!G.call(e,o)&&o!=="default"&&S(e,o,{get:()=>n[o],enumerable:!(t=J(n,o))||t.enumerable});return e},d=e=>xe(ve(S(e!=null?ye(we(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e),W=(e,n,t,o)=>{for(var i=o>1?void 0:o?J(n,t):n,r=e.length-1,a;r>=0;r--)(a=e[r])&&(i=(o?a(n,t,i):a(i))||i);return o&&i&&S(n,t,i),i};var Re={};Y(Re,{default:()=>Ce});var de=d(p("@yarnpkg/cli")),j=d(p("@yarnpkg/core")),T=d(p("clipanion"));var c=d(p("@yarnpkg/core")),h=d(p("@yarnpkg/fslib"));var V={};Y(V,{fs:()=>ne,getLicense:()=>Te,getPackagePath:()=>Le});var X=d(p("@yarnpkg/plugin-pnp")),$=d(p("@yarnpkg/core")),U=d(p("@yarnpkg/fslib")),ee=d(p("@yarnpkg/libzip")),Le=async(e,n)=>{te(e);let t=$.structUtils.convertPackageToLocator(n),o={name:$.structUtils.stringifyIdent(t),reference:t.reference},i=B.getPackageInformation(o);if(!i)return null;let{packageLocation:r}=i;return r},Te=(e,n)=>{te(e);let t=$.structUtils.convertPackageToLocator(n),o={name:$.structUtils.stringifyIdent(t),reference:t.reference},i=B.getPackageInformation(o);if(!i)return;let{packageLocation:r}=i,a=U.ppath.join("/"+r.slice(0,-1).replace(/\\/g,"/"),"LICENSE");return ne.readFileSync(a).toString()},B,te=e=>{B||(B=module.require((0,X.getPnpPath)(e).cjs))},ne=new U.VirtualFS({baseFs:new U.ZipOpenFS({libzip:(0,ee.getLibzipSync)(),readOnlyArchives:!0})});var z={};Y(z,{_getYarnStateAliases:()=>se,fs:()=>Me,getLicense:()=>Ne,getPackagePath:()=>Ie});var L=d(p("@yarnpkg/core")),ie=d(p("@yarnpkg/parsers")),b=d(p("@yarnpkg/fslib")),Ie=async(e,n)=>{await re(e);let t=L.structUtils.convertPackageToLocator(n),o=L.structUtils.stringifyLocator(t),i=O[o]||oe[o];if(!i)return null;let r=i.locations[0];return r?b.ppath.join(e.cwd,r):e.cwd},Ne=(e,n)=>{re(e);let t=L.structUtils.convertPackageToLocator(n),o=O[L.structUtils.stringifyLocator(t)];if(!o)return null;let i=o.locations[0],r=i?b.ppath.join(i,"LICENSE"):"LICENSE",a=npath.fromPortablePath(r);return readFileSync(a).toString()},O,oe,re=async e=>{if(!O){let n=b.ppath.join(e.configuration.projectCwd,b.Filename.nodeModules,".yarn-state.yml");O=(0,ie.parseSyml)(await b.xfs.readFilePromise(n,"utf8")),oe=se(O)}},Me=b.xfs,se=e=>Object.entries(e).reduce((n,[t,o])=>{if(!o.aliases)return n;let i=L.structUtils.parseLocator(t);for(let r of o.aliases){let a=L.structUtils.makeLocator(i,r),s=L.structUtils.stringifyLocator(a);n[s]=o}return n},{});var D=e=>{switch(e){case"pnp":return V;case"node-modules":return z;default:throw new Error("Unsupported linker")}};var Xe=h.npath.basename(__dirname)==="@yarnpkg"?h.ppath.join(h.npath.toPortablePath(__dirname),"../.."):h.ppath.join(h.npath.toPortablePath(__dirname),".."),ae=async(e,n,t,o,i)=>{let r={},a={children:r},s=await ce(e,t,o),l=D(e.configuration.get("nodeLinker"));for(let[u,f]of s.entries()){let g=await l.getPackagePath(e,f);if(g===null)continue;let y=JSON.parse(await l.fs.readFilePromise(h.ppath.join(g,h.Filename.manifest),"utf8")),{license:m,url:k,vendorName:x,vendorUrl:I}=Ue(y);r[m]||(r[m]={value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,m),children:{}});let N=c.structUtils.convertPackageToLocator(f),w=c.formatUtils.tuple(c.formatUtils.Type.DEPENDENT,{locator:N,descriptor:u}),P=i?{}:A(A(A({},k?{url:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,K("URL",k,n))}}:{}),x?{vendorName:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,K("VendorName",x,n))}}:{}),I?{vendorUrl:{value:c.formatUtils.tuple(c.formatUtils.Type.NO_HINT,K("VendorUrl",I,n))}}:{}),q={value:w,children:P},he=c.structUtils.stringifyLocator(N),Pe=r[m].children;Pe[he]=q}return a},ce=async(e,n,t)=>{let o=new Map,i;if(n){if(t){for(let l of e.workspaces)l.manifest.devDependencies.clear();let s=await c.Cache.find(e.configuration);await e.resolveEverything({report:new c.ThrowReport,cache:s})}i=e.storedDescriptors.values()}else i=e.workspaces.flatMap(s=>{let l=[s.anchoredDescriptor];for(let[u,f]of s.dependencies.entries())t&&s.manifest.devDependencies.has(u)||l.push(f);return l});let r=c.miscUtils.sortMap(i,[s=>c.structUtils.stringifyIdent(s),s=>c.structUtils.isVirtualDescriptor(s)?"0":"1",s=>s.range]),a=new Set;for(let s of r.values()){let l=e.storedResolutions.get(s.descriptorHash);if(!l)continue;let u=e.storedPackages.get(l);if(!u)continue;let{descriptorHash:f}=c.structUtils.isVirtualDescriptor(s)?c.structUtils.devirtualizeDescriptor(s):s;a.has(f)||(a.add(f),o.set(s,u))}return o};function Se(e){let n={},t=e.match(/^([^(<]+)/);if(t){let r=t[0].trim();r&&(n.name=r)}let o=e.match(/<([^>]+)>/);o&&(n.email=o[1]);let i=e.match(/\(([^)]+)\)/);return i&&(n.url=i[1]),n}var Ue=e=>{let{license:n,licenses:t,repository:o,homepage:i,author:r}=e,a=typeof r=="string"?Se(r):r;return{license:(()=>{if(n)return H(n);if(t){if(!Array.isArray(t))return H(t);if(t.length===1)return H(t[0]);if(t.length>1)return`(${t.map(H).join(" OR ")})`}return le})(),url:(o==null?void 0:o.url)||i,vendorName:a==null?void 0:a.name,vendorUrl:i||(a==null?void 0:a.url)}},le="UNKNOWN",H=e=>(typeof e!="string"?e.type:e)||le,K=(e,n,t)=>t?n:`${e}: ${n}`,pe=async(e,n,t)=>{let o=await ce(e,n,t),i=D(e.configuration.get("nodeLinker")),r=new Map;for(let s of o.values()){let l=await i.getPackagePath(e,s);if(l===null)continue;let u=JSON.parse(await i.fs.readFilePromise(h.ppath.join(l,h.Filename.manifest),"utf8")),g=(await i.fs.readdirPromise(l,{withFileTypes:!0})).filter(w=>w.isFile()).map(({name:w})=>w),y=g.find(w=>{let P=w.toLowerCase();return P==="license"||P.startsWith("license.")||P==="unlicense"||P.startsWith("unlicense.")});if(!y)continue;let m=await i.fs.readFilePromise(h.ppath.join(l,y),"utf8"),k=g.find(w=>{let P=w.toLowerCase();return P==="notice"||P.startsWith("notice.")}),x;k&&(x=await i.fs.readFilePromise(h.ppath.join(l,k),"utf8"));let I=x?`${m}

NOTICE

${x}`:m,N=r.get(I);N?N.set(u.name,u):r.set(I,new Map([[u.name,u]]))}let a=`THE FOLLOWING SETS FORTH ATTRIBUTION NOTICES FOR THIRD PARTY SOFTWARE THAT MAY BE CONTAINED IN PORTIONS OF THE ${String(e.topLevelWorkspace.manifest.raw.name).toUpperCase().replace(/-/g," ")} PRODUCT.

`;for(let[s,l]of r.entries()){a+=`-----

`;let u=[],f=[];for(let{name:y,repository:m}of l.values())u.push(y),(m==null?void 0:m.url)&&f.push(l.size===1?m.url:`${m.url} (${y})`);let g=[];g.push(`The following software may be included in this product: ${u.join(", ")}.`),f.length>0&&g.push(`A copy of the source code may be downloaded from ${f.join(", ")}.`),g.push("This software contains the following license and notice below:"),a+=`${g.join(" ")}

`,a+=`${s.trim()}

`}return a};var C=class extends T.Command{constructor(){super(...arguments);this.recursive=T.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=T.Option.Boolean("--production",!1,{description:"Exclude development dependencies"});this.json=T.Option.Boolean("--json",!1,{description:"Format output as JSON"});this.excludeMetadata=T.Option.Boolean("--exclude-metadata",!1,{description:"Exclude dependency metadata from output"})}async execute(){let n=await j.Configuration.find(this.context.cwd,this.context.plugins),{project:t,workspace:o}=await j.Project.find(n,this.context.cwd);if(!o)throw new de.WorkspaceRequiredError(t.cwd,this.context.cwd);await t.restoreInstallState();let i=await ae(t,this.json,this.recursive,this.production,this.excludeMetadata);j.treeUtils.emitTree(i,{configuration:n,stdout:this.context.stdout,json:this.json,separators:1})}};C.paths=[["licenses","list"]],C.usage=T.Command.Usage({description:"display the licenses for all packages in the project",details:`
      This command prints the license information for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the listing will exclude development dependencies.
    `,examples:[["List all licenses of direct dependencies","$0 licenses list"],["List all licenses of direct and transitive dependencies","$0 licenses list --recursive"],["List all licenses of production dependencies only","$0 licenses list --production"]]});var fe=d(p("@yarnpkg/cli")),_=d(p("@yarnpkg/core")),E=d(p("clipanion"));var R=class extends E.Command{constructor(){super(...arguments);this.recursive=E.Option.Boolean("-R,--recursive",!1,{description:"Include transitive dependencies (dependencies of direct dependencies)"});this.production=E.Option.Boolean("--production",!1,{description:"Exclude development dependencies"})}async execute(){let n=await _.Configuration.find(this.context.cwd,this.context.plugins),{project:t,workspace:o}=await _.Project.find(n,this.context.cwd);if(!o)throw new fe.WorkspaceRequiredError(t.cwd,this.context.cwd);await t.restoreInstallState();let i=await pe(t,this.recursive,this.production);this.context.stdout.write(i)}};R.paths=[["licenses","generate-disclaimer"]],R.usage=E.Command.Usage({description:"display the license disclaimer including all packages in the project",details:`
      This command prints the license disclaimer for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the disclaimer will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the disclaimer will exclude development dependencies.
    `,examples:[["Include licenses of direct dependencies","$0 licenses generate-disclaimer"],["Include licenses of direct and transitive dependencies","$0 licenses generate-disclaimer --recursive"],["Include licenses of production dependencies only","$0 licenses list --production"]]});var F=d(p("clipanion")),v=d(p("@yarnpkg/core")),ue=d(p("@yarnpkg/cli"));var ge=d(p("fs")),me=d(p("util")),je=me.promisify(ge.writeFile),Ee=`
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
`.substr(1),Fe=(e,n,t,o,i,r)=>`
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
`.substr(1),M=class extends F.Command{constructor(){super(...arguments);this.recursive=!1;this.output="licenses.html"}async execute(){let n=await v.Configuration.find(this.context.cwd,this.context.plugins),{project:t,workspace:o}=await v.Project.find(n,this.context.cwd);if(!o)throw new ue.WorkspaceRequiredError(t.cwd,this.context.cwd);await t.restoreInstallState();let i;this.recursive?i=t.storedDescriptors.values():i=t.workspaces.flatMap(f=>{let g=[f.anchoredDescriptor];return g.push(...f.dependencies.values()),g});let r=v.miscUtils.sortMap(i,f=>v.structUtils.stringifyDescriptor(f)),a=D(t.configuration.get("nodeLinker")),s=Ee,l=0,u=new Set;for(let f of r.values()){let g=t.storedResolutions.get(f.descriptorHash),y=t.storedPackages.get(g),m=v.structUtils.convertPackageToLocator(y),k=a.getPackageManifest(t,y);if(!k||u.has(k.name))continue;let{license:x,url:I,vendorName:N,vendorUrl:w}=Oe(k),P="";try{P=a.getLicense(t,y)}catch(q){}s+=Fe(l++,k.name,w||I,x,N,P),u.add(k.name)}s+=$e,await je(this.output,s)}};M.usage=F.Command.Usage({description:"produces an html file containing the licenses for all packages in the project",details:`
      This command produces an html file containing the license information for packages in the project. By default, only direct dependencies are included.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).
    `,examples:[["List all licenses of direct dependencies","$0 licenses list"],["List all licenses of direct and transitive dependencies","$0 licenses list --recursive"]]}),W([F.Command.Boolean("-R,--recursive")],M.prototype,"recursive",2),W([F.Command.Boolean("-O,--output")],M.prototype,"output",2),W([F.Command.Path("licenses","html")],M.prototype,"execute",1);var Oe=e=>{let{license:n,repository:t,homepage:o,author:i}=e;return{license:(typeof n!="string"?n==null?void 0:n.type:n)||"UNKNOWN",url:(t==null?void 0:t.url)||o,vendorName:i==null?void 0:i.name,vendorUrl:o||(i==null?void 0:i.url)}};var De={commands:[C,R,M]},Ce=De;return Re;})();
return plugin;
}
};
