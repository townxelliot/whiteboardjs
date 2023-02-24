window.UUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-Nxxx-xxxxxxxxxxxx'.replace(/[xN]/g, function (match) {
        var r = Math.random() * 16|0
        return (match === 'x' ? r : (r&0x3|0x8)).toString(16)
    })
}
