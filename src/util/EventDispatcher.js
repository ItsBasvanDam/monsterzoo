class EventDispatcher {
    constructor() {
        if (!EventDispatcher.eventDispatcher) {
            this.events = {};
            EventDispatcher.eventDispatcher = this;
        }
        return EventDispatcher.eventDispatcher;
    }

    addListener(event, callback) {
        if (this.events[event] === undefined) {
            this.events[event] = {
                listeners: []
            };
        }
        this.events[event].listeners.push(callback);
    }

    dispatch(event, data) {
        if (this.events[event] === undefined) {
            console.error(`Event "${event}" does not exist`);
            return false;
        }
        this.events[event].listeners.forEach(listener => {
            listener(data);
        });
    }

    clearListeners(event) {
        if (this.events[event] === undefined) {
            return;
        }
        delete this.events[event];
    }
}

const eventDispatcher = new EventDispatcher();
Object.freeze(eventDispatcher);

export default eventDispatcher;
