import Player from "./player.js";
import Fruit from "./fruit.js";
import {Message, MessageTypes} from "./public/module/message.js";
import {v4 as uuidV4} from 'uuid'
import Module from "./public/module/module.js";
import ModuleNotification from "./public/module/notification.js";

export default class Game extends Module {

    notifications = [
        new ModuleNotification(MessageTypes.gameCommands.move, this.movePlayer.bind(this)),
        new ModuleNotification(MessageTypes.gameCommands.changeNick, this.changePlayerNick.bind(this)),
        new ModuleNotification(MessageTypes.gameCommands.addPlayer, this.addPlayer.bind(this)),
        new ModuleNotification(MessageTypes.gameCommands.removePlayer, this.removePlayer.bind(this)),
    ]
    types = {
        fruits: 'fruits',
        players: 'players'
    }
    features = {
        removePlayer: MessageTypes.gameCommands.removePlayer,
        addPlayer: MessageTypes.gameCommands.addPlayer,
        changePlayerNick: MessageTypes.gameCommands.changeNick,
        addFruit: 'addFruit',
        removeFruit: 'removeFruit',
        collisionPlayer: 'collisionPlayer',
        audio: MessageTypes.audio,
        stages: {
            easy: this.easy.bind(this),
            puzzle: this.puzzleStage.bind(this),
            finalBattle: this.finalBattle.bind(this),
            gameOver: this.gameOver.bind(this)
        }
    }

    axis = {
        x: 'x',
        y: 'y'
    }

    constructor() {
        super()
        this.players = {}
        this.fruits = {}
        this.intervals = {
            fruits: null,
            stage: null
        }
        this.size = {x: 10, y: 10}
        this.pixelSize = 1
        this.matrix = this.createMatrix()


        this.__ID = uuidV4();

        this.state = {
            players: this.players,
            fruits: this.fruits,
        }

        this.stage = this.features.stages.easy

        this.addNotifications()


    }


    start() {

        this.addFruit()

        this.stage()

        this.intervals.stage = setInterval(() => {
            this.stage()
        }, 37000)

    }


    easy() {
        console.log(`staring Easy stage`)
        this.addToState(MessageTypes.audio.playAudio, MessageTypes.audio.marimba)
        clearInterval(this.intervals.fruits)
        this.intervals.fruits = setInterval(this.addFruit.bind(this), 4000)
        this.stage = this.features.stages.puzzle
    }

    puzzleStage() {
        console.log(`staring Puzzle stage`)
        this.addToState(MessageTypes.audio.playAudio, MessageTypes.audio.solveThePuzzle)
        this.confuseControls(true)
        clearInterval(this.intervals.fruits)
        this.intervals.fruits = setInterval(this.addFruit.bind(this), 2500)
        this.stage = this.features.stages.finalBattle
    }

    finalBattle() {
        console.log(`staring final Battle stage`)
        this.addToState(MessageTypes.audio.playAudio, MessageTypes.audio.battle)
        this.confuseControls(false)
        clearInterval(this.intervals.fruits)
        this.intervals.fruits = setInterval(this.addFruit.bind(this), 1000)

        this.stage = this.features.stages.gameOver
    }

    gameOver() {
        console.log(`game is Over`)
        clearInterval(this.intervals.fruits)
        clearInterval(this.intervals.stage)
    }

    addToState(key, value) {
        this.state[key] = value
    }

    getState() {

        const currentState = this.state

        this.state = { // reset state
            players: this.players,
            fruits: this.fruits
        }


        return currentState
    }


    movePlayer(message) {
        const id = message.content.id
        const command = message.content.command


        if (this.players[id] && this[`moveTo${command.toUpperCase()}`]) {
            this[`moveTo${command.toUpperCase()}`](id)
        } else
            console.warn(`Player ${id} or ${command} not found`)

    }

    addPlayer(message) {

        let player = this.players[message.content.id]

        if (player && !message.content.id)
            return


        player = this.createPlayer(message.content.id)

        if (!player)
            return

        this.addToState(this.features.addPlayer, true)

        this.occupySpace(player.x, player.y, player.id)

        this.addToObject(player.id, this.types.players, player)

        // this.start()
        this.features.stages.puzzle()

        console.log(`add new Player id:${player.id}`)
    }

    removePlayer(message) {

        const socketModule = message.content.socketModule

        const playerID = socketModule.socket.id

        const player = this.players[playerID]

        if (!player)
            return

        socketModule.unsubscribe(this) // === this.subscribers.removeSubscribe(socketModule.__ID)

        this.addToState(this.features.removePlayer, true)

        this.freeSpace(player.x, player.y)
        this.removeFromObject(playerID, this.types.players)

    }

    changePlayerNick(message) {
        const id = message.content.id
        const newNick = message.content.nick

        if (this.players[id])
            this.players[id].nick = newNick


        this.notifyState()
    }


