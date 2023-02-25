function CommandsBox(){


return(
<section id="row2" className="mt-6 border border-semitrans rounded p-2 md:p-4">
    <p className="text-dark text-sm font-semibold underline">Commands</p>
    <ul className="w-full border-b border-t border-semitrans mt-4">
    <li className="py-2 flex">
        <p className="text-dark pr-4 font-semibold" style={{minWidth:'20%'}}>/learn</p>
        <p className="text-dark">Ex: /learn "User input" "Bot output"</p>
    </li>
    <li className="py-2 flex">
        <p className="text-dark pr-4 font-semibold" style={{minWidth:'20%'}}>/forget</p>
        <p className="text-dark">Ex: /forget #1 (where 1 is knowledge number)</p>
    </li>
    </ul>
</section>
)
}

export default CommandsBox;
