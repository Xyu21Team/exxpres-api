__path = process.cwd()
const express = require('express')
const axios = require('axios')
const fetch = require('node-fetch')
const translate = require('translate-google')
const fs = require('fs')
const Jimp = require('jimp')
const FormData = require('form-data')
const baseUrl = 'https://tools.betabotz.org'
const { toanime, tozombie } = require(__path + "/lib/turnimg.js")
const request = require('request')
const { openai } = require(__path + "/lib/openai.js")
const dylux = require('api-dylux')
const textto = require('soundoftext-js')
const googleIt = require('google-it')
const { shortText } = require("limit-text-js")
const TinyURL = require('tinyurl');
const emoji = require("emoji-api");
const isUrl = require("is-url")
const { ytMp4, ytMp3 } = require(__path + '/lib/y2mate')
const BitlyClient = require('bitly').BitlyClient
const { fetchJson, getBuffer } = require(__path + '/lib/myfunc')
const isNumber = require('is-number');
const router = express.Router()
const ryzen = require("../lib/listdl")
var error = __path + '/view/error.html'
let creator = 'NeofetchNpc!'

// JARAK
// Bagian Logs - Error Dll
loghandler = {
	error: {
		status: false,
		code: 503,
		message: "service got error, try again in 10 seconds",
		creator: creator
	},
	noturl: {
		status: false,
		code: 503,
		message: "enter paramater url",
		creator: creator
	},
	nottext: {
		status: false,
		code: 503,
		message: "enter parameter text",
		creator: creator
	},
	notquery: {
		status: false,
		code: 503,
		message: "enter parameter query",
		creator: creator
	},
	notusername: {
		status: false,
		code: 503,
		message: "enter parameter username",
		creator: creator
	}
}

