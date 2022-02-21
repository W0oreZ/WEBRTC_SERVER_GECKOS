const streamElement = document.getElementById("peer-stream");

const channel = geckos({
    port: 3030
})

channel.onConnect(function (error) {
    if (error) {
        console.error(error.message)
        return
    } else {
    
        console.log("You're connected!")
    }

    channel.on('stream', streamImage => {
        streamElement.src = `data:image/jpeg;base64,${streamImage}`;
    })

    channel.emit('chat message', "Hello everyone, I'm " + channel.id)

    channel.onDisconnect(function () {
        console.log('You got disconnected')
    })

    channel.on('chat message', function (data) {
        console.log("Received : " + data)
    })
})