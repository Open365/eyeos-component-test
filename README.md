Eyeos Component Test Library
============================

## Overview

Library for easily doing component-tests on eyeos backend services

## How to use it

1- Include the eyeos-compose-test library into the package.json of your project (as a devDependency)

```bash
$ npm install
```

2- *execute-component-tests* execute the component tests that are defined inside the component-test folder:

```bash
./node_modules/.bin/execute-component-tests --timeout 15000
```

    - You can pass timeout and it **rewrites BUS_EXPECTATION_TIMEOUT and EYEOS_HIPPIE_TIMEOUT and mocha runner TIMEOUT.**
    - Also you can execute some other command as acceptance tests (because of common logic that checks ports):

    ```bash
    ./node_modules/.bin/execute-component-tests --command "path/to/acceptance-test.sh"
    ```

3- *pipe-logs* extract the component test logs:

```bash
./node_modules/.bin/pipe-logs
```

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ ./tests.sh
```
