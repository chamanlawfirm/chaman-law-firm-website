import "server-only";
import { randomUUID } from "node:crypto";

export const ratings = ["Courtesy and customer service","Responsiveness to calls and messages","Clarity of explanations","Timeliness and follow-through","Professionalism and respectful conduct","Updates on the matter","Clarity about fees and agreed scope","Overall experience"] as const;
const subjects = ["firm","representatives","unsure"];
const followUps = ["yes","no","anonymous"];
const single=(v:unknown,n:number)=>typeof v==="string"?v.replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,n):"";
const text=(v:unknown,n:number)=>typeof v==="string"?v.replace(/[\u0000\u0001-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,"").trim().slice(0,n):"";
const isObj=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const enumRating=(v:unknown,required=false)=>v===undefined||v===""? !required :v==="na"?!required:typeof v==="string"&&/^[1-5]$/.test(v);
function normalizePhone(original:string){const d=original.replace(/[^0-9]/g,"");if(/^0[789][01]\d{8}$/.test(d))return "+234"+d.slice(1);if(/^234[789][01]\d{8}$/.test(d))return "+"+d;if(/^\d{7,15}$/.test(d))return "+"+d;return null;}
function ratingMap(input:unknown,required=false){if(!isObj(input))return null;const out:Record<string,string>={};for(const k of ratings){const v=input[k];if(!enumRating(v,k==="Overall experience"&&required))return null;if(typeof v==="string"&&v!=="")out[k]=v;}return out;}
export function validateFeedback(input:unknown){
 if(!isObj(input)||Object.keys(input).length>28||single(input.website,200))return null;
 const subject=single(input.subject,30);const followUp=single(input.followUp,20);
 if(!subjects.includes(subject)||!followUps.includes(followUp)||input.privacy!==true)return null;
 if(!Array.isArray(input.representatives)||input.representatives.length>8)return null;
 const representatives=[] as Record<string,unknown>[];
 if(subject==="representatives"){if(input.representatives.length<1)return null;for(const v of input.representatives){if(!isObj(v))return null;
  const name=single(v.name,100),phone=single(v.phone,40),role=single(v.role,80),description=text(v.description,250);
  if(!name&&!phone)return null;
  if(phone&&!/^[+0-9().\s-]{7,40}$/.test(phone))return null;
  const individualRatings=ratingMap(v.ratings);if(!individualRatings)return null;
  representatives.push({name,phone,normalizedPhone:phone?normalizePhone(phone):null,role,description,ratings:individualRatings});
 }}
 const overallRatings=ratingMap(input.ratings,true);if(!overallRatings)return null;
 const email=single(input.email,254),phone=single(input.phone,40),name=single(input.clientName,100);
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))return null;
 if(phone&&!/^[+0-9().\s-]{7,40}$/.test(phone))return null;
 if(followUp==="yes"&&!email&&!phone)return null;
 if(input.concerns!==undefined&&(!Array.isArray(input.concerns)||input.concerns.length>10||input.concerns.some(v=>typeof v!=="string"||v.length>90)))return null;
 const service=single(input.service,100),location=single(input.location,100),date=single(input.date,20);
 if(!service||!location||date&&!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
 if(!["Property / real estate","Corporate / commercial","Litigation","Debt recovery","Probate","Family","Immigration","Employment","Other","Unsure"].includes(service))return null;
 if(!["Ikeja — Lagos","Lekki — Ikota Villa","Magodo GRA Phase 2","Arepo — Ogun State","Wuse Zone 1 — Abuja","Telephone","WhatsApp","Email","Online consultation","Other / unsure"].includes(location))return null;
 return {subject,representatives,service,location,interaction_date:date||null,matter_reference:single(input.matterReference,80),service_description:text(input.description,500),
 ratings:overallRatings,concerns:(input.concerns as string[]||[]).map(s=>s.slice(0,90)),
 praise:text(input.praise,2000),improve:text(input.improve,2000),complaint:text(input.complaint,3000),requested_action:text(input.requestedAction,1000),
 follow_up:followUp,client_name:followUp==="anonymous"?"":name,email:followUp==="anonymous"?"":email,phone:followUp==="anonymous"?"":phone,
 preferred_contact:followUp==="anonymous"?"":single(input.contactMethod,30),privacy_version:"2026-11-feedback-v1"};
}
export async function storeFeedback(data:NonNullable<ReturnType<typeof validateFeedback>>){
 const endpoint=process.env.FEEDBACK_SUPABASE_URL?.trim(),secret=process.env.FEEDBACK_SUPABASE_SERVICE_KEY?.trim();
 if(!endpoint||!secret)return {ok:false as const,status:503};
 let base:URL;try{base=new URL(endpoint);if(base.protocol!=="https:"||!/^https:\/\/[a-z0-9-]+\.supabase\.co\/$/.test(base.href))return {ok:false as const,status:503};}catch{return {ok:false as const,status:503};}
 const ref="CF-"+randomUUID().replace(/-/g,"").slice(0,16).toUpperCase();
 const record={reference:ref,payload:data,status:"new",notification_status:"pending"};
 try{
 const response=await fetch(new URL("/rest/v1/client_feedback",base),{method:"POST",headers:{"apikey":secret,"Authorization":"Bearer "+secret,"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify(record),cache:"no-store",signal:AbortSignal.timeout(9000)});
 if(!response.ok)return {ok:false as const,status:503};const stored=await response.json();if(!Array.isArray(stored)||stored.length!==1||stored[0].reference!==ref)return {ok:false as const,status:503};
 return {ok:true as const,reference:ref};
 }catch{return {ok:false as const,status:503};}
}
