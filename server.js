const express = require('express')
const bodyParser = require('body-parser')
const rp = require('request-promise')
const request = require('request')
const cheerio = require('cheerio')

const config = {
  googleApiKey: 'AIzaSyC3iWzi2JUstwfZXTjqkNMiURQ74RpTizE',
}


const app = express()

app.use(bodyParser.json())

const geocode = (req, res, next) => {
  const encoded = encodeURIComponent(req.params.city)

  const uri = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.googleApiKey}&address=${encoded}`

  rp({
    uri,
    json: true
  })
    .then(res => {
      if (res.status === 'OK') {

        req.middlewareData = {
          lat: res.results[0].geometry.location.lat,
          long: res.results[0].geometry.location.lng
        }

        next()

      } else {
        res.status(401).json({
          message: 'wrong input'
        }).end()
      }
    })
    .catch(e => console.log(e))
}


app.get('/weather/:city', geocode, (req, res) => {
  const lat = req.middlewareData.lat
  const long = req.middlewareData.long

  const url = `https://yandex.kz/pogoda/?lat=${lat}&lon=${long}`;

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);


      var json = {
        temp: "",
        desc: ""
      };


      $('.fact__temp').filter(function () {
        const data = $(this)

        json.temp = data.children().first().text();

      })

      json.desc = $('.fact__condition').text()

      console.log(json)
    }

  })

})

  app.listen(8081, () => console.log('success connection'))


/*
  const uri = `https://api.weather.yandex.ru/v1/forecast?lat=${lat}&lon=${long}&hours=false`;

  console.log(uri)

  request({
    uri,
    headers: {
      'X-Yandex-API-Key': config["X-Yandex-API-Key"]
    }
  })
    .then(res => {
      console.log(20, res)
    })
    .catch(e => console.log(e))


 */