// JARAK
// *** DOWNLOADER ***
router.get('/dowloader/fbdown', async (req, res) => {
	let url = req.query.url
	if (!url) return res.json(loghandler.noturl)
	ryzen.fbdown(url)
		.then(async data => {
			if (!data.Normal_video) return res.json(loghandler.error)
			res.json({
				status: true,
				code: 200,
				result: data,
				creator: creator
			})
		}).catch(e => {
			console.error(e)
		})
})
router.get('/dowloader/twitter', async (req, res) => {
	let url = req.query.url
	if (!url) return res.json(loghandler.noturl)
	ryzen.twitter(url)
		.then(async data => {
			if (!data.video) return res.json(loghandler.error)
			res.json({
				status: true,
				code: 200,
				result: data,
				creator: creator
			})
		}).catch(e => {
			console.error(e)
		})
})
router.get('/dowloader/tikok', async (req, res) => {
	let url = req.query.url
	if (!url) return res.json(loghandler.noturl)
	ryzen.musically(url)
		.then(async data => {
			if (!data) return res.json(loghandler.error)
			res.json({
				status: true,
				code: 200,
				result: data,
				creator: creator
			})
		}).catch(e => {
			console.error(e)
		})
})
router.get('/dowloader/igstorydowloader', async (req, res, next) => {
	var username = req.query.username
	if (!url) return res.json({ status: false, code: 503, creator: `${creator}`, message: "[!] enter username parameter!" })
	ryzen.igstory(username).then(async (data) => {
		if (!data) return res.json(loghandler.instgram)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	})
})
router.get('/dowloader/igdowloader', async (req, res, next) => {
	var url = req.query.url
	if (!url) return res.json({ status: false, code: 503, creator: `${creator}`, message: "[!] enter url parameter!" })
	if (!/^((https|http)?:\/\/(?:www\.)?instagram\.com\/(p|tv|reel|stories)\/([^/?#&]+)).*/i.test(url)) return res.json(loghandler.noturl)
	ryzen.igdl(url).then(async (data) => {
		if (!data) return res.json(loghandler.instgram)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch(e => {
		res.json(loghandler.noturl)
	})
})
router.get('/dowloader/yt', async (req, res, next) => {
	var url = req.query.url
	if (!url) return res.json({ status: false, code: 503, creator: `${creator}`, message: "[!] enter url parameter!" })
	var mp3 = await ytMp3(url)
	var mp4 = await ytMp4(url)
	if (!mp4 || !mp3) return res.json(loghandler.noturl)
	res.json({
		status: true,
		code: 200,
		creator: `${creator}`,
		result: {
			title: mp4.title,
			desc: mp4.desc,
			thum: mp4.thumb,
			view: mp4.views,
			channel: mp4.channel,
			uploadDate: mp4.uploadDate,
			mp4: {
				result: mp4.result,
				size: mp4.size,
				quality: mp4.quality
			},
			mp3: {
				result: mp3.result,
				size: mp3.size
			}
		}
	})
})
router.get('/dowloader/soundcloud', async (req, res, next) => {
	var url = req.query.url
	if (!url) return res.json({ status: false, code: 503, creator: `${creator}`, message: "[!] enter url parameter!" })
	ryzen.soundcloud(url).then(data => {
		if (!data.download) return res.json(loghandler.noturl)
		res.json({
			status: true,
			code: 503,
			creator: `${creator}`,
			result: data
		})
	}).catch(e => {
		res.json(loghandler.error)
	})
})
router.get('/downloader/gdrivedl', async (req, res, next) => {
	var url = req.query.url
	if (!url) return res.json({ status: false, creator: `${creator}`, message: "[!] enter url parameter!" })
	dylux.GDriveDl(url).then(data => {
		if (!data) return res.json({ status: false, creator: creator, message: "[!] data tidak ditemukan" })
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	})
		.catch(e => {
			res.json(loghandler.error)
		})
})
router.get('/downloader/mediafire', async (req, res, next) => {
	var url = req.query.url
	if (!url) return res.json({ status: false, creator: `${creator}`, message: "[!] enter url parameter!" })
	ryzen.mediafiredl(url).then(async (data) => {
		if (!data) return res.json(loghandler.noturl)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch(e => {
		res.json(loghandler.noturl)
	})
})
router.get('/downloader/sfilemobi', async (req, res, next) => {
	var url = req.query.url
	if (!url) return res.json({ status: false, creator: `${creator}`, message: "[!] enter url parameter!" })
	ryzen.sfilemobi(url).then(async (data) => {
		if (!data) return res.json(loghandler.noturl)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch(e => {
		res.json(loghandler.noturl)
	})
})

// JARAK
// ***SEARCH***
router.get('/search/npmsearch', async (req, res, next) => {
	var text1 = req.query.query
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] enter query parameter!" })
	dylux.npmSearch(text1).then((data) => {
		if (!data) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch((err) => {
		res.sendFile(error)
	})
})
router.get('/search/pinterest', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	ryzen.pinterest(text1).then((data) => {
		if (!data[0]) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch((err) => {
		res.json(loghandler.notfound)
	})
})
router.get('/search/ringtone', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	ryzen.ringtone(text1).then((data) => {
		if (!data) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch((err) => {
		res.json(loghandler.notfound)
	})
})
router.get('/search/wikimedia', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	ryzen.wikimedia(text1).then((data) => {
		if (!data[0]) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch((err) => {
		res.json(loghandler.notfound)
	})
})
router.get('/search/wallpaper2', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	ryzen.wallpaper(text1).then((data) => {
		if (!data[0]) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch((err) => {
		res.json(loghandler.notfound)
	})
})
router.get('/search/google', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	googleIt({ 'query': text1 }).then(results => {
		if (!results[0]) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: results
		})
	}).catch(e => {
		res.json(loghandler.notfound)
	})
})
router.get('/search/ytplay', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	let yts = require("yt-search")
	let search = await yts(text1)
	let url = search.all[Math.floor(Math.random() * search.all.length)]
	var mp3 = await ytMp3(url.url)
	var mp4 = await ytMp4(url.url)
	if (!mp4 || !mp3) return res.json(loghandler.noturl)
	res.json({
		status: true,
		creator: `${creator}`,
		result: {
			title: mp4.title,
			desc: mp4.desc,
			thum: mp4.thumb,
			view: mp4.views,
			channel: mp4.channel,
			ago: url.ago,
			timestamp: url.timestamp,
			uploadDate: mp4.uploadDate,
			author: url.author,
			mp4: {
				result: mp4.result,
				size: mp4.size,
				quality: mp4.quality
			},
			mp3: {
				result: mp3.result,
				size: mp3.size
			}
		}
	})
})
router.get('/search/sticker', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	ryzen.stickersearch(text1).then(data => {
		if (!data) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch(e => {
		res.json(loghandler.error)
	})
})
router.get('/search/sfilemobi', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	ryzen.sfilemobiSearch(text1).then(data => {
		if (!data) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch(e => {
		res.json(loghandler.error)
	})
})

// JARAK
// ***TOOLS***
router.get('/tools/remini', async (req, res) => {
	let url = req.query.url
	if (!url) return res.json(loghandler.noturl)
	const { remini } = require(__path + "/lib/scrape.js")
	remini(url)
		.then(async data => {
			res.json({
				status: true,
				code: 200,
				result: data,
				creator: creator
			})
		}).catch(e => {
			console.error(e)
		})
})
router.get('/tools/toanime', async (req, res) => {
	let url = req.query.url
	if (!url) return res.json(loghandler.noturl)
	const { toanime } = require(__path + "/lib/scrape.js")
	toanime(url)
		.then(async data => {
			res.json({
				status: true,
				code: 200,
				result: data,
				creator: creator
			})
		}).catch(e => {
			console.error(e)
		})
})
router.get('/tools/removebg', async (req, res) => {
	let url = req.query.url
	if (!url) return res.json(loghandler.noturl)
	const { removebg } = require(__path + "/lib/scrape.js")
	removebg(url)
		.then(async data => {
			res.json({
				status: true,
				code: 200,
				result: data,
				creator: creator
			})
		}).catch(e => {
			console.error(e)
		})
})
router.get('/tools/tinyurl', async (req, res) => {
	let text = req.query.url
	if (!text) return res.json(loghandler.noturl)
	let islink = isUrl(text)
	if (!islink) return res.json({ status: false, code: 503, message: "enter valid url", creator: creator })
	TinyURL.shorten(text, function (text, err) {
		if (err) return res.json(loghandler.error)
		res.json({
			status: true,
			creator: `${creator}`,
			result: text
		})
	});
})
router.get('/tools/decode', async (req, res) => {
	let text = req.query.text
	if (!text) return res.json(loghandler.nottext)
	if (text.length > 2048) return res.json({ status: false, code: 503, message: "maximum string is 2.048", creator: creator })
	res.json({
		status: true,
		code: 200,
		result: Buffer.from(text, 'base64').toString('ascii')
	})
})
router.get('/tools/encode', async (req, res) => {
	let text = req.query.text
	if (!text) return res.json(loghandler.nottext)
	if (text.length > 2048) return res.json({ message: "maximum text is 2.048" })
	res.json({
		status: true,
		creator: `${creator}`,
		result: Buffer.from(text).toString('base64')
	})
})
router.get('/tools/gitstalk', async (req, res) => {
	let text = req.query.user
	if (!text) return res.json({ message: "enter parameter user!" })
	let gitstalk = await fetchJson(`https://api.github.com/users/` + text)
	res.json({
		status: true,
		code: 200,
		result: gitstalk,
		creator: creator
	})
})
router.get('/tools/ssweb', async (req, res) => {
	let text = req.query.url
	if (!text) return res.json(loghandler.noturl)
	let islink = isUrl(text)
	if (!islink) return res.json({ message: "use https://" })
	ryzen.ssweb(text)
		.then((data) => {
			if (!data) return res.json(loghandler.error)
			res.set({ 'Content-Type': 'image/png' })
			res.send(data)
		}).catch(e => {
			console.error(e)
		})
})

// Module Exports </>
module.exports = router