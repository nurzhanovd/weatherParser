const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const cheerio = require('cheerio')

const app = express()

app.use(bodyParser.json())


app.get('/weather/:city', (req, res) => {
  const city = req.params.city;

  let lat;
  let lng;

  if(city.toLowerCase() === 'astana'){
    lat = '51.16052269999999'
    lng = '71.47035579999999'
  }else if(city.toLowerCase() === 'almaty'){
    lat = '43.2220146'
    lng = '76.8512485'
  }

  const url = `https://yandex.kz/pogoda/?lat=${lat}&lon=${lng}`;

  request(url, function (error, response, html) {

    if (!error) {
      const $ = cheerio.load(html);

      const json = {
        temp: "",
        desc: ""
      };


      $('.fact__temp').filter(function () {
        const data = $(this)

        json.temp = data.children().first().text();

      })

      json.desc = $('.fact__condition').text()

      if (json.temp && json.desc) res.status(200).json(json)
      else res.status(500).json({
        message: 'city is not found'
      })


    } else {
      res.status(500).json({
        message: 'error' + error
      })

    }
  })

})

app.listen(8081, () => console.log('success connection'))





