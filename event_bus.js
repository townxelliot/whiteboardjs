// distribute drawing events across whiteboards
window.LocalEventBus = function () {
    var that = {}

    // all commands enqueued; useful for clients that
    // want to sync to the current state if they join late
    var queue = []

    // give the bus a command to send out to other relays;
    // TODO in the network-capable implementation,
    // will need to hook up enqueue to the central server,
    // so that websocket pushes to this event bus will enqueue
    // the command and trigger eventbus:notify events
    // to be picked up by attached relays
    that.enqueue = function (command) {
        // add to the full queue
        queue.push(command)

        // fire an event
        that.fire('eventbus:notify', command)

        // TODO "fire the event" over the network to
        // the central server
    };

    return Object.assign(that, window.EventCapable)
}
