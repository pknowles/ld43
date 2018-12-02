function Character(role, ability) {
    this.role = role;               // i.e. "Doctor", "Engineer"
    this.ability = ability;         // For the character portraits
    this.health = 100;
    this.morale = 100;
    this.injury = 0.0;              // These will be values dependent on the
    this.sickness = 0.0;            // severity.
    this.speed = 1.0;               // How much they would move sled
    this.update = function() {
        // Some algorithm to update morale, health and speed
        // based on above.
    }
}

var characterPortraitHTML = $(
  '<div class="character-portrait">' +
    '<div class="photo"><img /></div>' +
    '<div class="status">Healthy</div>' +
    '<div class="ability"></div>' +
  '</div>'
);
