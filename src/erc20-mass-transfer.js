const fs = require("fs");
const CSVParser = require("csv-parse/lib/sync");
const GetCSVWriter = require('csv-writer').createObjectCsvWriter;
const optimist = require('optimist');

const ENCODING = 'utf-8';

module.exports = () => {

    var argv = optimist.argv;
    const csvFilePath = argv.data;
    const txBatchSize = argv.batch_size;
    const source = "0x" + argv.source;
    const abiPath = argv.abi;
    const erc20TokenAddress = "0x" + argv.token_address;

    const abi = fs.readFileSync(abiPath).toString(ENCODING);
    const jsonAbi = JSON.parse(abi);
    const erc20Instance = web3.eth.contract(jsonAbi.abi).at(erc20TokenAddress);

    const rawData = fs.readFileSync(csvFilePath).toString(ENCODING);
    const data = CSVParser(rawData, {columns: true});

    if (data.length == 0) {
        throw "Data file is empty or incorrect CSVParser format. Aborted";
    }

    console.log(data);

    let transfers = [];
    for (let row of data) {
        transfers.push({address: web3.toHex(row.address), amount: row.amount});
    }

    console.log("Amount addresses to transfer : ", transfers.length);

    const logs = [];
    const logPath = csvFilePath.slice(0, csvFilePath.lastIndexOf('/')) + "/log.txt";
    const logWriter = GetCSVWriter({
        encoding: ENCODING,
        path: logPath,
        header: [
            {id: 'address', title: 'address'},
            {id: 'amount', title: 'amount'},
            {id: 'hash', title: 'hash'},
            {id: 'status', title: 'status'}
        ]
    });
    console.log("Log path.", logPath);

    terminal(0);

    function terminal(position) {
        const stdin = process.stdin, stdout = process.stdout;

        stdin.resume();
        stdout.write("Continue? (print 'exit' to finish or ctrl+C) ");

        stdin.once('data', (data) => {
            data = data.toString().trim();

            if (data == "exit") {
                process.exit();
            } else {
                doBalanceTransfer(position)
            }
        });
    }

    function doBalanceTransfer(fromIdx) {
        if (fromIdx == transfers.length) {
            console.log("Finished");
            return;
        }

        const batch = [];

        const count = parseInt(fromIdx) + parseInt(txBatchSize);
        const to = count >= transfers.length ? transfers.length : count;

        for (let from = fromIdx; from < to; from++) {
            const promise = send(transfers[from]);
            batch.push(promise);
        }

        Promise
            .all(batch)
            .then(result => {
                console.log("Transfered. From idx", fromIdx, "to", to - 1);

                logWriter.writeRecords(logs);

                terminal(to);
            });
    }

    function send(account) {
        return new Promise((resolve, reject) => {

            console.log("Send new transaction for", account.address);

            const logObject = {};
            logObject.address = account.address;

            erc20Instance.balanceOf.call(source, (err, currentBalance) => {
                if (err) {
                    logObject.status = "[ERR] Failed to send for " + account.address + ". Error: " + err.toString();
                    logs.push(logObject);
                    return reject(err);
                }

                console.log("Current balance of ", source, " is", currentBalance.valueOf());

                logObject.balance = currentBalance.valueOf();

                console.log(source);
                console.log(account.address);



                if (parseInt(currentBalance.valueOf()) < parseInt(account.amount)) {

                    console.log(account.amount);
                    console.log(currentBalance.valueOf());

                    logObject.status = "[ERR] Insufficient funds for transfer to " + account.address;
                    logs.push(logObject);
                    return resolve(logObject);
                }

                erc20Instance.transferFrom(source, account.address, account.amount, {from: source}, (err, hash) => {

                        if (err) {
                            console.log("Error", err);

                            logObject.status = "[ERR] " + err.toString();
                            logs.push(logObject);
                            return reject(err);
                        }

                        logObject.hash = hash;
                        console.log("[INFO] Transaction send: ", logObject.hash);
                        logObject.status = "INFO] Transaction send:" + logObject.hash;
                        logs.push(logObject);
                        return resolve(hash);

                    }
                );
            });
        })
    }
};
