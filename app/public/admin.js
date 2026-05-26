const botones = document.querySelectorAll("button");
const menu01 = document.querySelectorAll(".menu01");
const menu02 = document.querySelectorAll(".menu02");
const menu03 = document.querySelectorAll(".menu03");


botones.forEach(btn => btn.classList.add("escondido"));
menu01.forEach(btn => btn.classList.remove("escondido"));

document.querySelector(".btn-logout").addEventListener("click",()=>{
    document.cookie ='jwt=; Path=/; Expires= Thu, 01 Jan 1970 00:00:02 GMT';
    document.location.href = "/admin";
});

document.querySelector(".btn-volver").addEventListener("click",()=>{
    botones.forEach(btn => btn.classList.add("escondido"));
    menu01.forEach(btn => btn.classList.remove("escondido"));
});

document.querySelector(".btn-calendario").addEventListener("click",()=>{
    botones.forEach(btn => btn.classList.add("escondido"));
    menu02.forEach(btn => btn.classList.remove("escondido"));
    
});

document.querySelector(".btn-fondos").addEventListener("click",()=>{
    window.location.href = "/fondos";
});

document.querySelector(".btn-cronograma").addEventListener("click",()=>{
    window.location.href = "/cronograma";
});

document.querySelector(".btn-comidas").addEventListener("click",()=>{
    window.location.href = "/comidas"
})

document.querySelector(".btn-passchange").addEventListener("click",()=>{
    window.location.href = "/passchange"
})