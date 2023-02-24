window.Whiteboard = function (options, toolSelect) {
  const id = options.id || UUID()

  // options: lineColour, canvasWidth, canvasHeight
  var that = {
    lineColour: options.lineColour,
  }

  // then we are going to draw into special canvas element
  var canvas = document.createElement('canvas')
  canvas.width = options.canvasWidth
  canvas.height = options.canvasHeight

  // created canvas we can add to layer as "Konva.Image" element
  var image = new Konva.Image({
    image: canvas,
    x: 0,
    y: 0,
  })

  // Good. Now we need to get access to context element
  var context = canvas.getContext('2d')
  context.lineJoin = 'round'
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // erase is just painting on top of the existing canvas
  // with the same colour as the background (not sophisticated)
  context.globalCompositeOperation = 'source-over'

  var isPaint = false
  var lastPointerPosition
  var mode = 'brush'
  var commands = []

  var line = function (fromPos, toPos, brushWidth, colour) {
    context.lineWidth = brushWidth
    context.strokeStyle = colour
    context.beginPath()
    context.moveTo(fromPos.x, fromPos.y)
    context.lineTo(toPos.x, toPos.y)
    context.closePath()
    context.stroke()

    // redraw manually
    layer.batchDraw()
  };

  // all drawing commands are funnelled through here
  that.draw = function (command, fireEvent) {
    commands.push(command)

    if (fireEvent === undefined) {
      fireEvent = false
    }

    if (command.type === 'line') {
      line(command.fromPos, command.toPos, command.brushWidthPx, command.colour)
    }

    if (fireEvent) {
      that.fire('whiteboard:draw', command)
    }
  };

  var capturePointerMovements = function () {
    if (!isPaint) {
      return
    }

    var fromPos = {
      x: lastPointerPosition.x - image.x(),
      y: lastPointerPosition.y - image.y(),
    }

    var currentPointerPosition = stage.getPointerPosition();
    var toPos = {
      x: currentPointerPosition.x - image.x(),
      y: currentPointerPosition.y - image.y(),
    }

    var time = new Date()

    var command = {
      origin: id,
      time: time,
      type: 'line',
      fromPos: fromPos,
      toPos: toPos,
      brushWidthPx: 5,
      colour: options.lineColour,
    }

    if (mode === 'eraser') {
      command.colour = context.fillStyle
    }

    if (!['brush', 'eraser'].includes(mode)) {
      return
    }

    that.draw(command, true)

    lastPointerPosition = currentPointerPosition
  }

  // now we need to bind some events
  // we need to start drawing on mousedown
  // and stop drawing on mouseup
  image.on('mousedown touchstart', function () {
    isPaint = true
    lastPointerPosition = stage.getPointerPosition()
  })

  image.on('mouseup touchend', function () {
    isPaint = false
  })

  // and core function - drawing
  image.on('mousemove touchmove', capturePointerMovements)

  // if the pointer moves out of the image, draw to the
  // exit point then stop drawing
  image.on('mouseout', function () {
    capturePointerMovements()
    isPaint = false
  })

  if (toolSelect !== undefined) {
    toolSelect.addEventListener('change', function () {
      mode = toolSelect.value
    })
  }

  that = Object.assign(
    that,
    {
      elt: image,
    },
    window.EventCapable
  )

  return that
}