//Select the filter buttons and filterable images
const filterButtons=document.querySelectorAll(".filter_buttons button");
const filter_images=document.querySelectorAll(".filter_images .card");

//Define the filterImages function
const filterImages=(e)=>{
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    console.log(e.target);
    console.log(e.target.dataset.name);

    //Iterate over each card
    filter_images.forEach(card=>{
        card.classList.add("hide");
        //Check if the card matches the selected filter or "all" is selected 
        if(card.dataset.name === e.target.dataset.name || e.target.dataset.name === "all"){
            card.classList.remove("hide");
        }
    })
};

//Add click event listener to each filter button
filterButtons.forEach(button=>button.addEventListener("click",filterImages));