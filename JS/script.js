const btn = document.getElementById("menu-btn");
const overlay = document.getElementById("overlay");
const menu = document.getElementById("mobile-menu");
const counters = document.querySelectorAll(".counter");
const menuBtn = document.getElementById("menu");
const menuContent = document.querySelector(".menu-content");

let scrollStarted = false;

// btn.addEventListener('click', navToggle);
document.addEventListener("scroll", scrollPage);

function navToggle() {
  btn.classList.toggle("open");
  overlay.classList.toggle("overlay-show");
  document.body.classList.toggle("stop-scrolling");
  menu.classList.toggle("show-menu");
}

function scrollPage() {
  const scrollPos = window.scrollY;

  if (scrollPos > 100 && !scrollStarted) {
    countUp();
    scrollStarted = true;
  } else if (scrollPos < 100 && scrollStarted) {
    reset();
    scrollStarted = false;
  }
}

function countUp() {
  // counters.forEach((counter) => {
  //   counter.innerText = '0';

  //   const updateCounter = () => {
  //     // Get count target
  //     const target = counter.getAttribute('data-target');
  //     // Get current counter value
  //     const c = +counter.innerText;
  //     // Create an increment
  //     const increment = target / 100;

  //     // If counter is less than target, add increment
  //     if (c < target) {
  //       // Round up and set counter value
  //       counter.innerText = Math.ceil(c + increment);

  //       // setTimeout(updateCounter, 75);
  //     } else {
  //       counter.innerText = target;
  //     }
  //   };

  //   updateCounter();
  // });
  let animationDuration = 1000;
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const numberOfSteps = Math.floor(animationDuration / 10); // Assuming 10 ms interval
    const increment = target / numberOfSteps;
    let incCounterValue = 0;

    let animation = setInterval(() => {
      if (incCounterValue < target) {
        incCounterValue += increment;
        counter.innerText = Math.round(incCounterValue);
      } else {
        clearInterval(animation);
      }
    }, 10);
  });
}

function reset() {
  counters.forEach((counter) => (counter.innerHTML = "0"));
}

// menu button
function myFunction(x) {
  x.classList.toggle("change");
}
menuBtn.addEventListener("click", () => {
  menuContent.classList.toggle("active");
});

  // Function to show the toast notification
  function showSubscribeToast() {
    var toast = document.getElementById("subscribe-toast");
    toast.style.display = "block";

    setTimeout(function () {
      toast.style.display = "none";
    }, 5000); // Hide the toast after 5 seconds
  }

  // Function to handle the "Subscribe" button click
  function subscribeToNewsletter() {
    // You can add your newsletter subscription logic here
    // For demonstration purposes, we'll simply show the toast
    showSubscribeToast();
  }

  // Add an event listener to the "Subscribe" button
  document.getElementById("subscribe-button").addEventListener("click", subscribeToNewsletter);

  // Show the toast notification when the page loads (for demonstration)
  window.addEventListener("load", showSubscribeToast);

  // Function to handle form submission
document.getElementById("newsletter-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from submitting
  // You can add your form submission logic here

  // For demonstration purposes, show a success message
  document.getElementById("newsletter-form").innerHTML =
    '<p>Thank you for subscribing!</p>';
});

// Added Event Listener on satellite option for screen size smaller than 750px
let satelliteOption=document.querySelector("#secondary");
satelliteOption.addEventListener(("click"),()=>{
  document.querySelector(".material-symbols-outlined").classList.toggle("rotate-Arrow")
  let satellites=document.querySelectorAll(".satellite-option");
  satellites.forEach((ele)=>{
    ele.classList.toggle("display-satellites");
  })
})


document.addEventListener("DOMContentLoaded", function() {
  const scrollToTopButton = document.getElementById("scrollToTopButton");

  window.onscroll = function() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          scrollToTopButton.style.display = "block";
      } else {
          scrollToTopButton.style.display = "none";
      }
  };

  scrollToTopButton.addEventListener("click", function() {
      window.scrollTo({
          top: 0,
          behavior: "smooth"
      });
  });
});
