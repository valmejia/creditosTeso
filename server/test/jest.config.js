module.exports = {
    testEnvironment: "node", // Ensure the test environment is set to node (since it's a backend project)
    verbose: true, // Optional, prints test results in more detail
    transform: {
      "^.+\\.js$": "babel-jest", // Use babel-jest to transpile JS files
    },
  };
  