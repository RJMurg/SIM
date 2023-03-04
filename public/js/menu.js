const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".no-boot");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");

    if(hamburger.classList.contains('active')){
        document.body.style.overflow = 'hidden';
    }
    else{
        document.body.style.overflow = 'visible';
    }
}