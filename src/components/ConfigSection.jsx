import { useEffect, useRef, useState } from "react";
import AppService from "../services/AppService";

function ConfigSection(){
//refs
const fallbackInputRef=useRef();
//states
const [layout,setLayout]=useState({expanded:false});
const [botName,setBotName]=useState(AppService.bot.name);
const [initialMessage,setInitialMessage]=useState(AppService.bot.initialMessage);
const [fallbackMessages,setFallbackMessages]=useState(AppService.bot.fallBacks);
//effects
useEffect(()=>{
    //handlers
    function onKeyDown(e){
        const kc=e.keyCode;
        if(kc===13&&document.activeElement===fallbackInputRef.current){
            onAddFallback();
        }
    }
    function onBotDataUpdated(){
        setBotName(AppService.bot.name);
        setInitialMessage(AppService.bot.initialMessage);
        setFallbackMessages(AppService.bot.fallBacks);
    }
    //events
    window.addEventListener('keydown',onKeyDown);
    window.addEventListener('botdataupdated',onBotDataUpdated);
    //clear events
    return ()=>{
        window.removeEventListener('keydown',onKeyDown);
        window.removeEventListener('botdataupdated',onBotDataUpdated);
    }
},[]);
useEffect(()=>{
    AppService.bot.name=botName;
    AppService.bot.initialMessage=initialMessage;
    window.dispatchEvent(new CustomEvent("configsupdate"));
},[botName,initialMessage]);
useEffect(()=>{
    AppService.bot.fallBacks=fallbackMessages;
},[fallbackMessages]);

//methods
function onAddFallback(){
    const newMsg=fallbackInputRef.current.value;
    if(newMsg.length<1)return;
    setFallbackMessages(prev=>[...prev,newMsg]);
    fallbackInputRef.current.value="";
}
function onRemoveFallback(index){
    setFallbackMessages(prev=>prev.filter((fb,i)=>i!==index));
}


return (
<section id="configsSection" className="rounded border border-semitrans mb-2 overflow-hidden">
    <div onClick={()=>setLayout(prev=>({...prev,expanded:!prev.expanded}))} className={`${!layout.expanded?'border-none':'border-b'} border-semitrans flex items-center px-4 cursor-pointer`} style={{height:'48px'}}>
        <p className="text-dark text-sm font-semibold">Configs</p>
        <i className="bi-chevron-down text-dark ml-auto" style={{transform:`rotate(${layout.expanded?'180deg':'0deg'})`}}></i>
    </div>
    <div className="" style={{maxHeight:`${layout.expanded?'1000px':'0px'}`,transition:'max-height 0.2s'}}>
        <div className="p-2 mb-1 border-b border-semitrans">
            <p className="text-dark text-sm font-semibold mb-1">Bot Name</p>
            <input value={botName} onChange={(e)=>setBotName(e.target.value)} className="p-2 bg-light text-darkest text-sm w-full outline-none" type="text" />
        </div>
        <div className="p-2 mb-1 border-b border-semitrans">
            <p className="text-dark text-sm font-semibold mb-1">Initial Message</p>
            <input value={initialMessage} onChange={(e)=>setInitialMessage(e.target.value)} className="p-2 bg-light text-darkest text-sm w-full outline-none" type="text" />
        </div>
        <div className="p-2 mb-1">
            <p className="text-dark text-sm font-semibold mb-1">Fallback Messages</p>
            <ul className="border border-semitrans mb-0.5">
                {
                    fallbackMessages.map((fb,i)=>(
                        <li key={i} className={`py-1 px-2 text-dark text-xs ${i<fallbackMessages.length-1?'border-b':'border-none'} border-semitrans flex items-center`}>{fb} <button hidden={fallbackMessages.length===1} onClick={()=>onRemoveFallback(i)} className="text-sm text-dark p-1 ml-auto">&times;</button></li>
                    ))
                }
            </ul>
            <div className="flex">
                <input ref={fallbackInputRef} className="p-2 grow basis-0 bg-light text-darkest text-sm w-full outline-none border border-r-none border-semitrans" type="text" />
                <button onClick={onAddFallback} className="px-4 bg-primary text-lighter text-sm">Add</button>
            </div>
        </div>
    </div>
</section>
);
}

export default ConfigSection;