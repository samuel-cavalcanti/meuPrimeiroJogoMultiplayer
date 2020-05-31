import Player from "./player.js";
import Fruit from "./fruit.js";
import {Message, MessageTypes} from "./public/message.js";
import Observer from "./public/observer.js";
import Observable from "./public/observable.js";
import {v4 as uuidv4} from 'uuid'

export default class Game {

    constructor() {
        this.players = {}
        this.fruits = {}
        this.size = {x: 10, y: 10}
        this.fruitsCurrentId = 0
        this.pixelSize = 1
        this.matrix = this.createMatrix()
        this.types = {
            fruit: 'fruit',
            player: 'player',
            fruits: 'fruits',
            players: 'players'
        }

        this.observable = new Observable()
        this.observers = new Observer()

        this.addObservers()
    }

    start = function () {
        this.addFruit()

        // setInterval(this.addFruit.bind(this), 2000)
    }

    addObservers() {
        this.observers.add(MessageTypes.addPlayer, this.addPlayer.bind(this))
        this.observers.add(MessageTypes.move, this.movePlayer.bind(this))
        this.observers.add(MessageTypes.removePlayer, this.removePlayer.bind(this))
    }


    getState() {

        return {
            players: this.players,
            fruits: this.fruits
        }
    }


    movePlayer(message) {
        const id = message.content.id
        const command = message.content.command


        if (this.players[id] && this[`moveTo${command.toUpperCase()}`] !== undefined) {
            this[`moveTo${command.toUpperCase()}`](id)
        } else
            console.warn(`Player ${id} or ${command} not found`)

    }

    addPlayer(message) {
        let player = this.players[message.content.id]

        if (player && !message.content.id)
            return


        player = this.createPlayer(message.content.id)

        this.occupySpace(player.x, player.y, this.types.player, player.id)

        this.addToObject(player.id, this.types.players, player)

        console.log(`add new Player id:${player.id}`)
    }

    removePlayer(message) {

        const id = message.content.id

        const player = this.players[id]

        if (!player)
            return

        this.observable.unsubscribe(id)

        this.freeSpace(player.x, player.y)
        this.removeFromObject(id, this.types.players)

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
        const pos = this.randPos()
        return new Player(id, pos.x, pos.y)
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
        this.observable.notifyAll(new Message(MessageTypes.state, this.getState()))
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
            pos = this.randPos()


        this.fruitsCurrentId++

        return new Fruit(id, pos.x, pos.y)
    }

    addFruit() {

        const fruit = this.createFruit(this.fruitsCurrentId)

        this.occupySpace(fruit.x, fruit.y, this.types.fruit, fruit.id)

        this.addToObject(fruit.id, this.types.fruits, fruit)
    }

    removeFruit(id) {
        console.log(`removeFruit`)
        console.log(id, this.fruits)
        this.freeSpace(this.fruits[id].x, this.fruits[id].y)
        this.removeFromObject(id, this.types.fruits)
    }


    occupySpace(i, j, type, id) {
        this.matrix[i][j] = `${type}-${id}`
    }

    freeSpace(i, j) {
        this.matrix[i][j] = null
    }

    checkFruitCollision(player) {

        const space = this.matrix[player.x][player.y]

        if (!space)
            return

        const split = space.split('-')
        if (split[0] === this.types.fruit) {
            this.removeFruit(split[1])
            player.score++
        }

    }

    //moves

    moveAxis(id, axis, dist) {
        let player = this.players[id]
        const pos = player[axis] + dist

        if (this.size[axis] <= pos || pos < 0)
            return

        this.freeSpace(player.x, player.y)

        this.players[id][axis] = pos

        this.checkFruitCollision(player)
        this.occupySpace(player.x, player.y, this.types.player)
        this.notifyState()


    }

    moveToUP(id) {
        this.moveAxis(id, 'y', -this.pixelSize)
    }

    moveToDOWN(id) {
        this.moveAxis(id, 'y', this.pixelSize)
    }

    moveToLEFT(id) {
        this.moveAxis(id, 'x', -this.pixelSize)
    }

    moveToRIGHT(id) {
        this.moveAxis(id, 'x', this.pixelSize)
    }

}