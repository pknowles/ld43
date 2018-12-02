let CHARACTERS = [
    { role: "Bard",            description: "A singer and musician who would boost everyone's morale."},
    { role: "Scout",           description: "Going ahead, he can see events a day or two ahead."},
    { role: "Cook",            description: "He can cook rather filling meals. What would last one meal would now last two."},
    { role: "Doctor",          description: "He can treat the injured and the sick. But physicians can only do so much..."},
    { role: "Navigator",       description: "Leading the group on the right path, he can get them to their desination faster."},
    { role: "Engineer",        description: "Efficiency is the name of the game. But long term gain requires upfront resources."},
    { role: "Mechanic",        description: "I fix things."},
    { role: "Leader",          description: "You."},
    { role: "Nurse",           description: "Two hands are better than one. Treatments will go better if the nurse is by the doc's side."},
    { role: "Apprentice",      description: "Two minds are better than one. Projects will more likely succeed if the apprentice is by the engineer's side."},
    { role: "Demolitionist",   description: "Blow things up to clear the path. But there's always a chance something could go wrong."},
    { role: "Counselor",       description: "Always willing to lend an ear to those in distress."},
    { role: "Guard",           description: "No need to fear attacks from animals. But in the end, he's human too."},
]

let ABILITIES = [
    { role: "Bard",            text: "Play some happy tunes",           duration: "one day", effects: [ Ability.addModifier(1.2, "Dancing is quicker than walking"), function (world, isActivating) { world.startBardMusic(isActivating) } ] },
    { role: "Scout",           text: "See what lies ahead",             duration: "instant", effects: [ function(world, isActivating) { world.displayUpcomingEvents() }] },
    { role: "Cook",            text: "Prepare human for consumption",   duration: "one day", effects: [ Ability.setGameVar('isFoodPrepared')] },
    { role: "Doctor",          text: "Heal a character",                duration: "instant", effects: [ Ability.chooseCharacter(function(world, character) { world.heal(character) }) ]},
    { role: "Navigator",       text: "Find a faster path",              duration: "one day", effects: [ Ability.addModifier(1.2, "Faster path found") ]},
    { role: "Engineer",        text: "Make a faster sled",              duration: "one day", effects: [ Ability.addModifier(1.2, "The sled has been modified for efficiency. It will now be easier to pull") ]},
    { role: "Mechanic",        text: "Fix things",                      duration: "one day", effects: [ Ability.usePlaceholder() ]},
    { role: "Nurse",           text: "Helps doctor",                    duration: "instant", effects: [ Ability.usePlaceholder() ]},
    { role: "Apprentice",      text: "Helps engineer",                  duration: "one day", effects: [ Ability.usePlaceholder() ]},
    { role: "Demolitionist",   text: "Make things go boom",             duration: "instant", effects: [ Ability.usePlaceholder() ]},
    { role: "Counselor",       text: "Makes people feel",               duration: "instant", effects: [ Ability.usePlaceholder() ]},
    { role: "Guard",           text: "Protects from animals",           duration: "one day", effects: [ Ability.usePlaceholder() ]}
]

$(function(){

    var game = new GameWorld();

    for (var i = 0; i < CHARACTERS.length; i++) {
        game.addCharacter(CHARACTERS[i]);
    }
    for (i = 0; i < ABILITIES.length; i++) {
        game.abilities.push(new Ability(ABILITIES[i].role, ABILITIES[i].text, ABILITIES[i].duration, ABILITIES[i].effects))
    }

    // Just an intro into the game. Introduces the cannabalism aspect...
    var input = document.getElementsByClassName('choice');
    var choice = 0;
    for (var i in TEXT_INTRO_CHOICES) {
        $("#main").append(TEXT_INTRO_CHOICES[i]);
        input[i].addEventListener('click', function() {
            $("#storyText").remove();
            var text = "<div id='storyText'>";
            if(choice > 2) {
            } else if (this.value == "Talk to your companions") {
                text += TEXT_INTRO_TALKING;
            } else if (this.value == "Stare into the distance desolately") {
                text += TEXT_INTRO_STARING;
            } else {
                text += TEXT_INTRO_THINKING;
            }
            if (choice == 0) {
                text += TEXT_INTRO_2;
                choice++;
            } else if (choice == 1) {
                text += TEXT_INTRO_3;
                choice++;
            } else if (choice == 2) {
                text += TEXT_INTRO_4;
                choice++;
            } else if (choice == 3) {
                text += TEXT_BEGIN;
                $(".choice").remove();
                game.display();
            }
            text += "</div>";
            $("#main").append(text);
        });
    }
    $("#main").append("<div id='storyText'>" + TEXT_INTRO + "</div>");
});
