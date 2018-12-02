function characterPortraitHTML(role, description, health, morale) {
    return `<div class='character' id='${role}'>
        <button class='collapsible'>${role}</button>
        <div class='content'>
            <p>${description}</p>
            <p>Health: ${health}</p>
            <p>Morale:${morale}</p>
            <p>Ability:<span class="ability" /> </p>
        </div>
    </div>`;
}

var Character = function(role, description) {
    this.role = role;               // i.e. "Doctor", "Engineer"
    this.description = description; // For the character portraits
    this.health = 100;
    this.morale = 100;
    this.injured = false;           // These will be values dependent on the
    this.sickness = false;          // severity.
    this.speed = 0.1;               // How much they would move sled
    this.activeAbility = false;     // Set before advancing the day. If false, this character will pull the sled.
    this.eaten = false;
    //this.portrait = $("#game #characters").append(characterPortraitHTML(role, description, this.health, this.morale));
    this.update = function(injured, sickness) {
        this.injured = injured;
        this.sickness = sickness;
        this.health -= injured ? 5 : 0;
        this.health -= sickness ? 5 : 0;
        this.morale -= injured ? 5 : 0;
        this.morale -= sickness ? 5 : 0;
        this.speed = injured ? 0 :
                sickness ? 0.05 :
                0.1;
    }
    this.display = function() {
        if (!this.eaten && (this.health > 0)) {
            $("#game #characters").append(characterPortraitHTML(this.role, this.description, this.health, this.morale));
        }
    }
};
