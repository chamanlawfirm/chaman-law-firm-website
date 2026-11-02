import { NextResponse } from "next/server";
import { storeFeedback, validateFeedback } from "@/lib/client-feedback";
export const runtime="nodejs";
const headers={"Cache-Control":"no-store, max-age=0","X-Robots-Tag":"noindex, nofollow"};
const reply=(body:object,status:number)=>NextResponse.json(body,{status,headers});
export async function POST(request:Request){
 if(process.env.FEEDBACK_PUBLIC_ENABLED !== "true")return reply({message:"Confidential feedback intake is not yet activated."},503);
 const url=new URL(request.url);
 const origin=request.headers.get("origin");
 if(origin&&origin!==url.origin&&origin!=="https://chamanlawfirm.com"&&origin!=="https://www.chamanlawfirm.com")return reply({message:"Origin not permitted."},403);
 const site=request.headers.get("sec-fetch-site");
 if(site&&site!=="same-origin"&&site!=="none")return reply({message:"Cross-site request rejected."},403);
 if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))return reply({message:"Expected JSON."},415);
 if(Number(request.headers.get("content-length")||0)>20000)return reply({message:"Request too large."},413);
 try{
  const raw=await request.text();if(raw.length>20000)return reply({message:"Request too large."},413);
  const parsed=JSON.parse(raw);const value=validateFeedback(parsed);
  if(!value)return reply({message:"Please review your feedback details and required ratings."},422);
  const result=await storeFeedback(value);
  if(!result.ok)return reply({message:"Secure feedback storage is temporarily unavailable. No submission has been confirmed; please try again later."},503);
  return reply({reference:result.reference,message:"Stored for confidential management review."},201);
 }catch{return reply({message:"Your feedback could not be processed. No submission has been confirmed."},400);}
}
export async function GET(){return reply({message:"Not found."},404);}
