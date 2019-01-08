const http = require('http');

exports.request = function request(url, queryMapping = {}) {
	const resolvedURL = new URL(url);

	Object.keys(queryMapping).forEach(key => {
		resolvedURL.searchParams.set(key, queryMapping[key]);
	});

	return new Promise((resolve, reject) => {
		http.get(resolvedURL, res => {
			const { statusCode } = res;
	
			if (res.statusCode !== 200 && res.statusCode !== 302) {
				res.resume();
				return reject (new Error(`Request Failed.\nStatus Code: ${statusCode}`));
			}
			
			let data = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => { data += chunk; });
			res.on('end', () => resolve({
				data,
				headers: res.headers,
				status: res.statusCode
			}));
		}).on('error', error => reject(error));
	});
};

exports.getRawBody = function getRawBody(request) {
	let data = '';

	return new Promise((resolve, reject) => {
		request.on('data', trunk => data += trunk);
		request.on('end', () => resolve(data));
		request.on('error', error => reject(error));
	});
};

const { parseString } = require('xml2js');
const { stripPrefix } = require('xml2js/lib/processors');

exports.parseXML = function parseXML(xmlString) {
	return new Promise((resolve, reject) => {
		parseString(xmlString, {
			explicitRoot: false,
			tagNameProcessors: [stripPrefix]
		}, (error, result) => {
			if (error) {
				return reject(error);
			}
			
			resolve(result);
		});
	});
};

exports.sendRedirect = function sendRedirect(response, url) {
	response.setHeader('Location', url);
	response.statusCode = 302;
};

const PT_REG = /^PT/;

exports.isPT = function (ticketId) {
	return PT_REG.test(ticketId);
};