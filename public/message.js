class Message {
    constructor(type, content) {

        if (type && content) {
            this.type = type
            this.content = content
        } else
            throw (`error type: ${type} content: ${content} `)


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
    requestAnimationId: 'requestAnimationId',
    setup: 'setup',
    startRender:'startRender'

}

export {Message, Types as MessageTypes}