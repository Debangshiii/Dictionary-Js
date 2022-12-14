const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
synonyms = wrapper.querySelector(".synonyms .list"),
infoText = wrapper.querySelector(".info-text"),
volumeIcon = wrapper.querySelector(".word i"),
removeIcon = wrapper.querySelector(".search span");
let audio;

//data function
function data(result, word){
    if(result.title){ //if api returns the message of can't find word
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>.Please, try to search for another word.`;
    }else{
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
        phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;
        
        //lets pass the particular response data to a particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        audio = new Audio(result[0].phonetics[0].audio);  //creating new audio obj and passing audio src


        if(definitions.synonyms[0] == undefined){ //if there is no synonym then hide the div
            synonyms.parentElement.style.display = "none";
        }else{
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++){ //getting only 5 synonyms out of many
            let tag = `<span onclick=search('${definitions.synonyms[i]}')>${definitions.synonyms[i]},</span>`;
            tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
            synonyms.insertAdjacentHTML("beforeend", tag);   //passing all 5 synonyms inside synonyms div
            }
        }
    }
     
}
//search synonyms function
function search(word){
    searchInput.value = word;
    fetchApi(word);
    wrapper.classList.remove("active");
}

//fetch api function
function fetchApi(word){
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    //fetching api response and returning it with parsing into js obj and in another then
    //method calling data function with passing api response and searched word as an argument
    fetch(url).then(response => response.json()).then(result => data(result, word)).catch(() =>{
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

searchInput.addEventListener("keyup", e =>{
    if(e.key === "Enter" && e.target.value){
        fetchApi(e.target.value);
    }
    
});

volumeIcon.addEventListener("click", ()=>{
    audio.play();
    
});

removeIcon.addEventListener("click",()=>{
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML = "Type a word and press enter to get meaning, example, pronounciation, and synonyms of that typed word.";

})