
var GameWorld = function(){
    this.characters = [];
    this.sledDistance = 10.0;
    this.nextDayElement = $('<div id="next-day"><div id="next-day-btn" class="center">Advance Day</div></div>');
    this.events = events; // FIXME: global

    this.getCharacter = function(role) {
        for (var i in this.characters) {
            if (this.characters[i].role == role) {
                return this.characters[i];
            }
        }
        return null;
    }

    this.advanceDay = function() {
        var totalOutcome = 0.0;
        for (var i in this.events) {
            console.log(i);
            totalOutcome += this.events[i].probabilityFactor;
        }
        var outcome = totalOutcome * Math.random();
        for (var i in this.events) {
            outcome -= this.events[i].probabilityFactor;
            if (outcome <= 0.0) {
                this.events[i].perform();
            }
        }

        // should not happen
        debugger;
    }

    this.display = function() {
        for (var i in this.characters) {
            this.characters[i].display();
        }

        var statsText = "";
        if (this.getCharacter("navigator")) {
            statsText += "Estimated days left"
        }
        if (statsText.length == 0) {
            statsText = "Nobody knows anything useful."
        }
        $("#stats").text(statsText);

        if (!this.nextDayElement.parent().length) {
            $("#game").append(this.nextDayElement);
            $("#next-day-btn").click(this.advanceDay);
        }
    };
}
