import * as path from 'path'
import {DockerComposeEnvironment} from 'testcontainers'
import axios from 'axios'

import message from './message'

describe('integration test', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  it('starts gateway', async () => {
    const filepath = path.join(__dirname, '../')
    const filename = 'docker-compose.json'
    const env = await new DockerComposeEnvironment(filepath, filename).withBuild().up()
    const container = env.getContainer("gateway");
    const res = await axios.get(`http://${container.getContainerIpAddress()}:${container.getMappedPort(3000)}`)
    expect(res.data.toString()).toEqual(message)
    await new Promise(resolve => setTimeout(resolve, 200000)) // remove this
    // `docker ps -a` and `docker logs <id>` the exited container
    await env.down()
  })
})
