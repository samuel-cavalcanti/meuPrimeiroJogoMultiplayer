class Message {
    constructor(type, content) {

        if (type && content) {
            this.type = type
            this.content = content
        } else
            console.warn(`error type: ${type} content: ${content} `)


    }

}

const Types = {
    move: 'move',
    setObjects: 'setObjects',
    state: 'state',
    disconnect: 'disconnect',
    connection: 'connection',
    connect: 'connect',
    keydown: 'Keydown',
    setRenderStatus: 'setRenderStatus',
    setup: 'setup',
    startRender: 'startRender',
    addPlayer: 'addPlayer',
    removePlayer: 'removePlayer',
    displayTable: 'displayTable',

}

export {Message, Types as MessageTypes}