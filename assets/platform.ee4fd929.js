import{d as t,v as a,p as e,o as s,c as o,a as n,u as l,z as r,A as u,g as c,t as d,H as f,B as p,C as i,D as v}from"./vendor.2eac44aa.js";import{a as _}from"./index.edf0dc5a.js";const h=p("data-v-8016e752");i("data-v-8016e752");const m=c("生产环境"),k=c("充值");v();var g=t({setup(t){let p=a();const i=e("");return(t,a)=>(s(),o(l(r),{vertical:"",justify:"center"},{default:h((()=>[n(l(r),{justify:"center"},{default:h((()=>[n(l(u),{tag:"a",href:"http://localhost:7744/#/platform",target:"_blank"},{default:h((()=>[m])),_:1}),n(l(u),{onClick:a[1]||(a[1]=t=>l(p).commit("increase"))},{default:h((()=>[c("count is: "+d(l(p).state.counter),1)])),_:1}),n(l(u),{tag:"a",href:`http://18.162.167.99:7744/pay?token=${l(p).state.token}`,onMouseenter:a[2]||(a[2]=t=>{_.get("http://127.0.0.1:7733/get-token-by-2009").then((t=>{p.commit("setToken",t.data.token)}))}),target:"_blank"},{default:h((()=>[k])),_:1},8,["href"])])),_:1}),n(l(r),{justify:"center"},{default:h((()=>[n(l(f),{value:i.value,"onUpdate:value":a[3]||(a[3]=t=>i.value=t),type:"text",placeholder:"User ID"},null,8,["value"])])),_:1})])),_:1}))}});g.__scopeId="data-v-8016e752";export{g as default};
