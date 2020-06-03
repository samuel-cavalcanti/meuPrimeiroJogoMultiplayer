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

    network: {
        disconnect: 'disconnect',
        connection: 'connection',
        connect: 'connect',
    },

    keyboard: {
        keydown: 'keydown',
        keyup: 'keyup',
        keydownStatus: 'keydownStatus',
    },

    gameCommands: {
        move: 'move',
        state: 'state',
        addPlayer: 'addPlayer',
        removePlayer: 'removePlayer',
        changeNick: 'changeNick',
    },

    render:{
        setObjects: 'setObjects',
        startRender: 'startRender',
        setRenderStatus: 'setRenderStatus',
    },

    audio:{
        playAudio: 'playAudio',
        battle: 'battle',
        collect: 'collect',
        marimba: 'marimba',
        solveThePuzzle: 'solveThePuzzle',
    },


}


export {Message, Types as MessageTypes}