    randPos() {
        return {
            x: Math.floor(Math.random() * this.size.x),
            y: Math.floor(Math.random() * this.size.y)
        }
    }

    createMatrix() {
        let matrix = []
        for (let i = 0; i < this.size.x; i++) {
            let row = []
            for (let j = 0; j < this.size.y; j++) {
                row.push(null)
            }
            matrix.push(row)
        }

        return matrix
    }

    createPlayer(id) {
        const pos = this.availablePos()
        return pos ? new Player(id, pos.x, pos.y) : null
    }


    addToObject(id, object, item) {
        this[object][id] = item

        this.notifyState()
    }

    removeFromObject(id, object) {
        if (this[object][id])
            delete this[object][id]

        this.notifyState()
    }

    notifyState() {
        this.notifyAll(new Message(MessageTypes.gameCommands.state, this.getState()))
    }


    availablePos() {
        let availablePositions = []
        for (let i = 0; i < this.size.x; i++)
            for (let j = 0; j < this.size.y; j++)
                if (this.matrix[i][j] == null)
                    availablePositions.push({x: i, y: j})


        return availablePositions[Math.floor(Math.random() * (availablePositions.length - 1))]
    }

    createFruit(id) {
        let pos = this.availablePos()

        if (!pos)
            return

        return new Fruit(id, pos.x, pos.y)
    }

    addFruit() {

        const fruit = this.createFruit(uuidV4())

        if (!fruit)
            return

        this.occupySpace(fruit.x, fruit.y, fruit.id)

        this.addToState(this.features.addFruit, true)

        this.addToObject(fruit.id, this.types.fruits, fruit)
    }

    removeFruit(id) {
        console.log(`removeFruit`, this.fruits[id])
        this.freeSpace(this.fruits[id].x, this.fruits[id].y)
        this.removeFromObject(id, this.types.fruits)
    }


    occupySpace(i, j, id) {
        this.matrix[i][j] = id
    }

    freeSpace(i, j) {
        this.matrix[i][j] = null
    }

    checkCollision(player) {

        const id = this.matrix[player.x][player.y]

        if (!id)
            return false

        return id


    }

    //moves

    moveAxis(id, axis, dist) {
        let player = this.players[id]
        const pos = player[axis] + dist

        if (this.size[axis] <= pos || pos < 0)
            return

        let oldPos = {
            x: player.x,
            y: player.y
        }


        player[axis] = pos

        const collisionID = this.checkCollision(player)

        if (!collisionID) {
            this.freeSpace(oldPos.x, oldPos.y)
            this.occupySpace(player.x, player.y, player.id)

        } else if (this.fruits[collisionID]) {
            this.collisionFruit(player, collisionID)
            this.freeSpace(oldPos.x, oldPos.y)
            this.occupySpace(player.x, player.y, player.id)
        } else {
            this.collisionPlayer(player, collisionID)
            player.x = oldPos.x
            player.y = oldPos.y
        }


        this.notifyState()


    }


    collisionFruit(player, collisionID) {
        this.addToState(this.features.removeFruit, player)
        this.removeFruit(collisionID)
        player.score++
    }

    collisionPlayer(player, collisionID) {
        let players = {}
        players[player.id] = collisionID
        players[collisionID] = collisionID

        this.addToState(this.features.collisionPlayer, players)
    }

    confuseControls(confuse) {

        if (confuse) {

            const confuseAll = this.buildConfusion()

            console.log(confuseAll)

            this.confuseAxis(confuseAll.confuseAxis)
            this.confuseDirection(confuseAll.confuseDirection)
        } else {
            this.confuseAxis(false)
            this.confuseDirection(false)
        }


    }

    buildConfusion() {
        let confuseAxis = Math.round(Math.random()) === 0
        let confuseDirection = Math.round(Math.random()) === 0

        while (!confuseAxis && !confuseDirection) {
            confuseAxis = Math.round(Math.random()) === 0
            confuseDirection = Math.round(Math.random()) === 0
        }

        return {
            confuseDirection,
            confuseAxis
        }
    }


    confuseAxis(confuse) {
        if (confuse) {
            this.axis.x = 'y'
            this.axis.y = 'x'
        } else {
            this.axis.x = 'x'
            this.axis.y = 'y'
        }

    }

    confuseDirection(confuse) {
        if (confuse)
            this.pixelSize = -1
        else
            this.pixelSize = 1

    }

    moveToUP(id) {
        this.moveAxis(id, this.axis.y, -this.pixelSize)
    }

    moveToDOWN(id) {
        this.moveAxis(id, this.axis.y, this.pixelSize)
    }

    moveToLEFT(id) {
        this.moveAxis(id, this.axis.x, -this.pixelSize)
    }

    moveToRIGHT(id) {
        this.moveAxis(id, this.axis.x, this.pixelSize)
    }

}