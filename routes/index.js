var express = require('express');
var router = express.Router();


const {Builder, By} = require('selenium-webdriver')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/openDriver', function(req, res, next) {

  // 应用类型
  let type = req.query.type ? req.query.type : 'default'
  let step = req.query.step ? req.query.step : 0
  console.log('App Type===', type)

  const baseUrl = `file:///home/clouder/lab/electron/electron-embedded/build/linux-unpacked/resources/app.asar/dist/electron/index.html#/`
  const URLS = [
    `${baseUrl}`,
    `${baseUrl}embedded`,
    `${baseUrl}finish`,
  ]
  const EMBEDDED_URLS = {
    weibo: 'https://weibo.com/login.php',
    qq: 'https://www.qq.com',
    weixin: 'https://weixin.qq.com',
    facebook: 'https://baidu.com',
    default: '',
  }

  const browser = new Builder()
    .usingServer('http://localhost:9515') // "9515" 是ChromeDriver使用的端口
    .withCapabilities({
      chromeOptions: {
        // 设置Electron的路径
        // binary: '/home/clouder/lab/electron/express-server/node_modules/electron/dist/electron',
        binary: '/home/clouder/lab/electron/electron-embedded/build/linux-unpacked/hard-implant',
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      }
    })
    .forBrowser('electron')
    // .forBrowser('chrome')
    .build()

  browser.get(URLS[step])

  // 植入引导第1步
  if(step == 1) {
    setTimeout(() => {
      browser.getAllWindowHandles().then(function (handleList) {
        console.log('窗口列表===', handleList)
        if(handleList.length === 2) {
          let handle = handleList[handleList.length - 1]
          browser.switchTo().window(handle).then(() => {
            browser.getWindowHandle().then((handle) => {
              browser.get(EMBEDDED_URLS[type])
            })
          })
        }
      })
    }, 3000)
  }

  res.send({
    status: 'success'
  })
})

module.exports = router;
