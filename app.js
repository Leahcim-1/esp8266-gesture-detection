const Koa = require('koa')
const Router = require('koa-router')
const DBService =  require('./db')
const fs = require('fs')
const BodyParser = require('koa-body')
const path = require('path')
const app = new Koa()
const router = new Router()

const env = process.env.NODE_ENV
const HOST = env === 'dev' ? '127.0.0.1' : '0.0.0.0'
const PORT = 1234

const connInfoFilePath = path.resolve(__dirname, 'db-config.json')
if (!fs.existsSync(connInfoFilePath)) throw new Error("You need to config database connection info")
const connInfo = require('./db-config.json')
const db = new DBService(connInfo)



app.use(async (ctx, next) => {
    console.log(ctx.method, ctx.URL.pathname)
    await next()
})

app.use(BodyParser())

router.get('/', ctx => {
    ctx.body = 'hello'
})

router.get('/api/acc', async ctx => {
    const { x = '', y = '', z = '' } = ctx.query;
    if (
        !x ||
        !y ||
        !z 
    ) {
        ctx.status = 400
        ctx.body = 'Invalid'
        return
    }

    console.log("---- Acc Data ----")
    console.log("X: ", x)
    console.log("Y: ", y)
    console.log("Z: ", z)
    console.log("------------------\n")

    ctx.body = 'OK'

    await db.insert('acc_data', [{
        x,
        y,
        z,
        time: (new Date()).getTime()
    }])
})

router.post('/api/acc', async (ctx) => {
    const { data_set } = ctx.request.body
    ctx.body = 'OK'
    await db.insert('acc_data', [{ data_set }])
    console.log(data_set)
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, HOST, () => {
    console.log('\n')
    console.log('-'.repeat(50))
    console.log('\nAccelerometer Service')
    console.log('\nThis is Bender, the bending machine.\n')
    console.log(`Your damn server is starting at http://${HOST}:${PORT}\n`)
    console.log('-'.repeat(50))
  })
  