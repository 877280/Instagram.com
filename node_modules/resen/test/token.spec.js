#!/usr/bin/env node

const expect = require('chai').expect;
const spawn = require('child-process-promise').spawn;
const resultToObject = require('./utils').resultToObject
const mockServer = require('./servers/tokenServer')
const jwt = require('jsonwebtoken');

describe('resen methods with token auth', function () {
    var token = null
    before(async function () {
        token = jwt.sign({ id: 1 }, 'my_secret_key', {
            expiresIn: 86400
        })
        await mockServer.start()
    })

    after(function (done) {
        mockServer.stop(done)
    })

    it('get method with token auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'get',
            url,
            '--ignore-stdin',
            '--auth-type', 'bearer', '--auth', `${token}`
        ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data[0].name).contain('Erős István');
    })

    it('post method with token auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'post',
            url,
            '--ignore-stdin',
            '--auth-type', 'bearer', '--auth', `${token}`,
            'name="Erős István"', 'city="Szeged"', 'salary=395.8'
          ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('put method with token auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'put',
            url + '/1',
            '--ignore-stdin',
            '--auth-type', 'bearer', '--auth', `${token}`,
            'name="Erős István"', 'city="Szeged"', 'salary=395.8'
          ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('patch method with token auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'patch',
            url + '/1',
            '--ignore-stdin',
            '--auth-type', 'bearer', '--auth', `${token}`,
            'name="Erős István"'
          ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('delete method with token auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'delete',
            url + '/1',
            '--ignore-stdin',
            '--auth-type', 'bearer', '--auth', `${token}`,
          ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.id).to.equal('1');
    })

})

