#!/usr/bin/env node

const expect = require('chai').expect;
const spawn = require('child-process-promise').spawn;
const resultToObject = require('./utils').resultToObject
const mockServer = require('./servers/simpleServer')

describe('resen methods without auth', function () {
    before(async function () {
        await mockServer.start()
    })

    after(function (done) {
        mockServer.stop(done)
    })

    it('get method without auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'get',
            url,
            '--ignore-stdin',
        ],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data[0].name).contain('Erős István');
    })

    it('post method without auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'post',
            url,
            '--ignore-stdin',
            'name="Erős István"', 'city="Szeged"', 'salary=395.8'],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('put method without auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'put',
            url + '/1',
            '--ignore-stdin',
            'name="Erős István"', 'city="Szeged"', 'salary=395.8'],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('patch method without auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'patch',
            url + '/1',
            '--ignore-stdin',
            'name="Erős István"'],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.name).contain('Erős István');
    })

    it('delete method without auth', async function () {
        const url = mockServer.getUrl()
        const result = await spawn('node', ['res.js', 'delete',
            url + '/1',
            '--ignore-stdin'],
            { capture: ['stdout', 'stderr'] })

        const resObj = resultToObject(result)
        expect(resObj.success).to.be.true;
        expect(resObj.data.id).to.equal('1');
    })

})

