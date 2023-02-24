// runs locally to relay events; any event notifications from the event bus
// are relayed to attached whiteboards; any events fired
// by attached whiteboards are relayed to the event bus;
// the event bus handles communication with remote whiteboards via the server
window.DrawEventRelay = function (eventBus) {
    var that = {}

    var whiteboards = []

    // when the event bus fires a notification of a draw event,
    // send it to all whiteboards attached to this relay
    // (providing the command came from a different whiteboard)
    eventBus.on('eventbus:notify', function (commandsReceived) {
        if (!Array.isArray(commandsReceived)) {
            commandsReceived = [commandsReceived]
        }

        commandsReceived.forEach(function (command) {
            whiteboards.forEach(function (whiteboard) {
                if (whiteboard.id !== command.origin) {
                    whiteboard.draw(command)
                }
            })
        })
    })

    // attach to a whiteboard; any draw events sent by that
    // whiteboard are passed to the event bus' notify() function
    // so that they can be forwarded to other whiteboards
    that.attach = function (whiteboard) {
        if (!whiteboards.includes(whiteboard)) {
            whiteboards.push(whiteboard)
            whiteboard.on('whiteboard:draw', eventBus.enqueue)
        }
    }

    return that
}
