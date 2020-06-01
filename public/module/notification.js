export default class ModuleNotification {
    messageType = null
    callback = null

    constructor(messageType, callback) {
        this.callback = callback
        this.messageType = messageType

    }

}