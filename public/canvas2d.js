import {MessageTypes, Message} from "./module/message.js";
import Module from "./module/module.js";
import ModuleNotification from "./module/notification.js";

export default class Canvas2D extends Module {
    notifications = [
        new ModuleNotification(MessageTypes.state, this.setObjects.bind(this)),
        new ModuleNotification(MessageTypes.setRenderStatus, this.setRenderStatus.bind(this)),
    ]

    constructor(htmlCanvas) {
        super()
        this.htmlCanvas = htmlCanvas
        this.context = htmlCanvas.getContext('2d')

        this.defaultObjectSize = 1

        this.screenWidth = htmlCanvas.width
        this.screenHeight = htmlCanvas.height

        this.requestAnimationID = null

        this.objects = []


        this.clickEvent = 'click'

        this.htmlCanvas.addEventListener(this.clickEvent, this.onClick.bind(this))

        this.addNotifications()
    }


    onClick(event) {
        this.notifyAll(new Message(MessageTypes.keydownStatus, {status: true}))
    }


    renderScreen() {

        this.drawObjects()

        this.requestAnimationID = requestAnimationFrame(this.renderScreen.bind(this))

    }

    drawObjects() {
        this.context.clearRect(0, 0, this.screenWidth, this.screenHeight)

        for (const object of this.objects) {

            this.drawObject(object)
        }
    }

    setObjects(message) {
        let state = message.content

        this.objects = Object.values(state.players).concat(Object.values(state.fruits))
    }

    setRenderStatus(message) {

        if (message.content.status) {
            this.renderScreen()
        } else
            this.stopRender()

    }

    stopRender() {

        console.warn(`stopping render`)

        cancelAnimationFrame(this.requestAnimationID)
    }


    drawObject(object2d) {
        const width = object2d.width ? object2d.width : this.defaultObjectSize
        const height = object2d.height ? object2d.height : this.defaultObjectSize
        this.context.fillStyle = object2d.color
        this.context.fillRect(object2d.x, object2d.y, width, height)
    }


}