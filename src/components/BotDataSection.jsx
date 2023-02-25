import { useEffect, useRef, useState } from "react";
import AppService from "../services/AppService";

function BotDataSection(){
//refs
const botDataExportTextAreaRef=useRef();
const botDataImportTextAreaRef=useRef();
//states
const [layout,setLayout]=useState({expanded:false,tab:'export'});
//effects
useEffect(()=>{
},[]);

//methods
function onGenerateBotData(){
    const botDataJson=AppService.bot;
    const dataTxt=JSON.stringify(botDataJson);
    botDataExportTextAreaRef.current.value=dataTxt;
}
function onApplyBotData(){
    const dataTxt=botDataImportTextAreaRef.current.value;
    const botDataUpdateSuccess=AppService.setBotData(dataTxt);
    if(botDataUpdateSuccess){
        window.dispatchEvent(new CustomEvent("botdataupdated"));
    }
}

return(
<section id="botDataSection" className="mt-6 rounded border border-semitrans mb-2 overflow-hidden">
    <div onClick={()=>setLayout(prev=>({...prev,expanded:!prev.expanded}))} className={`${!layout.expanded?'border-none':'border-b'} border-semitrans flex items-center px-4 cursor-pointer`} style={{height:'48px'}}>
        <p className="text-dark text-sm font-semibold">Bot Data</p>
        <i className="bi-chevron-down text-dark ml-auto" style={{transform:`rotate(${layout.expanded?'180deg':'0deg'})`}}></i>
    </div>
    <div className="flex flex-col" style={{height:`${layout.expanded?'360px':'0px'}`,transition:'height 0.2s'}}>
        <div className="flex items-center" style={{height:'48px'}}>
            <button onClick={()=>setLayout(prev=>({...prev,tab:'export'}))} className={`px-4 ${layout.tab=='export'?'text-primary':'text-dark'} text-sm hover:text-accent border-r border-semitrans`}>Export</button>
            <button onClick={()=>setLayout(prev=>({...prev,tab:'import'}))} className={`px-4 ${layout.tab=='import'?'text-primary':'text-dark'} text-sm hover:text-accent border-r border-semitrans`}>Import</button>
        </div>
        <section id="botDataSectionExport" className={`grow ${layout.tab=='export'?'flex':'hidden'} flex-col`}>
            <div className="grow">
                <textarea ref={botDataExportTextAreaRef} className="resize-none w-full h-full bg-light text-darker p-2 outline-none text-xs"></textarea>
            </div>
            <div className="flex items-center px-2" style={{height:'48px'}}>
                <button onClick={onGenerateBotData} className="ml-auto p-2 bg-primary text-lighter text-sm rounded hover:opacity-70">Generate</button>
            </div>
        </section>
        <section id="botDataSectionImport" className={`grow ${layout.tab=='import'?'flex':'hidden'} flex-col`}>
            <div className="grow">
                <textarea ref={botDataImportTextAreaRef} className="resize-none w-full h-full bg-light text-darker p-2 outline-none text-xs"></textarea>
            </div>
            <div className="flex items-center px-2" style={{height:'48px'}}>
                <button onClick={onApplyBotData} className="ml-auto p-2 bg-primary text-lighter text-sm rounded hover:opacity-70">Apply</button>
            </div>
        </section>
    </div>
</section>
);
}

export default BotDataSection;