function characterPortraitHTML(role, description) {
    return `<div class='character' id='${role}'>
        <button class='collapsible'>${role}</button>
        <div class='content'>
            <p>${description}</p>
            <p>Injured: <span class="injured">No</span></p>
            <p>Ability:<span class="ability" /> </p>
            <p><span class="eat">Eat the ${role}</span></p>
        </div>
    </div>`;
}

var Character = function(gameworld, role, description) {
    this.role = role;               // i.e. "Doctor", "Engineer"
    this.description = description; // For the character portraits
    this.health = 100;
    this.morale = 100;
    this.injured = false;              // These will be values dependent on the
    this.sickness = 0.0;            // severity.
    this.speed = 0.1;               // How much they would move sled
    this.activeAbility = false;     // Set before advancing the day. If false, this character will pull the sled.
    this.portrait = $(characterPortraitHTML(role, description, this.health, this.morale));
    $("#game #characters").append(this.portrait);

    $(`#${this.role} .eat`).click(function(){gameworld.eat(this);});

    this.update = function() {
        // Some algorithm to update morale, health and speed
        // based on above.
    }
    this.display = function() {
        $("#${this.role} .injured").text(this.injured ? "Yes" : "No");
    }
    this.kill = function() {
        this.portrait.remove();
    }
};
