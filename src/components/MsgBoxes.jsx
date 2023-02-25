

function TextMsgBox({msg}){
const isCmd=msg.text.startsWith("/");


return(
!isCmd?
    <div className={`textMsgBox w-fit px-4 py-4 mb-2 rounded-full overflow-hidden shadow clear-both ${msg.isUser?'bg-light text-darkest rounded-tl-none':'bg-primary text-lighter rounded-tr-none float-right'}`} style={{minWidth:'40%'}}>
        <p className="text-sm">{msg.text}</p>
    </div>
:
    <div className={`textMsgBox w-fit px-4 py-4 mb-2 rounded-full overflow-hidden shadow clear-both bg-dark text-light font-semibold rounded-tl-none`} style={{minWidth:'40%'}}>
        <p className="text-sm">{msg.text}</p>
    </div>
);
}

export {TextMsgBox};
