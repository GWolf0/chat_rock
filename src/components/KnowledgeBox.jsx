import { useEffect, useRef, useState } from "react";
import AppService from "../services/AppService";

function KnowledgeBox(){
//refs
const knowledgeBoxRef=useRef();
//states
const [knowledge,setKnowledge]=useState(AppService.bot.knowledge);
//effects
useEffect(()=>{
    //handlers
    function onBotDataUpdated(){
        setKnowledge(AppService.bot.knowledge);
    }
    //events
    window.addEventListener('botknowledgeupdate',onBotKnowledgeUpdate);
    window.addEventListener('botdataupdated',onBotDataUpdated);
    //clear events
    return ()=>{
        window.removeEventListener('botknowledgeupdate',onBotKnowledgeUpdate);
        window.removeEventListener('botdataupdated',onBotDataUpdated);
    }
},[]);
useEffect(()=>{
    knowledgeBoxRef.current.scrollTop=knowledgeBoxRef.current.scrollHeight;
},[knowledge]);

//methods
function onBotKnowledgeUpdate(e){
    //console.log("On botknowledgeupdate");console.log(AppService.bot.knowledge)
    setKnowledge(AppService.bot.knowledge.map(k=>k));
}

return(
<div ref={knowledgeBoxRef} id="knowledgeBox" onClick={onBotKnowledgeUpdate} className="rounded bg-lighter p-2 border border-dark overflow-y-auto" style={{width:'100%',height:'480px'}}>
    {
        knowledge.map((k,i)=>(
            <div key={i} className="knowledgeItem w-full bg-light py-2 px-2 mb-2 rounded border border-semitrans">
                <p className="text-primary text-xs mb-0.5">#{i+1}</p>
                <p className="text-dark text-xs mb-2">Inputs</p>
                {
                    k.inputs.map((o,j)=>(
                        <div key={j} className={`bg-primary py-2 px-4 ${j<k.inputs.length-1?'mb-2':''} mb-2 rounded-full`}>
                            <p className="text-lighter text-sm">{o}</p>
                        </div>
                    ))
                }
                <p className="text-dark text-xs mb-2">Outputs</p>
                {
                    k.outputs.map((o,j)=>(
                        <div key={j} className={`bg-lightest py-2 px-4 ${j<k.outputs.length-1?'mb-2':''} rounded-full`}>
                            <p className="text-dark text-sm">{o}</p>
                        </div>
                    ))
                }
            </div>
        ))
    }
</div>
)
}

export default KnowledgeBox;