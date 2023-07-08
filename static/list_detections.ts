let cached_audios: {
    [id: number]: HTMLAudioElement 
} = {}

function playPause(e: Event) {
    if(!e.target) return;
    let button = (e.target as HTMLButtonElement);
    let attr = button.getAttribute("id")
    if(!attr) return;
    let id: number = +attr;
    if(!(id in cached_audios)) {
        cached_audios[id] = new Audio(`play/${id}`);
        cached_audios[id].addEventListener("ended",(e) => {
            button.innerHTML = "⏵";
        });
        cached_audios[id].addEventListener("pause",(e) => {
            button.innerHTML = "⏵";
        });
        cached_audios[id].addEventListener("play",(e) => {
            button.innerHTML = "⏸";
        });
    }
    for(let i in cached_audios) {
        cached_audios[i].pause();
    }
    if(cached_audios[id].paused) {
        cached_audios[id].play();
        return;
    }
    cached_audios[id].pause();
}

document.querySelectorAll(".playpause").forEach((ppbutton) => {
    ppbutton.addEventListener("click",(e) => playPause(e));
});