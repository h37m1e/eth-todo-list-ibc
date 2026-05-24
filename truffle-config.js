/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 */

module.exports = {

    networks: {
  development: {
    host: "127.0.0.1",
    port: 7545,
    network_id: "1337"
  }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
     timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
       //docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
       settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
         runs: 200
        },
        evmVersion: "byzantium"
       }
    }
  }
}
