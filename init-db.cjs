const fs = require('fs');
const path = require('path');
const readline = require('readline');

const [flag, flagValue = 'true'] = process.argv.slice(2);

const dbPath = path.resolve(__dirname, 'db.json');
const dbExists = fs.existsSync(dbPath);

if (dbExists && flag === '--overwrite' && flagValue === 'false') {
    process.exit(0);
}

const writeDB = () => {
    fs.writeFile(
        dbPath,
        JSON.stringify(
            {
                projects: [],
                tasks: [],
                timelogs: [],
            },
            undefined,
            4
        ),
        'utf-8',
        (err) => {
            if (!err) {
                console.log('created db.json');
                process.exit(0);
            }
            console.error(err.message || err);
            process.exit(1);
        }
    );
};

(async () => {
    try {
        if (!dbExists || (flag === '--overwrite' && flagValue === 'true')) {
            return writeDB();
        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const overwrite = await new Promise((resolve) => {
            rl.on('close', () => resolve(false));
            rl.question(
                'db.json already exists, overwrite it? y/n ',
                (answer) => resolve(/^y(es)?$/i.test(answer))
            );
        });
        rl.close();
        if (!overwrite) {
            console.log('operation cancelled');
            return;
        }
        writeDB();
    } catch (err) {
        console.log(err.message || err);
    }
})();
