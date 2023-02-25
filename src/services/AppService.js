
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
                }else if(input.includes(k_input)||(input.length>3&&k_input.includes(input))){
                    possibleMatch=i;
                }
            }
        }
        if(possibleMatch>-1){
            const k=AppService.bot.knowledge[possibleMatch];
            return "If you mean '"+k.inputs[0]+"' then: "+k.outputs[Math.floor(Math.random()*k.outputs.length)];
        }
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

}

export default AppService;

