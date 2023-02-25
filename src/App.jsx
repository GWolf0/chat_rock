import { useEffect } from "react";
import ChatBox from "./components/ChatBox";
import CommandsBox from "./components/CommandsBox";
import ConfigSection from "./components/ConfigSection";
import BotDataSection from "./components/BotDataSection";
import KnowledgeBox from "./components/KnowledgeBox";
import AppService from "./services/AppService";

function App(){
  useEffect(()=>{
  },[])

  return (
    <div className="App bg-lighter w-screen min-h-screen">
      <header className="bg-lighter flex items-center justify-center" style={{height:'100px'}}>
        <p className="text-2xl font-semibold text-darker text-center">Chat Rock</p>
      </header>
      <main id="innerContainer" className="px-2 md:px-4 pt-4 pb-16 mx-auto" style={{width:'min(100vw,1280px)'}}>
        <ConfigSection />
        <section id="row1" className="flex flex-col md:flex-row">
          <section id="chatBoxContainer" className="grow basis-0 border border-semitrans mb-2 md:mb-0 md:mr-0.5 grid" style={{gridAutoRows:'48px auto 48px'}}>
            <div className="border-b border-semitrans flex items-center px-4">
              <p className="text-dark text-sm font-semibold">ChatBox</p>
            </div>
            <div className="p-2">
              <ChatBox />
            </div>
            <div className="bg-light border-t border-semitrans flex items-center px-4">

            </div>
          </section>
          <section id="knowledgeBoxContainer" className="grow basis-0 border border-semitrans md:ml-0.5 grid" style={{gridAutoRows:'48px auto 48px'}}>
            <div className="border-b border-semitrans flex items-center px-4">
              <p className="text-dark text-sm font-semibold">Knowledge</p>
            </div>
            <div className="p-2">
              <KnowledgeBox />
            </div>
            <div className="bg-light border-t border-semitrans flex items-center px-4">

            </div>
          </section>
        </section>
        <CommandsBox />
        <BotDataSection />
      </main>
      <footer className="flex items-center justify-center mt-auto border-t border-semitrans" style={{height:'128px'}}>
        <p className="text-darkest text-xs font-semibold underline">Chat Rock &copy;2023</p>
      </footer>
    </div>
  )
}

export default App;
