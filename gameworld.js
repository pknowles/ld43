var GameWorld = function(){
    this.characters = [];
    this.abilities = [];
    this.sledDistance = 10.0;
    this.foodReserves = 0.0;
    this.nextDayElement = $('<div id="next-day"><div id="next-day-btn" class="center">Advance Day</div></div>');
    this.events = events; // FIXME: global
    this.permanentModifiers = [];
    this.todaysModifiers = [];

    this.musicMain = new Howl({ src: 'Sacrifice.mp3' })
    this.musicBard = new Howl({ src: 'Sacrifice_Bard.mp3' })
    this.musicMainId = undefined;
    this.musicBardId = undefined;

    this.getDailyMoveDistance = function() {
        var distance = 0.0;
        for (var i in this.characters) {
            if (this.characters[i].injured) {
                // Injured people take effort to carry
                distance -= 0.05;
            } else if (!this.characters[i].activeAbility) {
                // Every character not doing other things adds speed
                distance += this.characters[i].speed;
            }
        }

        for (var i in this.permanentModifiers) {
            distance *= this.permanentModifiers[i].scale;
        }
        for (var i in this.todaysModifiers) {
            distance *= this.todaysModifiers[i].scale;
        }
        return distance;
    }

    this.endOfDayCallbacks = []

    this.getCharacter = function(role) {
        for (var i in this.characters) {
            if (this.characters[i].role == role) {
                return this.characters[i];
            }
        }
        return null;
    }

    this.showAdvanceDay = function() {
        // Show advance day button
        if (!this.nextDayElement.parent().length) {
            var game = this;
            $("#game #main").append(this.nextDayElement);
            $("#next-day-btn").click(function(){
                game.nextDayElement.remove();
                game.advanceDay();
                $("#storyText").remove();
            });
        }
    }

    this.endOfDay = function() {
        this.sledDistance -= this.getDailyMoveDistance();

        if (this.sledDistance <= 0) {
            alert("Good job. You guys made it to the rendezvous point. The rescue team got to you. Next time, don't be drunk when signing up for an expedition to Antarctica.");
        }

        this.todaysModifiers = [];

        this.endOfDayCallbacks.forEach(function (cb) { cb(); });
        this.endOfDayCallbacks = []

        this.foodReserves -= 1.0;
        if (this.foodReserves < 0.0) {
            this.foodReserves = 0.0;
            // Half of everyone dies
            var dead = Math.ceil(this.characters.length / 2);
            while (dead > 0) {
                dead -= 1;
                var character = this.characters[Math.floor(Math.random() * this.characters.length)];
                this.killCharacter(character);
            }
        }

        this.showAdvanceDay();

        this.display();
    }

    this.addCharacter = function(character) {
        var i = this.characters.length;
        this.characters.push(new Character(this, character.role, character.description));
        this.characters[i].display();
        var coll = document.getElementsByClassName("collapsible");
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }

    this.killCharacter = function(character) {
        console.log(`${character.role} died`);
        this.characters.splice( $.inArray(character, this.characters), 1 );
        character.kill();
        if (this.characters.length == 0) {
            // FIXME: better popup!
            alert("Game over. Everyone is dead");
        }
    }

    this.eatCharacter = function(character) {
        this.killCharacter(character);
        if (this.getCharacter("Cook")) {
            this.foodReserves += 2.0;
        } else {
            this.foodReserves += 1.0;
        }
        this.display();
    }

    this.advanceDay = function() {
        this.playMusic();
        console.log(this)

        var totalOutcome = 0.0;
        for (var i in this.events) {
            totalOutcome += this.events[i].probabilityFactor;
        }
        var outcome = totalOutcome * Math.random();
        for (var i in this.events) {
            outcome -= this.events[i].probabilityFactor;
            if (outcome <= 0.0) {
                this.events[i].perform.bind(this.events[i])(this, this.endOfDay.bind(this));
                return;
            }
        }

        // should not happen
        debugger;
    }

    this.showPopup = function(title, message, callback) {
        var popup = $(`<div class="popup"><h1 class="popup-title">${title}</h1><p>${message}</p><div class="button-close">Close</div></div>`);
        var gameElement = $("#game #main");
        gameElement.append(popup);
        popup.find('.button-close').click(function(){
            popup.remove();
            callback();
        });
    }

    this.display = function() {

        for (var i in this.characters) {
            this.characters[i].display();
        }

        for (var i in this.abilities) {
            this.abilities[i].display(this);
        }

        var statsText = "";
        if (this.getCharacter("Navigator")) {
            var daysLeft = Math.max(1.0, Math.round((this.sledDistance / this.getDailyMoveDistance() + Math.random() - 0.5) * 10.0) / 10.0);
            statsText += `Estimated days left: ${daysLeft}<br/>`;
        } else {
            statsText += "Without a navigator you are not sure how close you are to rescue.<br/>"
        }

        statsText += `Days of food left: ${this.foodReserves}<br/>`;

        var numCharsPullingSled = 0;
        for (var i in this.characters) {
            if (!this.characters[i].activeAbility) {
                numCharsPullingSled += 1;
            }
        }
        statsText += `Characters pulling the sled: ${numCharsPullingSled}<br/>`;

        // FIXME: just for debugging
        if (0) {
            statsText += `Distance: ${this.sledDistance}<br/>
            Permanent Modifiers: ${JSON.stringify(this.permanentModifiers)}<br/>
            Todays Modifiers: ${JSON.stringify(this.todaysModifiers)}<br/>
            `
        }

        if (statsText.length == 0) {
            statsText = "Nobody knows anything useful."
        }
        $("#stats").html(statsText);
    };

    this.playMusic = function() {
        if (this.musicMainId === undefined)
            this.musicMainId = this.musicMain.play()
    }

    this.startBardMusic = function (shouldStart) {
        if (this.musicBardId === undefined)
            this.musicBardId = this.musicBard.play();

        var a, b, idA, idB;
        if (shouldStart) {
            a = this.musicMain; idA = this.musicMainId
            b = this.musicBard; idB = this.musicBardId
        } else {
            a = this.musicBard; idA = this.musicBardId
            b = this.musicMain; idB = this.musicMainId
        }
        a.fade(1, 0, 1000, idA)
        b.fade(0, 1, 1000, idB)
    }
}
