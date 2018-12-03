
var Ability = function(role, text, duration, effects) {
    this.role = role;
    this.text = text;
    this.duration = duration;
    this.effects = effects;
    this.isActive = false;

    this.applyEffects = function(world, isActivating) {
        console.log(`Ability:'${this.text}' - Applying effects; isActivating=${isActivating}`);
        this.isActive = isActivating;
        this.effects.forEach(function (effect) {
            effect(world, isActivating)
        })
    }

    this.apply = function(world) {
        if (this.isActive)
            return;

        // instantaneous
        this.applyEffects(world, true);
        if (this.duration == 'instant') {
            this.applyEffects(world, false);
        }
        else if (this.duration == 'one day') {
            world.endOfDayCallbacks.push(
                function() { this.applyEffects(world, false) }.bind(this)
            )
        }
        else
            window.alert(`unhandled ability duration: ${this.duration}`)

        this.display(world);
        world.display()
    }

    this.display = function(world) {
        var ability = this;
        $(`#${role} .ability`)
            .html(this.text)
            .css('color', this.isActive ? 'red' : 'green')
            .click(function() { this.apply(world) }.bind(this) )
    }
};


Ability.setGameVar = function(varName) { return function (world, isActivating) {
    world[varName] = isActivating
}}

Ability.chooseCharacter = function(callback) { return function (world, isActivating) {
    if (isActivating) {
        callback('Bard')
    }
}}

Ability.addModifier = function(scale, description) { return function (world, isActivating) {
    if (isActivating)
        world.todaysModifiers.push(new Modifier(scale, description))
}}

Ability.usePlaceholder = function() { return function (world, isActivating) {
}}