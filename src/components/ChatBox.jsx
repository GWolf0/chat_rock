import { useEffect, useRef, useState } from "react";
import { TextMsgBox } from "./MsgBoxes";
import AppService from "../services/AppService";

function ChatBox(){
//refs
const msgTextInputRef=useRef();
const chatBoxBodyRef=useRef();
//states
const [msgs,setMsgs]=useState([{isUser:false,text:AppService.bot.initialMessage}]);
const [botName,setBotName]=useState(AppService.bot.name);
//effects
useEffect(()=>{
    //handlers
    function onKeyDown(e){
        const kc=e.keyCode;
        if(kc===13&&document.activeElement===msgTextInputRef.current){
            onSendTextMsg();
        }
    }
    function onConfigsUpdate(){
        setBotName(AppService.bot.name);
    }
    function onBotDataUpdated(){
        setBotName(AppService.bot.name);
        setMsgs([{isUser:false,text:AppService.bot.initialMessage}]);
    }
    //events
    window.addEventListener('keydown',onKeyDown);
    window.addEventListener('configsupdate',onConfigsUpdate);
    window.addEventListener('botdataupdated',onBotDataUpdated);
    //clear events
    return ()=>{
        window.removeEventListener('keydown',onKeyDown);
        window.removeEventListener('configsupdate',onConfigsUpdate);
        window.removeEventListener('botdataupdated',onBotDataUpdated);
    }
},[]);
useEffect(()=>{
    const lastMsg=msgs.at(-1);
    if(lastMsg.isUser){
        const text=lastMsg.text;
        const response=AppService.getAnswer(text);
        //console.log(response);
        onBotTextMsg(response);
        window.dispatchEvent(new CustomEvent('botknowledgeupdate'));
    }
    chatBoxBodyRef.current.scrollTop=chatBoxBodyRef.current.scrollHeight;
},[msgs]);

//methods
function onSendTextMsg(){
    const txtMsg=msgTextInputRef.current.value.trim();//console.log("send",txtMsg);
    if(txtMsg.length<1)return;
    const newMsg={isUser:true,text:txtMsg};
    setMsgs(prev=>[...prev,newMsg]);
    msgTextInputRef.current.value="";
}
function onBotTextMsg(txtMsg){
    const newMsg={isUser:false,text:txtMsg};
    setMsgs(prev=>[...prev,newMsg]);
}


return(
<div id="chatBox" className="isolate rounded bg-lighter border border-dark overflow-hidden flex flex-col" style={{width:'100%',height:'480px'}}>
    <section className="chatBoxHeader z-10 bg-light shadow flex items-center px-4" style={{height:'60px'}}>
        <p className="text-darker font-semibold text-sm">{botName}</p>
    </section>
    <section ref={chatBoxBodyRef} className="chatBoxBody grow basis-0 p-2 overflow-y-auto" style={{}}>
        {
            msgs.map((msg,i)=>(
                <TextMsgBox key={i} msg={msg} />
            ))
        }
    </section>
    <section className="chatBoxFooter bg-light flex items-center" style={{height:'60px'}}>
        <input ref={msgTextInputRef} className="h-full px-2 md:px-4 grow basis-0 text-dark bg-inherit outline-none" placeholder="text.." type="text" />
        <button onClick={onSendTextMsg} className={`h-full px-4 md:px-6 text-dark hover:text-accent`}><i className="bi-send"></i></button>
    </section>
</div>
)
}

export default ChatBox;