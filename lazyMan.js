function LazyMan (name) {
  return new LazyManCtor(name)
}

function LazyManCtor (name) {
  this.name = name
  this.queue = []
  const fn = () => console.log(`Hi! This is ${this.name}!`)
  this.queue.unshift(fn)
  queueMicrotask(() => this.flushQueue())
}

LazyManCtor.prototype.flushQueue = function () {
  function composeAsync (queue) {
    const reverseQueue = queue.reverse()
    const firstFn = reverseQueue.shift()
    return (...args) => {
      reverseQueue.reduce((acc, cur) => {
        return acc.then(result => {
          return cur(result)
        })
      }, Promise.resolve(firstFn(args)))
    }
  }
  const queueFn = composeAsync(this.queue)
  queueFn()
}

LazyManCtor.prototype.eat = function (type) {
  const fn = () => {
    console.log(`Eat ${type}`)
  }
  this.queue.unshift(fn)
  return this
}

LazyManCtor.prototype.sleep = function (during) {
  const fn = () => new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Wake up after ${during}s`)
      resolve()
    }, during * 1000)
  })
  this.queue.unshift(fn)
  return this
}

LazyManCtor.prototype.sleepFirst = function (during) {
  const fn = () => new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Wake up after ${during}s`)
      resolve()
    }, during * 1000)
  })
  this.queue.push(fn)
  return this
}