var express = require('express')
var router = express.Router()
const superagent = require('superagent')
const cheerio = require('cheerio')
const charset = require('superagent-charset')
charset(superagent)
const async = require('async')
const AddrModel = require('../model/addr')
const urlPre = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/'

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' })
})

router.get('/api/address/getProvince', (req, res, next) => {
    AddrModel.find({ level: 1 }).then(docs => {
        if (docs && docs.length) {
            res.send(docs)
        } else {
            getProvinces().then(provinces => {
                AddrModel.insertMany(
                    provinces.map(province => ({
                        id: +province.value,
                        title: province.label,
                        parentId: 0,
                        level: 1
                    }))
                ).then(docs => {
                    res.send(docs)
                })
            })
        }
    })
})

router.get('/api/address/getCity', (req, res, next) => {
    let parentId = +req.query.p_id
    AddrModel.find({ level: 2, parentId: parentId }).then(docs => {
        if (docs && docs.length) {
            res.send(docs)
        } else {
            getCitys({ url: parentId + '.html' }).then(citys => {
                AddrModel.insertMany(
                    citys.map(city => ({
                        id: +city.value,
                        title: city.label,
                        parentId: parentId,
                        level: 2
                    }))
                ).then(docs => {
                    res.send(docs)
                })
            })
        }
    })
})

router.get('/api/address/getCounty', (req, res, next) => {
    let parentId = +req.query.p_id
    AddrModel.find({ level: 3, parentId: parentId }).then(docs => {
        if (docs && docs.length) {
            res.send(docs)
        } else {
            AddrModel.findOne({ id: parentId }).then(doc => {
                getCountys({ url: doc.parentId + '/' + parentId + '.html' }).then(countys => {
                    AddrModel.insertMany(
                        countys.map(county => ({
                            id: +county.value,
                            title: county.label,
                            parentId: parentId,
                            level: 3
                        }))
                    ).then(docs => {
                        res.send(docs)
                    })
                })
            })
        }
    })
})

function getProvinces() {
    const uri = urlPre + 'index.html'
    return getHTML(uri).then(text => {
        return html2Province(text)
    })
}

function getCitys(province) {
    const uri = urlPre + province.url
    return getHTML(uri).then(text => {
        return html2City(text)
    })
}

function getCountys(province) {
    const uri = urlPre + province.url
    return getHTML(uri).then(text => {
        return html2County(text)
    })
}

function html2Province(text) {
    const $ = cheerio.load(text)

    return $('.provincetable a')
        .map(function(index, el) {
            let url = $(this).attr('href')
            return {
                label: $(this).text(),
                // url: url,
                value: url.replace('.html', '')
            }
        })
        .get()
}

function html2City(text) {
    const $ = cheerio.load(text)

    return $('.citytr a')
        .map(function(index, el) {
            let url = $(this).attr('href')
            return index % 2
                ? {
                      label: $(this).text(),
                      url: url,
                      p_id: url.split('/')[0],
                      value: url.split('/')[1].replace('.html', '')
                  }
                : void 0
        })
        .get()
}

function html2County(text) {
    const $ = cheerio.load(text)

    return $('.countytr a')
        .map(function(index, el) {
            let url = $(this).attr('href')
            return index % 2
                ? {
                      label: $(this).text(),
                      url: url,
                      p_id: url.split('/')[0],
                      value: url.split('/')[1].replace('.html', '')
                  }
                : void 0
        })
        .get()
}

function getHTML(uri) {
    return new Promise((resolve, reject) => {
        superagent
            .get(uri)
            .charset('gbk')
            .end(function(err, sres) {
                // 常规的错误处理
                if (err) {
                    return reject(err)
                }
                resolve(sres.text)
            })
    })
}

module.exports = router
