#!/usr/bin/env node

const expect = require('chai').expect;
const spawn = require('child-process-promise').spawn;
const resultToObject = require('./utils').resultToObject
const mockServer = require('./servers/digestServer')

describe('resen methods with digest auth', function () {
    before(async function () {
        await mockServer.start()
    })

    after(function (done) {
        mockServer.stop(done)
    })

    it('get method with digest auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'get',
            url,
            '--ignore-stdin',
            '--auth-type', 'digest', '--auth', 'admin:admin'
        ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data[0].name).contain('Erős István');
    })

    it('post method with digest auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'post',
            url,
            '--ignore-stdin',
            '--auth-type', 'digest', '--auth', 'admin:admin',
            'name="Erős István"', 'city="Szeged"', 'salary=395.8'
          ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('put method with digestauth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'put',
            url + '/1',
            '--ignore-stdin',
            '--auth-type', 'digest', '--auth', 'admin:admin',
            'name="Erős István"', 'city="Szeged"', 'salary=395.8'
          ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('patch method withdigest auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'patch',
            url + '/1',
            '--ignore-stdin',
            '--auth-type', 'digest', '--auth', 'admin:admin',
            'name="Erős István"'
          ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('delete method with digest auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'delete',
            url + '/1',
            '--ignore-stdin',
            '--auth-type', 'digest', '--auth', 'admin:admin',
          ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.id).to.equal('1');
    })

})

