
class AppService{
    static CMDS=["learn",'forget'];

    static bot={
        ver:"0",
        name:"Chat Rock",
        knowledge:[
            {inputs:["Hi","Hello"],outputs:["Hi","Hello"]}
        ],
        initialMessage:"Hi",
        fallBacks:[
            "I don't understand"
        ]
    }

    //get answer
    static getAnswer(input){
        if(input.startsWith('/')){
            return AppService.handleCommand(input);
        }
        input=input.toLowerCase();//console.log("My k",AppService.bot.knowledge)
        //const re=new RegExp(`.*${input}.*`,'gi');
        let possibleMatch=-1;
        for(let i=0;i<AppService.bot.knowledge.length;i++){
            const k=AppService.bot.knowledge[i];
            for(let j=0;j<k.inputs.length;j++){
                const k_input=k.inputs[j].toLowerCase();//console.log(k_input,input)
                if(k_input===input){
                    return k.outputs[Math.floor(Math.random()*k.outputs.length)];
                }else if(input.includes(k_input)){
                    possibleMatch=i;
                }
            }
        }
        if(possibleMatch>-1)return AppService.bot.knowledge[possibleMatch].outputs[Math.floor(Math.random()*AppService.bot.knowledge[possibleMatch].outputs.length)];
        else return AppService.bot.fallBacks[Math.floor(Math.random()*AppService.bot.fallBacks.length)]
    }
    static handleCommand(input){
        //command tokens
        let tokens=[];
        let inStr=false;
        let word='';
        for(let i=0;i<input.length;i++){
            const char=input[i];
            if(char=='"'){
                inStr=!inStr;
            }
            word+=char;
            if(char==' '&&!inStr){
                tokens.push(word.slice(0,word.length-1));
                word='';
            }
        }
        tokens.push(word);//console.log("Tokens",tokens);
        //remove "" from string tokens
        tokens=tokens.map((t)=>(/^".*"$/gi.test(t)?t.slice(1,t.length-1):t));
        //execute
        const cmd=tokens[0].slice(1);
        if(!AppService.CMDS.includes(cmd)){
            return "Unknwon command!";
        }
        const args=tokens.slice(1);//console.log("Args",args);
        if(cmd=="learn"&&args.length==2){
            AppService.addKnowledge(args[0],args[1]);
            return "Learned!";
        }else if(cmd=="forget"){
            const knowledgeIndex=parseInt(args[0].slice(1))-1;
            if(!isNaN(knowledgeIndex)&&knowledgeIndex>=0){
                AppService.forgetKnowledge(knowledgeIndex);
                return "Knowledge erased!";
            }else{
                return `Unable to forget knowledge at ${args[0]}!`;
            }
        }
        return "Unable to execute command!";
    }
    //add knowledge from str cmd
    static addKnowledge(input,output){
        const inputExists=AppService.doesInputExists(input);
        const outputExists=AppService.doesOutputExists(output);
        if(inputExists>-1){//input doesn't exists
            //add output if doesn't already exists
            if(!AppService.bot.knowledge[inputExists].outputs.find((o,i)=>o.toLowerCase()==output.toLowerCase())){
                AppService.bot.knowledge[inputExists].outputs.push(output);
            }
        }else if(outputExists>-1){//output exists
            //add input if doesn't already exists
            if(!AppService.bot.knowledge[outputExists].inputs.find((inp,i)=>inp.toLowerCase()==input.toLowerCase())){
                AppService.bot.knowledge[outputExists].inputs.push(input);
            }
        }else{//input does not exists
            AppService.bot.knowledge.push({inputs:[input],outputs:[output]});
        }
        //console.log(AppService.bot.knowledge);
    }
    //forget knowledge from str cmd
    static forgetKnowledge(index){
        AppService.bot.knowledge.splice(index,1);
    }

    //utils
    //check if input exists and returns the knowledge item index
    static doesInputExists(input){
        return AppService.bot.knowledge.findIndex((k,i)=>{
            return k.inputs.map(inp=>inp.toLowerCase()).includes(input.toLowerCase());
        });
    }
    //check if output exists and returns the knowledge item index
    static doesOutputExists(output){
        return AppService.bot.knowledge.findIndex((k,i)=>{
            return k.outputs.map(out=>out.toLowerCase()).includes(output.toLowerCase());
        });
    }

    //actions
    //set bot data
    static setBotData(txtData){
        try{
            const dataJson=JSON.parse(txtData);
            if(dataJson){
                if(confirm("Confirm update bot data?")){
                    AppService.bot=dataJson;
                }
            }else{
                alert("Invalid data!");
                return false;
            }
        }catch(e){
            alert("Couldn't parse data!, "+e.toString());
            return false;
        }
        return true;
    }

    //helpers
    //text to image
    static textToImage(txt){
        const can=document.createElement("canvas");
        const cc=can.getContext('2d');
        cc.imageSmoothingEnabled=false;
        const charCodes=txt.split('').map((char,i)=>{
            return char.charCodeAt(0);
        });
        const imgSize=Math.ceil(Math.sqrt(charCodes.length/3));
        can.width=imgSize;can.height=imgSize;//let test=[];
        for(let y=0;y<can.height;y++){
            for(let x=0;x<can.width;x++){
                const idx=(x+y*can.width)*3;
                const chars=[];
                for(let i=0;i<3;i++){
                    if(charCodes[idx+i])chars.push(charCodes[idx+i]);
                    else chars.push(null);
                }
                if(chars.every(char=>char===null))break;
                const color=chars.map((char,j)=>char!=null?char:0);//test.push(...color)
                cc.fillStyle=`rgba(${color[0]},${color[1]},${color[2]},${1})`;
                cc.fillRect(x,y,1,1);
            }   
        }
        const imgUrl=can.toDataURL();//console.log(test)
        can.remove();
        return imgUrl;
    }
    //image to text
    static imageToText(imgUrl){
        return new Promise((resolve,reject)=>{
            const img=new Image();
            img.onload=()=>{
                const can=document.createElement("canvas");
                const cc=can.getContext('2d');
                cc.imageSmoothingEnabled=false;
                can.width=img.width;can.height=img.height;
                cc.drawImage(img,0,0,can.width,can.height);
                const imgData=cc.getImageData(0,0,can.width,can.height);//console.log(imgData.data)
                let text="";
                for(let row=0;row<can.height;row++){
                    for(let col=0;col<can.width;col++){
                        const index=(row*can.width+col)*4;
                        const r=imgData.data[index];
                        const g=imgData.data[index+1];
                        const b=imgData.data[index+2];
                        const a=imgData.data[index+3];
                        const rgb=[r,g,b];
                        text+=rgb.map((val,i)=>String.fromCharCode(val)).join("");
                    }
                }
                can.remove();
                resolve(text);
            }
            img.src=imgUrl;
        });
    }

}

export default AppService;

