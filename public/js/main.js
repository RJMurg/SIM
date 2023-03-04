// Get all the buttons
var buttons = document.getElementsByTagName("button");

// Loop through the buttons
for (var i = 0; i < buttons.length; i++) {
    // Add a click event listener to each button
    buttons[i].addEventListener("click", function() {
        // Get the ID of the button that was clicked
        var buttonId = this.id;

        // Get all the divs
        var divs = document.getElementsByTagName("div");

        // Remove divs with the class 'menu' from the array
        divs = Array.from(divs).filter(function(div) {
            return !div.classList.contains("menu");
        });

        // Loop through the divs
        for (var i = 0; i < divs.length; i++) {
            // Get the ID of the div
            var divId = divs[i].id;

            // If the div's ID is the same as the button's ID
            if (divId == buttonId) {
                // Show the div
                divs[i].classList.remove("hidden");
            } else {
                // Hide the div
                divs[i].classList.add("hidden");
            }
        }
    });
}